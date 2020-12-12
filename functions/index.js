const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

exports.makeAdmin = functions.https.onRequest((req, res) =>
  admin
    .auth()
    .setCustomUserClaims('bFG1dJFQgChTQz93UAZzOifBcng1', { admin: true })
    .then(() => res.send('Success'))
    .catch()
);

exports.makeStudent = functions.https.onRequest((req, res) => {
  admin
    .auth()
    .setCustomUserClaims('0d1MOmLNlMO6CetizkBkuwEy2dQ2', { student: true })
    .then(() => res.send('Success'))
    .catch();
});

exports.getClaims = functions.https.onRequest((req, res) => {
  admin
    .auth()
    .getUser('0d1MOmLNlMO6CetizkBkuwEy2dQ2')
    .then((userRecord) =>
      // The claims can be accessed on the user record.
      res.send(userRecord.customClaims)
    )
    .catch();
});
