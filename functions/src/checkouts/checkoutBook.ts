import functions from 'firebase-functions';
import admin from 'firebase-admin';

import checkoutBookData from '@common/functions/checkoutBook';

import Checkout from '@common/types/Checkout';
import Copy from '@common/types/Copy';
import RecursivePartial from '@common/types/RecursivePartial';

const checkoutBook = functions
  .region('us-west2')
  .https.onCall(async (data: checkoutBookData, context) => {
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

    if (typeof context.auth.token.role === 'undefined') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The caller must already have a set role.'
      );
    }

    if (!context.auth.token.permissions.CHECK_OUT) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'CHECK_OUT' permission."
      );
    }

    if (typeof data.userID !== 'string' || typeof data.books !== 'object') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    await admin
      .auth()
      .getUser(data.userID)
      .catch(() => {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Unknown User'
        );
      });

    data.books.forEach(async (book) => {
      const checkout: RecursivePartial<Checkout> = {
        bookID: book.bookID,
        copyID: book.copyID,
        userID: data.userID,
        checkedOutBy: context.auth?.uid,
        checkedInBy: null,
        dueDate: admin.firestore.Timestamp.fromMillis(book.dueDate),
        timeOut:
          admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
        timeIn: null,
        conditionOut: book.condition,
        conditionIn: null,
        renewsUsed: 0,
        checkoutStatus: 0,
      };

      const newCheckout = admin.firestore().collection('checkouts').doc();

      const user = {
        // Dot notation required to avoid overriding the entire checkoutInfo object
        'checkoutInfo.activeCheckouts': admin.firestore.FieldValue.arrayUnion(
          newCheckout.id
        ) as unknown as string[],
      };

      const copy: RecursivePartial<Copy> = {
        lastEdited:
          admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
        lastEditedBy: context.auth?.uid,
        condition: book.condition,
        status: 2,
      };

      const batch = admin.firestore().batch();

      // Create the checkout document
      batch.create(newCheckout, checkout);
      // Add the checkout to the user document
      batch.update(
        admin.firestore().collection('users').doc(data.userID),
        user
      );
      // Update the copy's status
      batch.update(
        admin
          .firestore()
          .collection('books')
          .doc(book.bookID)
          .collection('copies')
          .doc(book.copyID),
        copy
      );

      await batch.commit().catch((err) => {
        console.error('Error creating checkout: ', err);
      });
    });

    return null;
  });

export default checkoutBook;
