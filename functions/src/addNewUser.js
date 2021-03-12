const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');

exports.addNewUser = functions.https.onCall(async (data, context) => {
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
    data.role > 1000 ||
    context.auth.token.role < 700
  ) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'The user calling the function must have a higher role than the claim they are assigning or be an admin.'
    );
  }

  if (
    typeof data.email !== 'string' ||
    typeof data.first_name !== 'string' ||
    typeof data.last_name !== 'string' ||
    typeof data.role !== 'number'
  ) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an email and role'
    );
  }

  const newUser = await admin
    .auth()
    .createUser({
      email: data.email,
      emailVerified: false,
      displayName: `${data.first_name} ${data.last_name}`,
      disabled: false,
      role: data.role,
    })
    .catch(() => {
      throw new functions.https.HttpsError(
        'already-exists',
        'This user already exists'
      );
    });

  await admin
    .auth()
    .setCustomUserClaims(newUser.uid, { role: data.role })
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error);
    });

  console.log(newUser);
  return {
    uid: newUser.uid,
    email: newUser.email,
    emailVerified: newUser.emailVerified,
    displayName: newUser.displayName,
    photoURL: newUser.photoURL,
    phoneNumber: newUser.phoneNumber,
    disabled: newUser.disabled,
    role: data.role,
  };
});
