import functions from 'firebase-functions';
import admin from 'firebase-admin';

import renewCheckoutData from '@common/functions/renewCheckout';

import Checkout from '@common/types/Checkout';
import RecursivePartial from '@common/types/RecursivePartial';
// import RecursivePartial from '@common/types/RecursivePartial';

const renewCheckout = functions
  .region('us-west2')
  .https.onCall(async (data: renewCheckoutData, context) => {
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

    // Role Verification
    if (typeof context.auth.token.role === 'undefined') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The caller must already have a set role.'
      );
    }

    // Arguments Verification
    if (typeof data.checkoutID !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    // Checkout Verification
    if (
      typeof context.auth.token?.checkoutInfo?.activeCheckouts === 'undefined'
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The caller must already have a set active checkout array.'
      );
    }

    if (context.auth.token?.checkoutInfo?.activeCheckouts.length === 0) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The caller must already have an active checkout.'
      );
    }

    if (
      !context.auth.token.checkoutInfo.activeCheckouts.includes(data.checkoutID)
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The requested checkout must be active.'
      );
    }

    const checkoutDoc = await admin
      .firestore()
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
    if (context.auth.token.checkoutInfo.maxRenews - checkout.renewsUsed <= 0) {
      throw new functions.https.HttpsError(
        'permission-denied',
        `The checkout with ID ${data.checkoutID} has already been renewed the maximum number of times.`
      );
    }

    const newCheckout: RecursivePartial<Checkout> = {
      dueDate: admin.firestore.Timestamp.fromMillis(
        checkout.dueDate.toDate().valueOf() + 7 * 24 * 60 * 60 * 1000
      ),
      // Since we can not increment the dueDate, we will not increment the renewsUsed
      renewsUsed: checkout.renewsUsed + 1,
    };
    admin
      .firestore()
      .collection('checkouts')
      .doc(data.checkoutID)
      .update(newCheckout);
  });

export default renewCheckout;
