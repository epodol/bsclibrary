import React, { useState } from 'react';
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
import { useFirestore } from 'reactfire';
import { doc, getDoc } from 'firebase/firestore';

export const ChooseLibraryDialog = ({
  libraries,
  open,
  setOpen,
}: {
  libraries: string[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const firestore = useFirestore();
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
          {libraries.forEach(async (value) => {
            const libraryDoc = await getDoc(doc(firestore, 'libraries', value));

            if (!libraryDoc.exists()) {
              console.error('Unknown library in user account', value);
              return null;
            }

            const library = libraryDoc.data() as Library;

            return (
              <Grid item xs={3} key={library.id}>
                <ButtonBase>
                  <Card sx={{ maxWidth: 100 }}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={library.logos.svg ?? library.logos.png}
                      alt={library.name}
                    />
                    <CardContent>{library.name}</CardContent>
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

const ChooseLibrary = () => {
  const [open, setOpen] = useState(false);

  // const activeLibraryID = useContext(ActiveLibraryID);
  return (
    <>
      <ButtonBase onClick={() => setOpen((currentOpen) => !currentOpen)}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo.svg`}
          height="50"
          width="50"
          alt="BASIS Scottsdale Library Logo"
        />
        <strong className="white-text"> BASIS Scottsdale Library</strong>
      </ButtonBase>
      <ChooseLibraryDialog libraries={['1']} open={open} setOpen={setOpen} />
    </>
  );
};

export default ChooseLibrary;
