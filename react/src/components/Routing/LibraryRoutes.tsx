import Library from '@common/types/Library';
import { doc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { Route } from 'react-router';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import CustomPage from 'src/pages/CustomPage';

const LibraryRoutes = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  return (
    <>
      {libraryDoc.pageGroups.map((pageGroup) =>
        pageGroup.pages.map((page) => (
          <Route key={page.id} path={`/${page.id}`} element={<CustomPage />} />
        ))
      )}
    </>
  );
};

export default LibraryRoutes;
