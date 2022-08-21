import functions from 'firebase-functions';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

import approveUserData, {
  approveUserResult,
} from '@common/functions/approveUser';

import User from '@common/types/User';
import { getAuth } from 'firebase-admin/auth';

const approveUser = functions
  .region('us-west2')
  .https.onCall(async (data: approveUserData, context) => {
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

    if (
      !context.auth.token?.permissions?.MANAGE_USERS?.includes(
        data.libraryID
      ) &&
      !context.auth.token?.librariesOwned?.includes(data.libraryID)
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'MANAGE_USERS' permission."
      );
    }

    // Type Verification
    if (
      typeof data.firstName !== 'string' ||
      typeof data.lastName !== 'string' ||
      typeof data.email !== 'string' ||
      typeof data.uid !== 'string' ||
      typeof data.libraryID !== 'string' ||
      typeof data.expiration !== 'number'
    ) {
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
      throw new functions.https.HttpsError(
        'not-found',
        'The specified library could not be found.'
      );
    }

    const user = await getAuth().getUser(data.uid);

    if (!user) {
      throw new functions.https.HttpsError(
        'not-found',
        'The specified user could not be found.'
      );
    }

    // Create a batched update
    const batch = firestore.batch();

    const userDoc: User = {
      active: true,
      activeCheckouts: [],
      checkoutGroup: 'default',
      firstName: data.firstName,
      approvedAt: FieldValue.serverTimestamp() as Timestamp,
      approvedBy: context.auth.uid,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: null,
      identifiers: [],
      expiration: Timestamp.fromDate(new Date(data.expiration)),
      uid: data.uid,
      updatedBy: context.auth.uid,
      updatedAt: FieldValue.serverTimestamp() as Timestamp,
    };

    const userRef = firestore
      .collection(`libraries/${data.libraryID}/users`)
      .doc(data.uid);

    const joinRequestRef = firestore
      .collection(`libraries/${data.libraryID}/joinRequests`)
      .doc(data.uid);

    batch.set(userRef, userDoc);
    batch.update(joinRequestRef, { approved: true });

    await batch
      .commit()
      .then(async () => {
        const userClaims = user.customClaims;

        const newLibrariesJoined = [];
        if (userClaims && Array.isArray(userClaims?.librariesJoined))
          newLibrariesJoined.push(...userClaims.librariesJoined);
        newLibrariesJoined.push(data.libraryID);

        getAuth()
          .setCustomUserClaims(data.uid, {
            ...userClaims,
            librariesJoined: newLibrariesJoined,
          })
          .catch(console.error);
      })
      .catch((err) => {
        functions.logger.error(context, data, err);
        throw new functions.https.HttpsError(
          'internal',
          'There was an error approving this user.'
        );
      });

    const result: approveUserResult = {
      userID: data.uid,
    };

    return result;
  });

export default approveUser;
