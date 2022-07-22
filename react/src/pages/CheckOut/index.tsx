import React, { useState, useRef, useContext, Suspense } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  TextField,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Button,
  Paper,
  TableContainer,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  InputLabel,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import * as yup from 'yup';
import { Formik, Form } from 'formik';

import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useFunctions,
  useUser,
} from 'reactfire';
import { httpsCallable } from 'firebase/functions';

import { Link } from 'react-router-dom';
import User from '@common/types/User';
import Copy from '@common/types/Copy';
import checkoutBookData, {
  checkoutBookDataBooks,
} from '@common/functions/checkoutBook';

import Loading from 'src/components/Loading';
import NotificationContext from 'src/contexts/NotificationContext';
import {
  collection,
  collectionGroup,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';

interface checkoutData {
  user: User | null;
  books: checkoutDataBook[];
}

interface checkoutDataBook {
  data: Copy;
  dueDate: string;
  id: string;
  parent: any;
  parentData: any;
}

function determineSearchField(searchField: 1 | 2 | 3) {
  let res = 'firstName';
  if (searchField === 1) res = 'firstName';
  if (searchField === 2) res = 'lastName';
  if (searchField === 3) res = 'email';

  return res;
}

const FindUserTable = ({
  searchField,
  searchTerm,
  setActiveState,
  setCheckoutData,
}: {
  searchField: 1 | 2 | 3;
  searchTerm: string;
  setActiveState: React.Dispatch<React.SetStateAction<number>>;
  setCheckoutData: React.Dispatch<React.SetStateAction<checkoutData>>;
}) => {
  const textSearchField = determineSearchField(searchField);

  const firestore = useFirestore();

  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const userQueryRef = query(
    collection(firestore, 'libraries', activeLibraryID, 'users'),
    orderBy(textSearchField),
    startAt(searchTerm),
    endAt(`${searchTerm}\uf8ff`),
    // where('userInfo.disabled', '==', false),
    limit(10)
  );

  const userData = useFirestoreCollectionData(userQueryRef, {
    idField: 'id',
  }).data as unknown as (User & { id: string })[];

  return (
    <div className="text-center">
      {userData.length !== 0 && (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Active Checkouts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => {
              if (!user) return <></>;
              return (
                <TableRow
                  key={user.id}
                  style={{ cursor: 'pointer' }}
                  hover
                  onClick={() => {
                    setCheckoutData((currentState) => ({
                      books: currentState.books,
                      user,
                    }));
                    return setActiveState(1);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.activeCheckouts?.length} / {user.maxCheckouts}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {userData.length === 0 && (
        <>
          <br />
          <h3>No Users Found.</h3>
        </>
      )}
    </div>
  );
};

const EnterUserScheme = yup.object().shape({
  userID: yup.string().required("You need to enter the User's ID"),
});

const EnterUser = ({
  setActiveState,
  setCheckoutData,
}: {
  setActiveState: React.Dispatch<React.SetStateAction<number>>;
  setCheckoutData: React.Dispatch<React.SetStateAction<checkoutData>>;
}) => {
  const firestore = useFirestore();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');
  const [searchField, setSearchField] = useState<1 | 2 | 3>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [lastSearchField, setLastSearchField] = useState<1 | 2 | 3>(1);
  const [lastSearchTerm, setLastSearchTerm] = useState<string | null>(null);
  return (
    <div style={{ marginInline: '5%' }}>
      <Paper style={{ padding: '2%' }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="text-center mx-auto"
        >
          <h3 className="flex-center text-center">Search Users</h3>
          <div>
            <FormControl
              sx={{ marginInline: 2, width: 160, marginBottom: '1rem' }}
            >
              <InputLabel id="searchByLabel">Search by</InputLabel>
              <Select
                labelId="searchByLabel"
                id="searchBy"
                value={searchField}
                onChange={(e: any) => setSearchField(e.target.value)}
              >
                <MenuItem value={1}>First Name</MenuItem>
                <MenuItem value={2}>Last Name</MenuItem>
                <MenuItem value={3}>Email</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Search Terms"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              type="text"
              required
              autoFocus
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              setLastSearchField(searchField);
              setLastSearchTerm(searchTerm);
            }}
          >
            Search
          </Button>
        </form>
        {lastSearchField !== null &&
          lastSearchTerm !== null &&
          lastSearchTerm !== '' && (
            <Suspense fallback={<Loading />}>
              <FindUserTable
                searchField={lastSearchField}
                searchTerm={lastSearchTerm}
                setActiveState={setActiveState}
                setCheckoutData={setCheckoutData}
              />
            </Suspense>
          )}
        {lastSearchTerm === '' && (
          <h5 className="text-center">Please enter a search term</h5>
        )}
        <hr />
        <Formik
          initialValues={{
            userID: '',
          }}
          validationSchema={EnterUserScheme}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);

            const userDoc = await getDoc(
              doc(
                firestore,
                'libraries',
                activeLibraryID,
                'users',
                values.userID
              )
            );

            if (!userDoc.exists) {
              actions.setFieldError('userID', "This User doesn't exist");
              return actions.setSubmitting(false);
            }

            const user = userDoc.data() as User;

            if (!user) {
              actions.setFieldError('userID', "This User doesn't exist");
              return actions.setSubmitting(false);
            }

            // Check if user is disabled
            if (user.expiration) {
              actions.setFieldError('userID', 'This User is disabled');
              return actions.setSubmitting(false);
            }

            setCheckoutData((currentState) => ({
              books: currentState.books,
              user,
            }));
            return setActiveState(1);
          }}
        >
          {({ values, errors, isSubmitting, handleChange, submitCount }) => (
            <Form noValidate>
              <TextField
                id="userID"
                type="text"
                label="User ID"
                error={!!errors.userID && submitCount > 0}
                helperText={
                  submitCount > 0
                    ? errors.userID
                    : "You can also use the User's ID"
                }
                value={values.userID}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </Form>
          )}
        </Formik>
      </Paper>
    </div>
  );
};

const ScanBooksScheme = yup.object().shape({
  book: yup.string().required("You need to enter the User's ID"),
});

const ScanBooks = ({
  setActiveState,
  checkoutData,
  setCheckoutData,
}: {
  setActiveState: React.Dispatch<React.SetStateAction<number>>;
  checkoutData: checkoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<checkoutData>>;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const activeLibraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const bookInput: any = useRef();
  return (
    <div>
      <Formik
        initialValues={{
          book: '',
        }}
        validationSchema={ScanBooksScheme}
        onSubmit={async (values, actions) => {
          const bookResults = await getDocs(
            query(
              collectionGroup(firestore, 'copies'),
              where('identifier', '==', values.book),
              where('libraryID', '==', activeLibraryID)
            )
          );

          if (bookResults.empty) {
            actions.setFieldError('book', "This book doesn't exist");
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }
          if (bookResults.size !== 1) {
            actions.setFieldError(
              'book',
              'I found more than one book with this identifier.'
            );
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }

          const { id, ref } = bookResults.docs[0];
          const data = bookResults.docs[0].data() as Copy;

          if (
            checkoutData.books.some(
              (book) => book.data.identifier === values.book
            )
          ) {
            actions.setFieldError(
              'book',
              'This book has already been scanned.'
            );
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }

          if (data.status !== 0 && data.status !== 1) {
            actions.setFieldError(
              'book',
              'This book is not marked as available.'
            );
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }

          const { parent } = ref.parent;
          if (parent === null) {
            actions.setFieldError(
              'book',
              'This copy does not belong to any book (Internal Error)'
            );
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }

          const parentData = await (await getDoc(parent)).data();

          data.condition = data.condition ?? 3;

          setCheckoutData({
            books: [
              ...checkoutData.books,
              {
                data,
                id,
                parent: parent.id,
                parentData,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 14))
                  .toISOString()
                  .split('T')[0],
              },
            ],
            user: checkoutData.user,
          });
          actions.setSubmitting(false);
          actions.resetForm();
          return bookInput?.current?.focus() || null;
        }}
      >
        {({ values, errors, isSubmitting, handleChange, submitCount }) => (
          <Form noValidate>
            <TextField
              inputRef={bookInput}
              id="book"
              type="text"
              label="Identifier"
              error={!!errors.book && submitCount > 0}
              helperText={submitCount > 0 ? errors.book : ''}
              value={values.book}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              autoFocus
            />
          </Form>
        )}
      </Formik>
      {(checkoutData.user?.maxCheckouts ?? 0) -
        ((checkoutData.user?.activeCheckouts.length ?? 0) +
          checkoutData.books.length) >=
        1 && (
        <p>
          {checkoutData.user?.firstName} {checkoutData.user?.lastName} is only
          allowed{' '}
          {(checkoutData.user?.maxCheckouts ?? 0) -
            ((checkoutData.user?.activeCheckouts.length ?? 0) +
              checkoutData.books.length)}{' '}
          more checkouts.
        </p>
      )}
      {(checkoutData.user?.maxCheckouts ?? 0) -
        ((checkoutData.user?.activeCheckouts.length ?? 0) +
          checkoutData.books.length) <
        1 && (
        <h5>
          <b>
            {checkoutData.user?.firstName} {checkoutData.user?.lastName} is not
            allowed any more checkouts.{' '}
          </b>
          You can override this.
        </h5>
      )}

      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TableContainer
          component={Paper}
          style={{
            margin: 10,
            padding: 25,
            maxWidth: '90%',
          }}
        >
          <Table aria-label="copy table">
            <TableHead>
              <TableRow>
                <TableCell>Identifier</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Copy Condition</TableCell>
                <TableCell>Copy Notes</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {checkoutData.books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell component="th" scope="row">
                    {book.data.identifier}
                  </TableCell>
                  <TableCell>
                    <b>{book.parentData?.volumeInfo?.title || ''}</b>{' '}
                    {book.parentData?.volumeInfo?.subtitle || ''}
                  </TableCell>
                  <TableCell>
                    <FormControl>
                      <Select
                        value={book.data.condition}
                        onChange={(event: any) => {
                          const newBook = book;
                          newBook.data.condition = event.target.value;
                          const newBooks = [...checkoutData.books];
                          newBooks.splice(index, 1, newBook);
                          setCheckoutData({
                            books: newBooks,
                            user: checkoutData.user,
                          });
                        }}
                      >
                        <MenuItem value={1}>
                          {activeLibraryDoc.conditionOptions[1]}
                        </MenuItem>
                        <MenuItem value={2}>
                          {activeLibraryDoc.conditionOptions[2]}
                        </MenuItem>
                        <MenuItem value={3}>
                          {activeLibraryDoc.conditionOptions[3]}
                        </MenuItem>
                        <MenuItem value={4}>
                          {activeLibraryDoc.conditionOptions[4]}
                        </MenuItem>
                        <MenuItem value={5}>
                          {activeLibraryDoc.conditionOptions[5]}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {book.data.notes === '' ? <i>None</i> : book.data.notes}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        const newBooks = [...checkoutData.books];
                        newBooks.splice(index, 1);
                        setCheckoutData({
                          books: newBooks,
                          user: checkoutData.user,
                        });
                        bookInput?.current?.focus();
                      }}
                      size="large"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button
        variant="contained"
        color="primary"
        size="large"
        style={{ marginTop: 25 }}
        onClick={() => setActiveState(2)}
        disabled={checkoutData.books.length === 0}
      >
        Continue
      </Button>
      <br />
      <Button
        color="primary"
        style={{ marginTop: 25 }}
        onClick={() => setActiveState(0)}
      >
        Go Back
      </Button>
    </div>
  );
};

