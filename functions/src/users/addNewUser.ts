import functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import User from '@common/types/User';

import addNewUserData from '@common/functions/addNewUser';

const addNewUser = functions
  .region('us-west2')
  .https.onCall(async (data: addNewUserData, context) => {
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

    if (
      (context.auth.token.role <= data.role &&
        context.auth.token.role !== 1000) ||
      data.role > 1000
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'The user calling the function must have a higher role than the claim they are assigning or be an admin.'
      );
    }

    if (!context.auth.token.permissions.MANAGE_USERS) {
      throw new functions.https.HttpsError(
        'permission-denied',
        "The user calling the function must have the 'MANAGE_USERS' permission."
      );
    }

    if (
      typeof data.email !== 'string' ||
      typeof data.first_name !== 'string' ||
      typeof data.last_name !== 'string' ||
      typeof data.role !== 'number' ||
      typeof data.permissions !== 'object' ||
      typeof data.maxCheckouts !== 'number' ||
      typeof data.maxRenews !== 'number'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with the appropriate arguments.'
      );
    }

    const newUser = await auth
      .createUser({
        email: data.email,
        emailVerified: false,
        displayName: `${data.first_name} ${data.last_name}`,
        disabled: false,
      })
      .catch(() => {
        throw new functions.https.HttpsError(
          'already-exists',
          'This user already exists'
        );
      });

    if (typeof newUser.email === 'undefined') {
      functions.logger.error(
        "The newUser's email was undefined",
        context,
        data,
        newUser
      );
      throw new functions.https.HttpsError(
        'internal',
        "The newUser's email was undefined"
      );
    }

    await auth
      .setCustomUserClaims(newUser.uid, {
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        permissions: data.permissions,
      })
      .catch((error) => {
        throw new functions.https.HttpsError('internal', error);
      });

    const newUserDoc: User = {
      userInfo: {
        uid: newUser.uid,
        email: newUser.email,
        queryEmail: newUser.email?.toLowerCase(),
        displayName:
          newUser.displayName ?? `${data.first_name} ${data.last_name}`,
        firstName: data.first_name ?? '',
        lastName: data.last_name ?? '',
        queryFirstName: data.first_name ? data.first_name.toLowerCase() : null,
        queryLastName: data.last_name ? data.last_name.toLowerCase() : null,
        photoURL: newUser.photoURL ?? null,
        phoneNumber: newUser.phoneNumber ?? null,
        disabled: newUser.disabled,
        createdBy: context.auth.uid,
        createdTime: Timestamp.fromMillis(
          Date.parse(newUser.metadata.creationTime)
        ),
        editedBy: context.auth.uid,
        editedTime: Timestamp.fromMillis(
          Date.parse(newUser.metadata.creationTime)
        ),
        role: data.role,
        permissions: data.permissions,
      },
      checkoutInfo: {
        activeCheckouts: [],
        maxCheckouts: data.maxCheckouts,
        maxRenews: data.maxRenews,
      },
    };

    await firestore
      .collection('users')
      .doc(newUser.uid)
      .set(newUserDoc)
      .catch((error) => {
        throw new functions.https.HttpsError('internal', error);
      });

    return {
      uid: newUser.uid,
    };
  });

export default addNewUser;
