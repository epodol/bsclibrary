import React, { useContext, useRef, useState } from 'react';
import { Button, TextField, ButtonGroup, Paper } from '@material-ui/core';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { useFirebaseApp } from 'reactfire';
import 'firebase/firestore';

import Copy, { condition, status } from '@common/types/Copy';
import checkinBookData from '@common/functions/checkinBook';
import NotificationContext from 'src/contexts/NotificationContext';

const ScanBooksScheme = yup.object().shape({
  book: yup.string().required('You need to enter the Barcode'),
});

const CheckIn = () => {
  const NotificationHandler = useContext(NotificationContext);

  const firebaseApp = useFirebaseApp();
  const functions = firebaseApp.functions('us-west2');
  const bookInput: any = useRef();

  const [statusCheckIn, setStatusCheckIn] = useState<status>(0);

  const initialValues: {
    book: string;
    condition: condition | 0;
  } = { book: '', condition: 0 };

  return (
    <div className="text-center lead m-5">
      <h1>Check In</h1>
      <p>Select the condition, then scan the barcode.</p>
      <Paper style={{ padding: '2rem' }}>
        <Formik
          initialValues={initialValues}
          validationSchema={ScanBooksScheme}
          onSubmit={async (values, actions) => {
            if (values.condition === 0) {
              actions.setFieldError(
                'book',
                'Please select the condition of the book.'
              );
              actions.setSubmitting(false);
              return bookInput?.current?.focus() || null;
            }

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

            if (data.status !== 2) {
              actions.setFieldError(
                'book',
                'This book is not marked as checked out.'
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

            const checkinBookFunctionData: checkinBookData = {
              bookID: parent.id,
              copyID: id,
              condition: values.condition,
              status: statusCheckIn,
            };

            await functions
              .httpsCallable('checkinBook')(checkinBookFunctionData)
              .then(() => {
                NotificationHandler.addNotification({
                  message: `Checked in 1 book (${values.book})`,
                  severity: 'success',
                });
                actions.setSubmitting(false);
                actions.resetForm();
              })
              .catch((err) => {
                console.table(err);
                console.error(err);
                NotificationHandler.addNotification({
                  message: `An unexpected error occurred: ${err.message} (${err.code})`,
                  severity: 'error',
                  timeout: 10000,
                });
                actions.setFieldError(
                  'book',
                  'There was an error checking in this book.'
                );
                actions.setSubmitting(false);
              });
            return bookInput?.current?.focus() || null;
          }}
        >
          {({
            values,
            errors,
            isSubmitting,
            handleChange,
            submitCount,
            setFieldValue,
          }) => (
            <Form noValidate>
              Copy Status
              <br />
              <ButtonGroup
                style={{ margin: '1rem' }}
                variant="outlined"
                color="primary"
                size="large"
                className="text-center"
              >
                <Button
                  onClick={() => {
                    setStatusCheckIn(0);
                    bookInput?.current?.focus();
                  }}
                  disabled={statusCheckIn === 0}
                >
                  On Shelf
                </Button>
                <Button
                  onClick={() => {
                    setStatusCheckIn(1);
                    bookInput?.current?.focus();
                  }}
                  disabled={statusCheckIn === 1}
                >
                  In Storage
                </Button>
              </ButtonGroup>
              <br />
              Copy Condition
              <br />
              <ButtonGroup
                style={{ margin: '1rem' }}
                variant="outlined"
                color="primary"
                size="large"
                className="text-center"
              >
                <Button
                  onClick={() => {
                    setFieldValue('condition', 5);
                    bookInput?.current?.focus();
                  }}
                  disabled={values.condition === 5}
                >
                  Bad
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('condition', 4);
                    bookInput?.current?.focus();
                  }}
                  disabled={values.condition === 4}
                >
                  Poor
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('condition', 3);
                    bookInput?.current?.focus();
                  }}
                  disabled={values.condition === 3}
                >
                  Fair
                </Button>{' '}
                <Button
                  onClick={() => {
                    setFieldValue('condition', 2);
                    bookInput?.current?.focus();
                  }}
                  disabled={values.condition === 2}
                >
                  Good
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('condition', 1);
                    bookInput?.current?.focus();
                  }}
                  disabled={values.condition === 1}
                >
                  New
                </Button>
              </ButtonGroup>
              <br />
              <TextField
                style={{ marginTop: '1rem' }}
                inputRef={bookInput}
                id="book"
                type="text"
                label="Barcode"
                size="medium"
                variant="filled"
                error={!!errors.book && submitCount > 0}
                helperText={submitCount > 0 ? errors.book : ''}
                value={values.book}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                autoFocus
              />
              <br />
              <Button
                style={{ marginTop: '2rem' }}
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Check In
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </div>
  );
};

export default CheckIn;