const Submit = ({
  setActiveState,
  checkoutData,
  setCheckoutData,
}: {
  setActiveState: React.Dispatch<React.SetStateAction<number>>;
  checkoutData: checkoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<checkoutData>>;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const functions = useFunctions();
  const NotificationHandler = useContext(NotificationContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!activeLibraryID) throw new Error('No active library found!');

    setIsSubmitting(true);
    const books: checkoutBookDataBooks[] = [];
    checkoutData.books.forEach((book) => {
      books.push({
        bookID: book.parent,
        condition: book.data.condition ?? 3,
        copyID: book.id,
        dueDate: new Date(book.dueDate).setHours(41, 0, 0, 0),
      });
    });

    if (!checkoutData.user?.uid) {
      // Should never happen
      throw new Error('This user does not have a UID');
    }

    const checkoutBookFunctionData: checkoutBookData = {
      books,
      userID: checkoutData.user?.uid,
      libraryID: activeLibraryID,
    };

    await httpsCallable(
      functions,
      'checkoutBook'
    )(checkoutBookFunctionData)
      .then(() => {
        setCheckoutData({
          user: null,
          books: [],
        });
        setActiveState(0);
      })
      .catch((err) => {
        console.error(err);
        NotificationHandler.addNotification({
          message: `An unexpected error occurred: ${err.code} ${err.message}`,
          severity: 'error',
          timeout: 10000,
        });
      });
    setIsSubmitting(false);
  }
  return (
    <div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TableContainer
          component={Paper}
          style={{
            margin: 10,
            padding: 25,
            maxWidth: '90%',
          }}
        >
          <Table aria-label="copy table">
            <TableHead>
              <TableRow>
                <TableCell>Identifier</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkoutData.books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell component="th" scope="row">
                    {book.data.identifier}
                  </TableCell>
                  <TableCell>
                    <b>{book.parentData?.volumeInfo?.title || ''}</b>{' '}
                    {book.parentData?.volumeInfo?.subtitle || ''}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={book.dueDate}
                      onChange={(event: any) => {
                        const newArray = checkoutData.books;
                        const newBook = { ...book };
                        newBook.dueDate = event.target.value;
                        newArray.splice(index, 1, newBook);
                        setCheckoutData({
                          books: newArray,
                          user: checkoutData.user,
                        });
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting}
        style={{ marginTop: 25 }}
        onClick={() => submit()}
      >
        {!isSubmitting && <>Submit</>}
        {isSubmitting && (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Button>
      <br />
      <Button
        color="primary"
        style={{ marginTop: 25 }}
        onClick={() => setActiveState(1)}
      >
        Go Back
      </Button>
    </div>
  );
};

const CheckOut = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const user = useUser().data;
  if (!user) throw new Error('No user signed in!');

  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const [activeState, setActiveState] = useState(0);
  const [checkoutData, setCheckoutData] = useState<checkoutData>({
    user: null,
    books: [],
  });
  return (
    <div>
      <div className="text-center lead m-5">
        <h1>Check Out</h1>
        {checkoutData.user && (
          <div>
            <h4>
              Checking out books for{' '}
              <b>
                {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                  libraryDoc.ownerUserID === user.uid) && (
                  <Link to={`/users/${checkoutData.user.uid}`}>
                    {checkoutData.user.firstName} {checkoutData.user.lastName}
                  </Link>
                )}
                {!(
                  libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                  libraryDoc.ownerUserID === user.uid
                ) && (
                  <>
                    {checkoutData.user.firstName} {checkoutData.user.lastName}
                  </>
                )}
              </b>
            </h4>
            <ul style={{ listStylePosition: 'inside' }}>
              <li>
                <b>{checkoutData.user?.activeCheckouts?.length ?? 0}</b> book
                {(checkoutData.user?.activeCheckouts?.length ?? 0) === 1
                  ? ''
                  : 's'}{' '}
                currently checked out
              </li>
              <li>
                Allowed <b>{checkoutData.user?.maxCheckouts ?? 0}</b> checkout
                {(checkoutData.user?.maxCheckouts ?? 0) === 1 ? '' : 's'} at a
                time
              </li>
            </ul>
          </div>
        )}
        {!checkoutData.user && <p>Select a user to get started.</p>}
      </div>
      <Stepper style={{ marginInline: '5%' }}>
        <Step key={0} active={activeState === 0} completed={activeState > 0}>
          <StepLabel>Enter User</StepLabel>
        </Step>
        <Step key={1} active={activeState === 1} completed={activeState > 1}>
          <StepLabel>Scan Books</StepLabel>
        </Step>
        <Step key={2} active={activeState === 2} completed={activeState > 2}>
          <StepLabel>Finalize Checkout</StepLabel>
        </Step>
      </Stepper>
      <div className="text-center" style={{ marginTop: '1rem' }}>
        <Suspense fallback={<Loading />}>
          {activeState === 0 && (
            <EnterUser
              setActiveState={setActiveState}
              setCheckoutData={setCheckoutData}
            />
          )}
          {activeState === 1 && (
            <ScanBooks
              setActiveState={setActiveState}
              checkoutData={checkoutData}
              setCheckoutData={setCheckoutData}
            />
          )}
          {activeState === 2 && (
            <Submit
              setActiveState={setActiveState}
              checkoutData={checkoutData}
              setCheckoutData={setCheckoutData}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default CheckOut;
