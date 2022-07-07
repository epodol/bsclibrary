import functions from 'firebase-functions';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

import checkinBookData from '@common/functions/checkinBook';

import Checkout from '@common/types/Checkout';
import Copy from '@common/types/Copy';
import RecursivePartial from '@common/types/util/RecursivePartial';

const checkinBook = functions
  .region('us-west2')
  .https.onCall(async (data: checkinBookData, context) => {
    const firestore = getFirestore();

    // App Check Verification
    if (!context.app && process.env.NODE_ENV === 'production') {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called from an App Check verified app.'
      );
    }

    // Auth Verification
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    if (!context.auth.token.permissions.CHECK_IN) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'CHECK_IN' permission."
      );
    }

    // Type Verification
    if (
      typeof data.bookID !== 'string' ||
      typeof data.copyID !== 'string' ||
      typeof data.condition !== 'number' ||
      typeof data.status !== 'number'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    // Type Check
    if (data.condition < 0 || data.condition > 5) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The condition argument must be between 0 and 5.'
      );
    }

    if (data.status < 0 || data.status > 1) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The status argument must be between 0 and 1.'
      );
    }

    // Get the checkout from the database
    const checkoutDocs = await firestore
      .collection('checkouts')
      .where('bookID', '==', data.bookID)
      .where('copyID', '==', data.copyID)
      .where('checkoutStatus', '==', 0)
      .get();

    // Check if the checkout exists or there is more than one
    if (checkoutDocs.size !== 1) {
      throw new functions.https.HttpsError(
        'internal',
        `There were either 0 or multiple checkouts with that Copy and Book`
      );
    }

    // Get the checkout data
    const checkoutDoc = checkoutDocs.docs[0];
    const checkoutData = checkoutDoc.data() as Checkout;

    // Create a batched update
    const batch = firestore.batch();

    if (checkoutData.dueDate === null) {
      // If the checkout has no due date, set it to the current date
      throw new functions.https.HttpsError(
        'internal',
        'The checkout has no due date.'
      );
    }

    // Updated checkout data
    const updatedCheckoutDocData: RecursivePartial<Checkout> = {
      checkedInBy: context.auth.uid,
      conditionIn: data.condition,
      timeIn: FieldValue.serverTimestamp(),
    };

    const userRef = firestore.collection('users').doc(checkoutData.userID);

    const user = {
      // Dot notation required to avoid overriding the entire checkoutInfo object
      'checkoutInfo.activeCheckouts': FieldValue.arrayRemove(
        checkoutDoc.id
      ) as unknown as string[],
    };

    const copy: RecursivePartial<Copy> = {
      lastEdited: FieldValue.serverTimestamp() as Timestamp,
      lastEditedBy: context.auth?.uid,
      condition: data.condition,
      status: data.status,
    };

    batch.update(checkoutDoc.ref, updatedCheckoutDocData);
    batch.update(userRef, user);
    batch.update(
      firestore.doc(`/books/${data.bookID}/copies/${data.copyID}`),
      copy
    );

    await batch.commit().catch((err) => {
      functions.logger.error(context, data, err);
      throw new functions.https.HttpsError(
        'internal',
        `There was an error checking in: ${err}`
      );
    });

    return {
      checkoutID: checkoutDoc.id,
      userID: checkoutData.userID,
      overdue: checkoutData.dueDate.toMillis() < new Date().getTime(),
    };
  });

export default checkinBook;
