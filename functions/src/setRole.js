const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setRole = functions.https.onCall(async (data, context) => {
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

  if (!data.email || !data.role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an email and role'
    );
  }

  if (typeof data.email !== 'string' || typeof data.role !== 'number') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an email and role'
    );
  }

  const userRecord = await admin
    .auth()
    .getUserByEmail(data.email)
    .catch((error) => {
      throw new functions.https.HttpsError('invalid-argument', error);
    });

  if (
    typeof userRecord.customClaims !== 'undefined' &&
    userRecord.customClaims.role === data.role
  ) {
    throw new functions.https.HttpsError(
      'already-exists',
      'This user already has this role.'
    );
  }

  await admin
    .auth()
    .setCustomUserClaims(userRecord.uid, { role: data.role })
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error);
    });

  return admin
    .auth()
    .getUser(userRecord.uid)
    .then((user) => ({
      email: user.email,
      uid: user.uid,
      role: user.customClaims.role,
    }))
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error);
    });
});
