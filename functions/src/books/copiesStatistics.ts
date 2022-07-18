import functions from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Book from '@common/types/Book';
import RecursivePartial from '@common/types/util/RecursivePartial';
import Copy, { status } from '@common/types/Copy';

function updateAvailabilityCounters(beforeStatus: status, afterStatus: status) {
  const newVal: RecursivePartial<Book> = {};

  const increment = (val: number) =>
    FieldValue.increment(val) as unknown as number;

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
      newVal.copiesTotal = increment(-1);
    newVal.copiesAvailable = increment(-1);
  }
  if (beforeStatus === 2 || beforeStatus === 3) {
    if (afterStatus === 0 || afterStatus === 1)
      // Add Available +1
      newVal.copiesAvailable = increment(1);
    if (afterStatus === 4)
      // Reduce Count -1
      newVal.copiesTotal = increment(-1);
  }
  if (beforeStatus === 4) {
    if (afterStatus === 0 || afterStatus === 1)
      // Add Available +1 Add Count +1
      newVal.copiesAvailable = increment(1);
    newVal.copiesTotal = increment(1);
    if (afterStatus === 2 || afterStatus === 3)
      // Add Count +1
      newVal.copiesTotal = increment(1);
  }

  return newVal;
}

const copiesStatistics = functions
  .region('us-west2')
  .firestore.document('libraries/{libraryID}/books/{bookID}/copies/{copyID}')
  .onWrite(async ({ before, after }) => {
    const firestore = getFirestore();

    const beforeData = before?.data() as Copy | undefined;
    const afterData = after?.data() as Copy | undefined;

    const copiesStatisticsChanges: any = {};

    if (beforeData && !afterData) {
      if (!copiesStatisticsChanges.currentCountByCondition)
        copiesStatisticsChanges.currentCountByCondition = {};
      if (!copiesStatisticsChanges.currentCountByStatus)
        copiesStatisticsChanges.currentCountByStatus = {};
      copiesStatisticsChanges.currentCountByCondition[beforeData.condition] =
        FieldValue.increment(-1);
      copiesStatisticsChanges.currentCountByStatus[beforeData.status] =
        FieldValue.increment(-1);
      copiesStatisticsChanges.currentCount = FieldValue.increment(-1);
    } else if (!beforeData && afterData) {
      if (!copiesStatisticsChanges.currentCountByCondition)
        copiesStatisticsChanges.currentCountByCondition = {};
      if (!copiesStatisticsChanges.currentCountByStatus)
        copiesStatisticsChanges.currentCountByStatus = {};
      copiesStatisticsChanges.currentCountByCondition[afterData.condition] =
        FieldValue.increment(1);
      copiesStatisticsChanges.currentCountByStatus[afterData.status] =
        FieldValue.increment(1);
      copiesStatisticsChanges.currentCount = FieldValue.increment(1);
    } else if (beforeData && afterData) {
      if (beforeData.condition !== afterData.condition) {
        if (!copiesStatisticsChanges.currentCountByCondition)
          copiesStatisticsChanges.currentCountByCondition = {};
        if (!copiesStatisticsChanges.currentCountByStatus)
          copiesStatisticsChanges.currentCountByStatus = {};
        copiesStatisticsChanges.currentCountByCondition[beforeData.condition] =
          FieldValue.increment(-1);
        copiesStatisticsChanges.currentCountByCondition[afterData.condition] =
          FieldValue.increment(1);
      }
      if (beforeData.status !== afterData.status) {
        if (!copiesStatisticsChanges.currentCountByCondition)
          copiesStatisticsChanges.currentCountByCondition = {};
        if (!copiesStatisticsChanges.currentCountByStatus)
          copiesStatisticsChanges.currentCountByStatus = {};
        copiesStatisticsChanges.currentCountByStatus[beforeData.status] =
          FieldValue.increment(-1);
        copiesStatisticsChanges.currentCountByStatus[afterData.status] =
          FieldValue.increment(1);
      }
    }

    if (copiesStatisticsChanges) {
      const libraryID = after.ref.parent?.parent?.parent?.parent?.id;

      firestore
        .doc(`libraries/${libraryID}/statistics/copies`)
        .set(copiesStatisticsChanges, { merge: true });
    }

    const beforeStatus = beforeData?.status ?? 4;
    const afterStatus = afterData?.status ?? 4;

    const newBookVal = updateAvailabilityCounters(beforeStatus, afterStatus);
    if (newBookVal) await after.ref?.parent?.parent?.update(newBookVal);
  });

export default copiesStatistics;
