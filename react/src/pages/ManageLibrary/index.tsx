import { Chip, Paper } from '@mui/material';
import { doc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import BooksStatistics from '@common/types/BooksStatistics';
import CopiesStatistics from '@common/types/CopiesStatistics';
import CheckoutsStatistics from '@common/types/CheckoutsStatistics';
import UsersStatistics from '@common/types/UsersStatistics';
import Library from '@common/types/Library';

const ManageLibrary = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library');

  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const booksStatisticsDoc: BooksStatistics = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'statistics', 'books')
  ).data as BooksStatistics;

  const copiesStatisticsDoc: CopiesStatistics = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'statistics', 'copies')
  ).data as CopiesStatistics;

  const checkoutsStatisticsDoc: CheckoutsStatistics = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'statistics', 'checkouts')
  ).data as CheckoutsStatistics;

  const usersStatisticsDoc: UsersStatistics = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'statistics', 'users')
  ).data as UsersStatistics;

  return (
    <div className="text-center lead m-5">
      <h1>Manage Library</h1>
      <Paper>
        <div style={{ margin: '1%' }}>
          <br />
          <h2>Statistics</h2>
          <br />
          <h3>Books & Copies</h3>
          Current Count of Books:{' '}
          <Chip label={booksStatisticsDoc.currentCount} />
          <br />
          Historical Count of Books:{' '}
          <Chip label={booksStatisticsDoc.historicalCount} />
          <br />
          Current Count of Copies:{' '}
          <Chip label={copiesStatisticsDoc.currentCount} />
          <br />
          Historical Count of Copies:{' '}
          <Chip label={copiesStatisticsDoc.historicalCount} />
          <br />
          <br />
          <h5>Copies by Status</h5>
          On Shelf: <Chip label={copiesStatisticsDoc.currentCountByStatus[0]} />
          <br />
          In Storage:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByStatus[1]} />
          <br />
          Checked Out:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByStatus[2]} />
          <br />
          Missing: <Chip label={copiesStatisticsDoc.currentCountByStatus[3]} />
          <br />
          Not Tracked:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByStatus[4]} />
          <br />
          <br />
          <h5>Copies by Condition</h5>
          {libraryDoc.conditionOptions[5]}:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByCondition[5]} />
          <br />
          {libraryDoc.conditionOptions[4]}:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByCondition[4]} />
          <br />
          {libraryDoc.conditionOptions[3]}:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByCondition[3]} />
          <br />
          {libraryDoc.conditionOptions[2]}:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByCondition[2]} />
          <br />
          {libraryDoc.conditionOptions[1]}:{' '}
          <Chip label={copiesStatisticsDoc.currentCountByCondition[1]} />
          <br />
          <br />
          <h3>Checkouts</h3>
          Active Checkouts: <Chip label={checkoutsStatisticsDoc.currentCount} />
          <br />
          Historical Count of Checkouts:{' '}
          <Chip label={checkoutsStatisticsDoc.historicalCount} />
          <br />
          <br />
          <h3>Users</h3>
          Current Count of Users:{' '}
          <Chip label={usersStatisticsDoc.currentCount} />
          <br />
          Historical Count of Users:{' '}
          <Chip label={usersStatisticsDoc.historicalCount} />
          <br />
          <br />
        </div>
      </Paper>
    </div>
  );
};

export default ManageLibrary;
