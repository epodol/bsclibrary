import functions from 'firebase-functions';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import renewCheckoutData from '@common/functions/renewCheckout';

import Checkout from '@common/types/Checkout';
import RecursivePartial from '@common/types/util/RecursivePartial';
import User from '@common/types/User';

const renewCheckout = functions
  .region('us-west2')
  .https.onCall(async (data: renewCheckoutData, context) => {
    const firestore = getFirestore();

    // App Check Verification
    if (!context.app && process.env.NODE_ENV === 'production') {
      throw new functions.https.HttpsError(
        'failed-precondition',
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

    // Arguments Verification
    if (typeof data.checkoutID !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    const libraryDoc = await firestore
      .collection('libraries')
      .doc(data.libraryID)
      .get();

    if (!libraryDoc.exists) {
      throw new functions.https.HttpsError('not-found', `Library not found.`);
    }

    const userDoc = await firestore
      .collection('libraries')
      .doc(data.libraryID)
      .collection('users')
      .doc(context.auth.uid)
      .get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        `The user with ID ${context.auth.uid} does not have a user document.`
      );
    }

    const user: User = userDoc.data() as User;

    if (!user.activeCheckouts.includes(data.checkoutID)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The requested checkout must be active.'
      );
    }

    const checkoutDoc = await firestore
      .collection('libraries')
      .doc(data.libraryID)
      .collection('checkouts')
      .doc(data.checkoutID)
      .get();

    if (!checkoutDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        `The checkout with ID ${data.checkoutID} does not exist.`
      );
    }
    const checkout = checkoutDoc.data() as unknown as Checkout;
    if (checkout.userID !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        `The checkout with ID ${data.checkoutID} does not belong to the user.`
      );
    }
    if (user.maxRenews - checkout.renewsUsed <= 0) {
      throw new functions.https.HttpsError(
        'permission-denied',
        `The checkout with ID ${data.checkoutID} has already been renewed the maximum number of times.`
      );
    }

    const newCheckout: RecursivePartial<Checkout> = {
      dueDate: Timestamp.fromMillis(
        checkout.dueDate.toDate().valueOf() + 7 * 24 * 60 * 60 * 1000
      ),
      // Since we can not increment the dueDate, we will not increment the renewsUsed
      renewsUsed: checkout.renewsUsed + 1,
    };
    firestore
      .collection('libraries')
      .doc(data.libraryID)
      .collection('checkouts')
      .doc(data.checkoutID)
      .update(newCheckout);
  });

export default renewCheckout;
