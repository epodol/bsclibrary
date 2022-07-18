import functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Book from '@common/types/Book';

const userStatistics = functions
  .region('us-west2')
  .firestore.document('/libraries/{library}/books/{book}')
  .onWrite(async ({ before, after }, context) => {
    const libraryID = after.ref.parent?.parent?.id;

    const beforeData = before?.data() as Book | undefined;
    const afterData = after?.data() as Book | undefined;

    const firestore = getFirestore();

    if (beforeData && !afterData)
      firestore.doc(`libraries/${libraryID}/statistics/books`).set(
        {
          currentCount: FieldValue.increment(-1),
        },
        { merge: true }
      );
    if (!beforeData && afterData)
      firestore.doc(`libraries/${libraryID}/statistics/books`).set(
        {
          currentCount: FieldValue.increment(1),
          historicalCount: FieldValue.increment(1),
        },
        { merge: true }
      );
  });

export default userStatistics;
