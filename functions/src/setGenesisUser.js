const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setGenesisUser = functions.https.onRequest(async (req, res) => {
  const userRecord = await admin
    .auth()
    .getUser('99i0ebEpktMTKWD8stFeGTYhscY2')
    .catch(() => {
      return res.json({ result: 'Failed' });
    });

  if (
    typeof userRecord.customClaims !== 'undefined' &&
    userRecord.customClaims.role === 1000
  ) {
    return res.json({ result: 'Success' });
  }

  await admin
    .auth()
    .setCustomUserClaims('99i0ebEpktMTKWD8stFeGTYhscY2', { role: 1000 })
    .catch(() => {
      return res.json({ result: 'Failed' });
    });

  return res.json({ result: 'Success' });
});
