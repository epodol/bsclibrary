import React, { useState, Suspense, useContext } from 'react';
import {
  AppBar,
  Grid,
  Paper,
  Toolbar,
  Container,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { doc } from 'firebase/firestore';

import TableBody from 'src/pages/Books/BooksTable/TableBody';
import Loading from 'src/components/Loading';
import Library from '@common/types/Library';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import AddBook from 'src/pages/Books/BooksTable/AddBook';
import UpdateCopyStatusCondition from './UpdateCopyStatusCondition';

const BooksTable = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isUpdateCopyStatusConditionOpen, setIsUpdateCopyStatusConditionOpen] =
    useState(false);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  return (
    <>
      <AddBook isOpen={isAddBookOpen} setIsOpen={setIsAddBookOpen} />
      <UpdateCopyStatusCondition
        isOpen={isUpdateCopyStatusConditionOpen}
        setIsOpen={setIsUpdateCopyStatusConditionOpen}
      />
      <Paper className="p-3 my-4 mx-5 mb-5">
        <AppBar position="static">
          <Toolbar>
            <Container>
              <Grid container spacing={3}>
                <Grid item xs={2} />
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                  <h2 className="white-text">Books</h2>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(libraryDoc.userPermissions.MANAGE_BOOKS.includes(
                    user.uid
                  ) ||
                    libraryDoc.ownerUserID === user.uid) && (
                    <React.Fragment>
                      <ButtonGroup
                        variant="contained"
                        ref={anchorRef}
                        aria-label="split button"
                      >
                        <Button onClick={() => setIsAddBookOpen(true)}>
                          Add Book
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setOpen((prevOpen) => !prevOpen)}
                        >
                          <ArrowDropDown />
                        </Button>
                      </ButtonGroup>
                      <Popper
                        sx={{
                          zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === 'bottom'
                                  ? 'center top'
                                  : 'center bottom',
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem>
                                  <MenuItem
                                    onClick={() =>
                                      setIsUpdateCopyStatusConditionOpen(true)
                                    }
                                  >
                                    Update Copy Status/Condition
                                  </MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </React.Fragment>
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
