import React, { useState, Fragment, useContext } from 'react';
import {
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  ButtonGroup,
  SnackbarContent,
  Grid,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useAuth, useFirebaseApp } from 'reactfire';
import { useHistory } from 'react-router';

import { addNewUserResult } from '@common/functions/addNewUser';
import NotificationContext from 'src/contexts/NotificationContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { sendPasswordResetEmail } from 'firebase/auth';

const AddUserForm = () => {
  const NotificationHandler = useContext(NotificationContext);

  const firebaseApp = useFirebaseApp();

  const functions = getFunctions(firebaseApp, 'us-west2');
  const auth = useAuth();

  const history = useHistory();

  const SetRoleSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required("Please enter the user's email"),
    first_name: yup.string().required("Please enter the user's first name"),
    last_name: yup.string().required("Please enter the user's last name"),
    role: yup
      .number()
      .min(0, 'The role must be greater than or equal to 0')
      .max(1000, 'The role must be less than or equal to 1000')
      .required("Please enter the user's new role"),
    VIEW_BOOKS: yup.boolean(),
    REVIEW_BOOKS: yup.boolean(),
    CHECK_IN: yup.boolean(),
    CHECK_OUT: yup.boolean(),
    MANAGE_BOOKS: yup.boolean(),
    MANAGE_CHECKOUTS: yup.boolean(),
    MANAGE_USERS: yup.boolean(),
    maxCheckouts: yup
      .number()
      .min(0, 'The max checkouts must be greater than or equal to 0'),
    maxRenews: yup
      .number()
      .min(0, 'The max checkouts must be greater than or equal to 0'),
  });
  const [alert, setAlert] = useState({
    show: false,
    user: '',
    email: '',
    uid: '',
  });

  return (
    <Container>
      <h2 className="flex-center">Add New User</h2>

      {alert.show && (
        <SnackbarContent
          onClick={() =>
            history.push({
              pathname: `/users/${alert.uid}`,
            })
          }
          style={{ cursor: 'pointer', backgroundColor: '#6DB058' }}
          message={<>Successfully added a new user: {alert.user}</>}
          action={alert.email}
        />
      )}
      <br />

      <Formik
        initialValues={{
          email: '',
          first_name: '',
          last_name: '',
          role: 100,
          VIEW_BOOKS: true,
          REVIEW_BOOKS: true,
          CHECK_IN: false,
          CHECK_OUT: false,
          MANAGE_BOOKS: false,
          MANAGE_CHECKOUTS: false,
          MANAGE_USERS: false,
          maxCheckouts: 3,
          maxRenews: 2,
        }}
        validationSchema={SetRoleSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await httpsCallable(
            functions,
            'addNewUser'
          )({
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            role: values.role,
            permissions: {
              VIEW_BOOKS: values.VIEW_BOOKS,
              REVIEW_BOOKS: values.REVIEW_BOOKS,
              CHECK_IN: values.CHECK_IN,
              CHECK_OUT: values.CHECK_OUT,
              MANAGE_BOOKS: values.MANAGE_BOOKS,
              MANAGE_CHECKOUTS: values.MANAGE_CHECKOUTS,
              MANAGE_USERS: values.MANAGE_USERS,
            },
            maxCheckouts: values.maxCheckouts,
            maxRenews: values.maxRenews,
          })
            .then((newUser) => {
              const newUserData = newUser.data as unknown as addNewUserResult;
              const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: true,
              };
              sendPasswordResetEmail(auth, values.email, actionCodeSettings);
              actions.setFieldValue('email', '', true);
              actions.setFieldTouched('email', false, true);
              actions.setFieldValue('first_name', '', true);
              actions.setFieldTouched('first_name', false, true);
              actions.setFieldValue('last_name', '', true);
              actions.setFieldTouched('last_name', false, true);
              setAlert({
                show: true,
                user:
                  `${values.first_name} ${values.last_name}` || values.email,
                email: values.email,
                uid: newUserData.uid,
              });
            })
            .catch((err) => {
              if (err.code === 'unauthenticated') {
                actions.setFieldError('email', 'Permission denied.');
              } else if (err.code === 'permission-denied') {
                actions.setFieldError(
                  'email',
                  'You do not have the permissions required to complete this request.'
                );
              } else if (err.code === 'invalid-argument') {
                actions.setFieldError('email', 'Invalid arguments');
              } else if (err.code === 'already-exists') {
                actions.setFieldError('email', 'This user already exists.');
              } else {
                actions.setFieldError('email', 'An internal error occurred.');
                console.error(err);
                NotificationHandler.addNotification({
                  message: `An unexpected error occurred.`,
                  severity: 'error',
                  timeout: 10000,
                });
              }
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {({
          values,
          errors,
          isSubmitting,
          submitCount,
          handleChange,
          setFieldValue,
          dirty,
        }) => (
          <Form noValidate>
            <h4>Basic Info</h4>
            <TextField
              id="email"
              type="email"
              fullWidth
              label="Email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              error={!!errors.email && submitCount > 0 && dirty}
              helperText={submitCount > 0 && dirty ? errors.email : ''}
            />
            <TextField
              id="first_name"
              type="text"
              fullWidth
              label="First Name"
              autoComplete="given-name"
              value={values.first_name}
              onChange={handleChange}
              error={!!errors.first_name && submitCount > 0 && dirty}
              helperText={submitCount > 0 && dirty ? errors.first_name : ''}
            />
            <TextField
              id="last_name"
              type="text"
              fullWidth
              label="Last Name"
              autoComplete="family-name"
              value={values.last_name}
              onChange={handleChange}
              error={!!errors.last_name && submitCount > 0 && dirty}
              helperText={submitCount > 0 && dirty ? errors.last_name : ''}
            />
            <br /> <br />
            <h4>Permissions</h4>
            <div>
              Role:{' '}
              <ButtonGroup
                variant="text"
                color="primary"
                aria-label="text primary button group"
                size="small"
                className="text-center mx-auto align-center center"
              >
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', false, true);
                    setFieldValue('CHECK_OUT', false, true);
                    setFieldValue('MANAGE_BOOKS', false, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 100, true);
                  }}
                  disabled={values.role === 100}
                >
                  Student
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', false, true);
                    setFieldValue('CHECK_OUT', false, true);
                    setFieldValue('MANAGE_BOOKS', false, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 200, true);
                  }}
                  disabled={values.role === 200}
                >
                  Parent
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', false, true);
                    setFieldValue('CHECK_OUT', false, true);
                    setFieldValue('MANAGE_BOOKS', false, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 300, true);
                  }}
                  disabled={values.role === 300}
                >
                  Teacher
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', false, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 400, true);
                  }}
                  disabled={values.role === 400}
                >
                  School Staff
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 500, true);
                  }}
                  disabled={values.role === 500}
                >
                  Library Committee Member
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', false, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 600, true);
                  }}
                  disabled={values.role === 600}
                >
                  Junior Librarian
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', true, true);
                    setFieldValue('MANAGE_USERS', false, true);
                    setFieldValue('role', 700, true);
                  }}
                  disabled={values.role === 700}
                >
                  Librarian
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', true, true);
                    setFieldValue('MANAGE_USERS', true, true);
                    setFieldValue('role', 800, true);
                  }}
                  disabled={values.role === 800}
                >
                  Senior Librarian
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', true, true);
                    setFieldValue('MANAGE_USERS', true, true);
                    setFieldValue('role', 900, true);
                  }}
                  disabled={values.role === 900}
                >
                  School Administrator
                </Button>
                <Button
                  onClick={() => {
                    setFieldValue('VIEW_BOOKS', true, true);
                    setFieldValue('REVIEW_BOOKS', true, true);
                    setFieldValue('CHECK_IN', true, true);
                    setFieldValue('CHECK_OUT', true, true);
                    setFieldValue('MANAGE_BOOKS', true, true);
                    setFieldValue('MANAGE_CHECKOUTS', true, true);
                    setFieldValue('MANAGE_USERS', true, true);
                    setFieldValue('role', 1000, true);
                  }}
                  disabled={values.role === 1000}
                >
                  Administrator
                </Button>
              </ButtonGroup>
              <br />
              <FormControlLabel
                value="VIEW_BOOKS"
                checked={values.VIEW_BOOKS}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.VIEW_BOOKS}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('VIEW_BOOKS', true, true);
                      else setFieldValue('VIEW_BOOKS', false, true);
                    }}
                  />
                }
                label="View Books"
                labelPlacement="end"
              />
              <FormControlLabel
                value="REVIEW_BOOKS"
                checked={values.VIEW_BOOKS}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.REVIEW_BOOKS}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('REVIEW_BOOKS', true, true);
                      else setFieldValue('REVIEW_BOOKS', false, true);
                    }}
                  />
                }
                label="Review Books"
                labelPlacement="end"
              />
              <FormControlLabel
                value="CHECK_IN"
                checked={values.CHECK_IN}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.CHECK_IN}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('CHECK_IN', true, true);
                      else setFieldValue('CHECK_IN', false, true);
                    }}
                  />
                }
                label="Check In"
                labelPlacement="end"
              />
              <FormControlLabel
                value="CHECK_OUT"
                checked={values.CHECK_OUT}
                control={
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('CHECK_OUT', true, true);
                      else setFieldValue('CHECK_OUT', false, true);
                    }}
                  />
                }
                label="Check Out"
                labelPlacement="end"
              />
              <FormControlLabel
                value="MANAGE_BOOKS"
                checked={values.MANAGE_BOOKS}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.MANAGE_BOOKS}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('MANAGE_BOOKS', true, true);
                      else setFieldValue('MANAGE_BOOKS', false, true);
                    }}
                  />
                }
                label="Manage Books"
                labelPlacement="end"
              />
              <FormControlLabel
                value="MANAGE_CHECKOUTS"
                checked={values.MANAGE_CHECKOUTS}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.MANAGE_CHECKOUTS}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('MANAGE_CHECKOUTS', true, true);
                      else setFieldValue('MANAGE_CHECKOUTS', false, true);
                    }}
                  />
                }
                label="Manage Checkouts"
                labelPlacement="end"
              />
              <FormControlLabel
                value="MANAGE_USERS"
                checked={values.MANAGE_USERS}
                control={
                  <Checkbox
                    color="primary"
                    checked={values.MANAGE_USERS}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFieldValue('MANAGE_USERS', true, true);
                      else setFieldValue('MANAGE_USERS', false, true);
                    }}
                  />
                }
                label="Manage Users"
                labelPlacement="end"
              />
            </div>
            <br />
            <h4>Checkout Info</h4>
            <div>
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    value={values.maxCheckouts}
                    onChange={handleChange}
                    id="maxCheckouts"
                    label="Max Checkouts"
                    type="number"
                    fullWidth
                    error={!!errors.maxCheckouts && submitCount > 0}
                    helperText={submitCount > 0 ? errors.maxCheckouts : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    value={values.maxRenews}
                    onChange={handleChange}
                    id="maxRenews"
                    label="Max Renews"
                    type="number"
                    fullWidth
                    error={!!errors.maxRenews && submitCount > 0}
                    helperText={submitCount > 0 ? errors.maxRenews : ''}
                  />
                </Grid>
              </Grid>
            </div>
            <br />
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                style={{ color: 'white' }}
              >
                {!isSubmitting && <>Add User</>}
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddUserForm;
