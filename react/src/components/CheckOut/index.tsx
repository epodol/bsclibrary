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
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { useFirebaseApp } from 'reactfire';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import User from '@common/types/User';
import Copy, { condition as conditionType } from '@common/types/Copy';
import checkoutBookData, {
  checkoutBookDataBooks,
} from '@common/functions/checkoutBook';

import FirebaseContext from 'src/contexts/FirebaseContext';
import Loading from '../Loading';

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

function determineCondition(condition: conditionType) {
  switch (condition) {
    case 1:
      return 'New';
    case 2:
      return 'Good';
    case 3:
      return 'Fair';
    case 4:
      return 'Poor';
    case 5:
      return 'Bad';
    default:
      return 'Unknown Condition';
  }
}

const EnterUserScheme = yup.object().shape({
  userID: yup.string().required("You need to enter the User's ID"),
});

const EnterUser = ({
  setActiveState,
  checkoutData,
  setCheckoutData,
}: {
  setActiveState: React.Dispatch<React.SetStateAction<number>>;
  checkoutData: checkoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<checkoutData>>;
}) => {
  const firebaseApp = useFirebaseApp();
  return (
    <div>
      <Formik
        initialValues={{
          userID: '',
        }}
        validationSchema={EnterUserScheme}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          const userDoc = await firebaseApp
            .firestore()
            .collection('users')
            .doc(values.userID)
            .get();

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
          if (user.userInfo?.disabled ?? true) {
            actions.setFieldError('userID', 'This User is disabled');
            return actions.setSubmitting(false);
          }

          // TODO: Implement logic to check if user can checkout books.
          setCheckoutData({ books: checkoutData.books, user });
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
              helperText={submitCount > 0 ? errors.userID : ''}
              value={values.userID}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              autoFocus
            />
          </Form>
        )}
      </Formik>
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
  const bookInput: any = useRef();
  const firebaseApp = useFirebaseApp();
  return (
    <div>
      <Formik
        initialValues={{
          book: '',
        }}
        validationSchema={ScanBooksScheme}
        onSubmit={async (values, actions) => {
          const bookResults = await firebaseApp
            .firestore()
            .collectionGroup('copies')
            .where('barcode', '==', values.book)
            .get();

          if (bookResults.empty) {
            actions.setFieldError('book', "This book doesn't exist");
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }
          if (bookResults.size !== 1) {
            actions.setFieldError(
              'book',
              'I found more than one book with this barcode.'
            );
            actions.setSubmitting(false);
            return bookInput?.current?.focus() || null;
          }

          const { id, ref } = bookResults.docs[0];
          const data = bookResults.docs[0].data() as Copy;

          if (
            checkoutData.books.some((book) => book.data.barcode === values.book)
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

          const parentData = await (await parent.get()).data();

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
              label="Barcode"
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
      {(checkoutData.user?.checkoutInfo?.maxCheckouts ?? 0) -
        ((checkoutData.user?.checkoutInfo?.activeCheckouts.length ?? 0) +
          checkoutData.books.length) >=
        1 && (
        <p>
          {checkoutData.user?.userInfo.firstName}{' '}
          {checkoutData.user?.userInfo.lastName} is only allowed{' '}
          {(checkoutData.user?.checkoutInfo?.maxCheckouts ?? 0) -
            ((checkoutData.user?.checkoutInfo?.activeCheckouts.length ?? 0) +
              checkoutData.books.length)}{' '}
          more checkouts.
        </p>
      )}
      {(checkoutData.user?.checkoutInfo?.maxCheckouts ?? 0) -
        ((checkoutData.user?.checkoutInfo?.activeCheckouts.length ?? 0) +
          checkoutData.books.length) <
        1 && (
        <h5>
          <b>
            {checkoutData.user?.userInfo.firstName}{' '}
            {checkoutData.user?.userInfo.lastName} is not allowed any more
            checkouts.{' '}
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
                <TableCell>Barcode</TableCell>
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
                    {book.data.barcode}
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
                          const newBook = { ...book };
                          newBook.data.condition = event.target.value;
                          setCheckoutData({
                            books: checkoutData.books.splice(index, 1, newBook),
                            user: checkoutData.user,
                          });
                        }}
                      >
                        <MenuItem value={1}>{determineCondition(1)}</MenuItem>
                        <MenuItem value={2}>{determineCondition(2)}</MenuItem>
                        <MenuItem value={3}>{determineCondition(3)}</MenuItem>
                        <MenuItem value={4}>{determineCondition(4)}</MenuItem>
                        <MenuItem value={5}>{determineCondition(5)}</MenuItem>
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
  const functions = useFirebaseApp();

  async function submit() {
    const books: checkoutBookDataBooks[] = [];
    checkoutData.books.forEach((book) => {
      books.push({
        bookID: book.parent,
        condition: book.data.condition ?? 3,
        copyID: book.id,
        dueDate: new Date(book.dueDate).setHours(41, 0, 0, 0),
      });
    });

    if (!checkoutData.user?.userInfo?.uid) {
      // Should never happen
      throw new Error('This user does not have a UID');
    }

    const checkoutBookFunctionData: checkoutBookData = {
      books,
      userID: checkoutData.user?.userInfo?.uid,
    };
    console.log('Function Data', checkoutBookFunctionData);

    await functions
      .functions('us-west2')
      .httpsCallable('checkoutBook')(checkoutBookFunctionData)
      .then((res) => {
        console.log('Function Response', res);
        setCheckoutData({
          user: null,
          books: [],
        });
        setActiveState(0);
      })
      .catch((err) => {
        console.error(err);
      });
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
                <TableCell>Barcode</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkoutData.books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell component="th" scope="row">
                    {book.data.barcode}
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
                        console.log(newBook);
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
        style={{ marginTop: 25 }}
        onClick={() => submit()}
      >
        Submit
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
  const [activeState, setActiveState] = useState(0);
  const [checkoutData, setCheckoutData] = useState<checkoutData>({
    user: null,
    books: [],
  });
  const firebaseContext = useContext(FirebaseContext);
  return (
    <div>
      <div className="text-center lead m-5">
        <h1>Check Out</h1>
        {checkoutData.user && (
          <div>
            <h4>
              Checking out books for{' '}
              <b>
                {firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                  <Link to={`/users/${checkoutData.user.userInfo.uid}`}>
                    {checkoutData.user.userInfo.firstName}{' '}
                    {checkoutData.user.userInfo.lastName}
                  </Link>
                )}
                {!firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                  <>
                    {checkoutData.user.userInfo.firstName}{' '}
                    {checkoutData.user.userInfo.lastName}
                  </>
                )}
              </b>
            </h4>
            <ul style={{ listStylePosition: 'inside' }}>
              <li>
                <b>
                  {checkoutData.user?.checkoutInfo?.activeCheckouts?.length ??
                    0}
                </b>{' '}
                book
                {(checkoutData.user?.checkoutInfo?.activeCheckouts?.length ??
                  0) === 1
                  ? ''
                  : 's'}{' '}
                currently checked out
              </li>
              <li>
                Allowed{' '}
                <b>{checkoutData.user?.checkoutInfo?.maxCheckouts ?? 0}</b>{' '}
                checkout
                {(checkoutData.user?.checkoutInfo?.maxCheckouts ?? 0) === 1
                  ? ''
                  : 's'}{' '}
                at a time
              </li>
            </ul>
          </div>
        )}
        {!checkoutData.user && <p>Select a user to get started.</p>}
      </div>
      <Stepper style={{ marginInline: 100 }}>
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
              checkoutData={checkoutData}
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
