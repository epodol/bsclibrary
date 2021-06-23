const functions = require('firebase-functions');
const admin = require('firebase-admin');

const isDev = process.env.NODE_ENV !== 'production';

exports.addNewUser = functions
  .region(!isDev ? 'us-west2' : 'us-central1')
  .https.onCall(async (data, context) => {
    if (!context.app && process.env.NODE_ENV === 'production') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      );
    }

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
      typeof data.permissions !== 'object'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with an email, first name, last name, role, and permissions'
      );
    }

    const newUser = await admin
      .auth()
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

    await admin
      .auth()
      .setCustomUserClaims(newUser.uid, {
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        permissions: data.permissions,
        createdBy: context.auth.uid,
        createdTime: admin.firestore.Timestamp.fromMillis(
          Date.parse(newUser.metadata.creationTime)
        ),
        editedBy: context.auth.uid,
        editedTime: admin.firestore.Timestamp.fromMillis(
          Date.parse(newUser.metadata.creationTime)
        ),
      })
      .catch((error) => {
        throw new functions.https.HttpsError('internal', error);
      });

    const {
      uid,
      email,
      displayName,
      photoURL,
      phoneNumber,
      disabled,
      metadata: { creationTime },
    } = newUser;
    await admin
      .firestore()
      .collection('users')
      .doc(newUser.uid)
      .set({
        userInfo: {
          uid,
          email,
          queryEmail: email.toLowerCase(),
          displayName,
          firstName: data.first_name || null,
          lastName: data.last_name || null,
          queryFirstName: data.first_name
            ? data.first_name.toLowerCase()
            : null,
          queryLastName: data.last_name ? data.last_name.toLowerCase() : null,
          photoURL: photoURL || null,
          phoneNumber: phoneNumber || null,
          disabled,
          createdBy: context.auth.uid,
          createdTime: admin.firestore.Timestamp.fromMillis(
            Date.parse(creationTime)
          ),
          editedBy: context.auth.uid,
          editedTime: admin.firestore.Timestamp.fromMillis(
            Date.parse(creationTime)
          ),
          role: data.role,
          permissions: data.permissions,
        },
      });

    return {
      uid: newUser.uid,
    };
  });
