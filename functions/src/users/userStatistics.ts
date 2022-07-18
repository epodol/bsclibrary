import functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const userStatistics = functions
  .region('us-west2')
  .firestore.document('/libraries/{library}/users/{user}')
  .onCreate(async (snapshot, context) => {
    const libraryID = snapshot.ref.parent?.parent?.id;

    const firestore = getFirestore();

    firestore.doc(`libraries/${libraryID}/statistics/users`).set(
      {
        currentCount: FieldValue.increment(1),
        historicalCount: FieldValue.increment(1),
      },
      { merge: true }
    );
  });

export default userStatistics;
