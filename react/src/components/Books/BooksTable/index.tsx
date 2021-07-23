import React, { Suspense, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  IconButton,
  Grid,
  Paper,
  Toolbar,
  Container,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { useFirestore, useUser } from 'reactfire';
import TableBody from 'src/components/Books/BooksTable/TableBody';
import Loading from 'src/components/Loading';
import FirebaseContext from 'src/contexts/FirebaseContext';
import NotificationContext from 'src/contexts/NotificationContext';

const BooksTable = () => {
  const NotificationHandler = useContext(NotificationContext);

  const firestore = useFirestore();
  const fieldValue = useFirestore.FieldValue;

  const firebaseContext = useContext(FirebaseContext);

  const user = useUser().data;
  const history = useHistory();

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
                {firebaseContext.claims?.permissions?.MANAGE_BOOKS && (
                  <IconButton
                    className="px-3 white-text"
                    color="inherit"
                    onClick={() => {
                      firestore
                        .collection('books')
                        .add({
                          featured: false,
                          volumeInfo: {
                            authors: [],
                            genres: [],
                            description: '',
                            image: '',
                            isbn10: '',
                            isbn13: '',
                            grades: {
                              grade0: false,
                              grade1: false,
                              grade2: false,
                              grade3: false,
                              grade4: false,
                              grade5: false,
                              grade6: false,
                              grade7: false,
                              grade8: false,
                              grade9: false,
                              grade10: false,
                              grade11: false,
                              grade12: false,
                              grade13: false,
                            },
                            subtitle: '',
                            title: '',
                          },
                          lastEditedBy: user.uid,
                          lastEdited: fieldValue.serverTimestamp(),
                        })
                        .then((book) => {
                          history.push(book.path, { editing: true });
                          NotificationHandler.addNotification({
                            message: `New book created.`,
                            severity: 'success',
                          });
                        })
                        .catch((err) => {
                          console.error(err);
                          NotificationHandler.addNotification({
                            message: `An unexpected error occured.`,
                            severity: 'error',
                            timeout: 10000,
                          });
                        });
                    }}
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
