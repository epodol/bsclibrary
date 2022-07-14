import React, { Suspense, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  collection,
  serverTimestamp,
  doc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

import TableBody from 'src/pages/Books/BooksTable/TableBody';
import Loading from 'src/components/Loading';
import NotificationContext from 'src/contexts/NotificationContext';
import Library from '@common/types/Library';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Book from '@common/types/Book';

const BooksTable = () => {
  const NotificationHandler = useContext(NotificationContext);
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  const navigate = useNavigate();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  return (
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
                {(libraryDoc.userPermissions.MANAGE_BOOKS.includes(user.uid) ||
                  libraryDoc.ownerUserID === user.uid) && (
                  <IconButton
                    className="px-3 white-text"
                    color="inherit"
                    onClick={() => {
                      const newData: Book = {
                        featured: false,
                        volumeInfo: {
                          authors: [],
                          genres: [],
                          description: '',
                          image: '',
                          isbn10: '',
                          isbn13: '',
                          subtitle: '',
                          title: '',
                          callNumber: '',
                        },
                        updatedBy: user.uid,
                        updatedAt: serverTimestamp() as Timestamp,
                        createdBy: user.uid,
                        createdAt: serverTimestamp() as Timestamp,
                        copiesAvailable: 0,
                        copiesCount: 0,
                      };
                      addDoc(
                        collection(
                          firestore,
                          'libraries',
                          activeLibraryID,
                          'books'
                        ),
                        newData
                      )
                        .then((book) => {
                          navigate(`/books/${book.id}`, {
                            state: { editing: true },
                          });
                          NotificationHandler.addNotification({
                            message: `New book created.`,
                            severity: 'success',
                          });
                        })
                        .catch((err) => {
                          console.error(err);
                          NotificationHandler.addNotification({
                            message: `An unexpected error occurred.`,
                            severity: 'error',
                            timeout: 10000,
                          });
                        });
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
  );
};
export default BooksTable;
