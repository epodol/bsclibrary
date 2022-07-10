import functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

import checkoutBookData, {
  checkoutBookResult,
} from '@common/functions/checkoutBook';

import Checkout from '@common/types/Checkout';
import Copy from '@common/types/Copy';
import User from '@common/types/User';

const checkoutBook = functions
  .region('us-west2')
  .https.onCall(async (data: checkoutBookData, context) => {
    const auth = getAuth();
    const firestore = getFirestore();

    // App Check Verification
    if (!context.app && process.env.NODE_ENV === 'production') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      );
    }

    // Auth Verification
    if (!context.auth || !context.auth.uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    if (
      !context.auth.token.permissions.CHECK_OUT.includes(data.libraryID) &&
      !context.auth.token.librariesOwned.includes(data.libraryID)
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'CHECK_OUT' permission."
      );
    }

    if (
      typeof data.userID !== 'string' ||
      typeof data.books !== 'object' ||
      typeof data.libraryID !== 'string'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    await auth.getUser(data.userID).catch(() => {
      throw new functions.https.HttpsError('invalid-argument', 'Unknown User');
    });

    // TODO: Check if the user has the correct permissions to check out books (not expired and in the library)

    const result: checkoutBookResult = {
      booksCheckedOut: [],
    };

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < data.books.length; i += 1) {
      const book = data.books[i];

      const checkout: Checkout = {
        bookID: book.bookID,
        copyID: book.copyID,
        userID: data.userID,
        returned: false,
        checkedOutBy: context.auth.uid,
        checkedInBy: null,
        dueDate: Timestamp.fromMillis(book.dueDate),
        timeOut: FieldValue.serverTimestamp() as Timestamp,
        timeIn: null,
        conditionOut: book.condition,
        conditionIn: null,
        conditionDiff: null,
        renewsUsed: 0,
      };

      const newCheckout = firestore
        .collection(`libraries/${data.libraryID}/checkouts`)
        .doc();

      const user: Partial<User> = {
        activeCheckouts: FieldValue.arrayUnion(newCheckout.id) as any,
      };

      const copy: Partial<Copy> = {
        updatedAt: FieldValue.serverTimestamp() as Timestamp,
        updatedBy: context.auth?.uid,
        condition: book.condition,
        status: 2,
      };

      const batch = firestore.batch();

      // Create the checkout document
      batch.create(newCheckout, checkout);
      // Add the checkout to the user document
      batch.update(
        firestore
          .collection(`libraries/${data.libraryID}/users`)
          .doc(data.userID),
        user
      );
      // Update the copy's status
      batch.update(
        firestore
          .collection('libraries')
          .doc(data.libraryID)
          .collection('books')
          .doc(book.bookID)
          .collection('copies')
          .doc(book.copyID),
        copy
      );

      await batch
        .commit()
        .then(() => {
          result.booksCheckedOut.push({
            bookID: book.bookID,
            copyID: book.copyID,
            checkoutID: newCheckout.id,
          });
        })
        .catch((err) => {
          console.error('Error creating checkout: ', err);
        });
    }
    /* eslint-enable no-await-in-loop */

    return result;
  });

export default checkoutBook;
