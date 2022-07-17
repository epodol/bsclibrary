import React, { useState, Suspense, useContext } from 'react';
import {
  AppBar,
  IconButton,
  Grid,
  Paper,
  Toolbar,
  Container,
} from '@mui/material';
import { Add } from '@mui/icons-material';

import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { doc } from 'firebase/firestore';

import TableBody from 'src/pages/Books/BooksTable/TableBody';
import Loading from 'src/components/Loading';
import Library from '@common/types/Library';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import AddBook from 'src/pages/Books/BooksTable/AddBook';

const BooksTable = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  const [isOpen, setIsOpen] = useState(false);

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  return (
    <>
      <AddBook isOpen={isOpen} setIsOpen={setIsOpen} />
      <Paper className="p-3 my-4 mx-5 mb-5">
        <AppBar position="static">
          <Toolbar>
            <Container>
              <Grid container spacing={3}>
                <Grid item xs={1}>
                  {' '}
                </Grid>
                <Grid item xs={10} className="text-center">
                  <h2 className="white-text">Books</h2>
                </Grid>
                <Grid item xs={1} className="text-right">
                  {(libraryDoc.userPermissions.MANAGE_BOOKS.includes(
                    user.uid
                  ) ||
                    libraryDoc.ownerUserID === user.uid) && (
                    <IconButton
                      className="px-3 white-text"
                      color="inherit"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                      size="large"
                    >
                      <Add />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Toolbar>
        </AppBar>
        <Suspense fallback={<Loading />}>
          <TableBody />
        </Suspense>
      </Paper>
    </>
  );
};
export default BooksTable;
