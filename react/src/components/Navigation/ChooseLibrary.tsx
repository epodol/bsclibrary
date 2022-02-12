import React, { useState, useContext } from 'react';
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
import ActiveLibrary from 'src/contexts/ActiveLibrary';

const libraries = [
  {
    name: 'Iguana Inc.',
    logo: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
    id: 1,
  },
  {
    name: 'Human A',
    logo: 'https://mui.com/static/images/avatar/1.jpg',
    id: 2,
  },
  // {
  //   name: 'Human B',
  //   logo: 'https://mui.com/static/images/avatar/2.jpg',
  //   id: 3,
  // },
  // {
  //   name: 'Human C',
  //   logo: 'https://mui.com/static/images/avatar/3.jpg',
  //   id: 4,
  // },
  // {
  //   name: 'Human D',
  //   logo: 'https://mui.com/static/images/avatar/4.jpg',
  //   id: 5,
  // },
  // {
  //   name: 'Human E',
  //   logo: 'https://mui.com/static/images/avatar/5.jpg',
  //   id: 6,
  // },
  // {
  //   name: 'Human F',
  //   logo: 'https://mui.com/static/images/avatar/6.jpg',
  //   id: 7,
  // },
];

export const ChooseLibraryDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>Choose Library</DialogTitle>
    <DialogContent>
      <Grid
        container
        rowSpacing={5}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ mt: 0.5 }}
      >
        {libraries.map((value) => (
          <Grid item xs={3} key={value.id}>
            <ButtonBase>
              <Card sx={{ maxWidth: 100 }}>
                <CardMedia
                  component="img"
                  height="100"
                  image={value.logo}
                  alt={value.name}
                />
                <CardContent>{value.name}</CardContent>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
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

const ChooseLibrary = () => {
  const [open, setOpen] = useState(false);

  const activeLibrary = useContext(ActiveLibrary);
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
      <ChooseLibraryDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default ChooseLibrary;
