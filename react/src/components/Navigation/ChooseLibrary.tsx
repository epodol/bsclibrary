import React from 'react';
import {
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import { Add } from '@mui/icons-material';
// import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';
import { useUser, useFirestore, useFirestoreCollection } from 'reactfire';
import { doc, getDoc, query, collectionGroup, where } from 'firebase/firestore';
import RecursivePartial from '@common/types/util/RecursivePartial';

export const ChooseLibrary = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const firestore = useFirestore();
  const user = useUser().data;

  if (!user) throw new Error('No user is signed in.');

  const userInLibrariesQuery = query(
    collectionGroup(firestore, 'users'),
    where('uid', '==', user.uid)
  );

  const userInLibraries = useFirestoreCollection(userInLibrariesQuery).data;

  const libraries: RecurrsivePartial<Library>[] = [];

  userInLibraries.forEach(async (value) => {
    console.log(value.ref.parent.parent?.id);
    if (value.ref.parent.parent?.id === undefined) return null;

    const libraryDoc = await getDoc(
      doc(firestore, 'libraries', value.ref.parent.parent?.id)
    ).catch(console.error);

    if (!libraryDoc || !libraryDoc.exists()) {
      console.error('Unknown library in user account', value);
      return null;
    }

    const library = libraryDoc.data() as RecursivePartial<Library>;

    libraries.push(library);
  });

  // const libraries = ['RYPf8grIv9OKxaHQoMc0'];
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Choose Library</DialogTitle>
      <DialogContent>
        <Grid
          container
          rowSpacing={5}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mt: 0.5 }}
        >
          {libraries.forEach((library) => {
            console.log('library', library);
            return (
              <Grid item xs={3} key={library.id}>
                <ButtonBase>
                  <Card sx={{ maxWidth: 100 }}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={library?.logos?.svg ?? library?.logos?.png}
                      alt={library?.name}
                    />
                    <CardContent>{library?.name}aaa</CardContent>
                  </Card>
                </ButtonBase>
              </Grid>
            );
          })}
          <Grid item xs={3}>
            <IconButton color="primary" aria-label="add to shopping cart">
              <Add
                sx={{
                  fontSize: 100,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChooseLibrary;
