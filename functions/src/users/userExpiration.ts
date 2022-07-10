import functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

const userExpiration = functions
  .region('us-west2')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Etc/UTC')
  .onRun(async (context) => {
    console.log(context);
    const firestore = getFirestore();

    const usersToExpire = await firestore
      .collectionGroup('users')
      .where('expiration', '>', new Date())
      .where('expiration', '<', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
      .get();

    console.log(usersToExpire);
    // TODO: Set user to expired
  });

export default userExpiration;
