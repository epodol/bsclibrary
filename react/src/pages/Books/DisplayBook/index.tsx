import React, { useContext, useState, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useFirestoreDocData, useFirestore } from 'reactfire';
import {
  Container,
  Grid,
  Button,
  Tooltip,
  Paper,
  AppBar,
  Collapse,
} from '@mui/material';
import { Edit, Star, StarBorder } from '@mui/icons-material';

import FirebaseContext from 'src/contexts/FirebaseContext';
import ViewBook from 'src/pages/Books/DisplayBook/ViewBook';
import EditBook from 'src/pages/Books/DisplayBook/EditBook';
import CopiesTable from 'src/pages/Books/DisplayBook/CopiesTable';
import Loading from 'src/components/Loading';

import BookInterface from '@common/types/Book';
import NotificationContext from 'src/contexts/NotificationContext';
import { doc, updateDoc } from 'firebase/firestore';

interface BookInterfaceWithID extends BookInterface {
  id?: string;
}

const Book = () => {
  const NotificationHandler = useContext(NotificationContext);

  const { id } = useParams();

  if (id === undefined) throw new Error('No user defined.');

  const location: { state: { editing?: boolean } } = useLocation() as any;
  const firestore = useFirestore();
  const ref = doc(firestore, 'books', id);
  const data = useFirestoreDocData(ref, {
    idField: 'id',
  }).data as unknown as BookInterfaceWithID;
  const { volumeInfo, featured } = data;
  const firebaseContext = useContext(FirebaseContext);

  const [editing, setEditing] = useState(location?.state?.editing || false);

  const [viewCopies, setViewCopies] = useState(false);

  if (typeof volumeInfo === 'undefined') {
    return <h1>Book Not Found!</h1>;
  }

  return (
    <Container className="my-5">
      <Paper className="p-3 my-4 mx-5 mb-5">
        <AppBar position="static" className="text-white">
          <Grid container>
            <Grid item xs={2} />
            <Grid className="text-center" item xs={8}>
              {typeof volumeInfo.title !== 'undefined' && (
                <h1 className="hr-bold font-italic">{volumeInfo.title}</h1>
              )}
            </Grid>
            <Grid className="text-right" item xs={2}>
              {(data.featured ||
                firebaseContext?.claims?.permissions?.MANAGE_BOOKS) && (
                <Tooltip placement="bottom" title="Featured Book">
                  <Button
                    className="m-2"
                    disabled={
                      !firebaseContext?.claims?.permissions?.MANAGE_BOOKS
                    }
                    onClick={() => {
                      updateDoc(ref, {
                        featured: !featured,
                      })
                        .then(() => {
                          NotificationHandler.addNotification({
                            message: 'Toggled featured',
                            severity: 'success',
                          });
                        })
                        .catch((err) => {
                          console.error(err);
                          NotificationHandler.addNotification({
                            message: `An unexpected error occurred: ${err.message} (${err.code})`,
                            severity: 'error',
                          });
                        });
                    }}
                  >
                    {featured && <Star />}
                    {!featured && <StarBorder />}
                  </Button>
                </Tooltip>
              )}
              {firebaseContext?.claims?.role >= 500 && (
                <Tooltip placement="bottom" title="Edit Book">
                  <Button
                    className="m-2"
                    onClick={() => {
                      setEditing(!editing);
                    }}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </AppBar>
        {!editing && <ViewBook volumeInfo={volumeInfo} />}
        {editing && (
          <EditBook
            volumeInfo={volumeInfo}
            bookID={id}
            setEditing={setEditing}
          />
        )}
        <div className="text-center mx-auto mb-5">
          <Button onClick={() => setViewCopies(!viewCopies)}>
            {!viewCopies && 'View Copies'}
            {viewCopies && 'Hide Copies'}
          </Button>
        </div>

        <Collapse in={viewCopies}>
          {viewCopies && (
            <Suspense fallback={<Loading />}>
              <CopiesTable bookID={id} editing={editing} />
            </Suspense>
          )}
        </Collapse>
      </Paper>
    </Container>
  );
};

export default Book;
