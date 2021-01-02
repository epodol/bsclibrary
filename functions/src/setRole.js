const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  if (context.auth.token.role < data.role && context.auth.token.role !== 1000) {
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

  if (userRecord.customClaims.role === data.role) {
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
    }));
});
