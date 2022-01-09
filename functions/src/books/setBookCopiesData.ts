import functions from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';
import Book from '@common/types/Book';
import RecursivePartial from '@common/types/RecursivePartial';

const setBookCopiesData = functions
  .region('us-west2')
  .firestore.document('books/{bookId}/copies/{copyID}')
  .onWrite(({ before, after }) => {
    const increment = (val: number) =>
      FieldValue.increment(val) as unknown as number;
    const newVal: RecursivePartial<Book> = {};

    const beforeStatus = before?.data()?.status ?? 4;
    const afterStatus = after?.data()?.status ?? 4;

    if (beforeStatus === afterStatus) return null;

    if (
      ((beforeStatus === 0 || beforeStatus === 1) &&
        (afterStatus === 0 || afterStatus === 1)) ||
      ((beforeStatus === 2 || beforeStatus === 3) &&
        (afterStatus === 2 || afterStatus === 3))
    )
      return null;
    if (beforeStatus === 0 || beforeStatus === 1) {
      if (afterStatus === 2 || afterStatus === 3)
        // Reduce Available -1
        newVal.copiesAvailable = increment(-1);
      if (afterStatus === 4)
        // Reduce Available -1 Reduce Count -1
        newVal.copiesCount = increment(-1);
      newVal.copiesAvailable = increment(-1);
    }
    if (beforeStatus === 2 || beforeStatus === 3) {
      if (afterStatus === 0 || afterStatus === 1)
        // Add Available +1
        newVal.copiesAvailable = increment(1);
      if (afterStatus === 4)
        // Reduce Count -1
        newVal.copiesCount = increment(-1);
    }
    if (beforeStatus === 4) {
      if (afterStatus === 0 || afterStatus === 1)
        // Add Available +1 Add Count +1
        newVal.copiesAvailable = increment(1);
      newVal.copiesCount = increment(1);
      if (afterStatus === 2 || afterStatus === 3)
        // Add Count +1
        newVal.copiesCount = increment(1);
    }

    return after.ref?.parent?.parent?.update(newVal);
  });

export default setBookCopiesData;
