import React, { useContext, useState } from 'react';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import NotificationContext from 'src/contexts/NotificationContext';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  setPersistence,
  indexedDBLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  });

  const ResetPasswordScheme = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
  });

  const auth = useAuth();

  const NotificationHandler = useContext(NotificationContext);

  const [displaySignInForm, setDisplaySignInForm] = useState(true);

  return (
    <div>
      <Paper
        sx={{
          marginTop: {
            xs: '1rem',
            sm: '1rem',
            md: '2rem',
            lg: '4rem',
            xl: '7rem',
          },
          marginLeft: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          marginRight: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          padding: {
            xs: '1rem',
            sm: '1rem',
            md: '1rem',
            lg: '2rem',
            xl: '3rem',
          },
        }}
      >
        {displaySignInForm && (
          <Formik
            initialValues={{
              email: '',
              password: '',
              rememberMe: true,
            }}
            validationSchema={SignInSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await setPersistence(
                auth,
                values.rememberMe
                  ? indexedDBLocalPersistence
                  : browserSessionPersistence
              ).then(async () => {
                await signInWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                )
                  .then(() => {
                    actions.setSubmitting(false);
                  })
                  .catch((err) => {
                    if (err.code === 'auth/wrong-password') {
                      actions.setFieldError('password', 'Wrong Password');
                    } else if (err.code === 'auth/user-not-found') {
                      actions.setFieldError('email', 'User not Found');
                    } else if (err.code === 'auth/user-disabled') {
                      actions.setFieldError(
                        'email',
                        'This user has been disabled'
                      );
                    } else if (err.code === 'auth/invalid-email') {
                      actions.setFieldError(
                        'email',
                        'Please enter a valid email'
                      );
                    }
                    actions.setSubmitting(false);
                  });
              });
            }}
          >
            {({ values, errors, isSubmitting, handleChange, submitCount }) => (
              <Form noValidate>
                <h1 style={{ textAlign: 'center' }}>Sign In</h1>
                <p style={{ textAlign: 'center' }}>
                  Welcome! If you already have registered for an account, please
                  sign in here. If you do not have an account, please{' '}
                  <Link to="/createaccount">click here to create one.</Link>
                </p>
                <TextField
                  id="email"
                  type="email"
                  label="Email"
                  fullWidth
                  error={!!errors.email && submitCount > 0}
                  helperText={submitCount > 0 ? errors.email : ''}
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  style={{ paddingBottom: '1rem' }}
                />
                <br />
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  fullWidth
                  error={!!errors.password && submitCount > 0}
                  helperText={submitCount > 0 ? errors.password : ''}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                />
                <FormControlLabel
                  style={{ marginTop: '.5rem' }}
                  control={
                    <Checkbox
                      checked={values.rememberMe}
                      onChange={handleChange}
                      name="rememberMe"
                      color="primary"
                    />
                  }
                  label="Remember Me  "
                />
                <br />
                <div style={{ float: 'right', paddingTop: 3 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setDisplaySignInForm((current) => !current);
                    }}
                  >
                    Reset password instead
                  </Button>
                </div>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {!isSubmitting && <p className="m-0">Sign In</p>}
                  {isSubmitting && (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        )}
        {!displaySignInForm && (
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={ResetPasswordScheme}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: true,
              };
              await sendPasswordResetEmail(
                auth,
                values.email,
                actionCodeSettings
              )
                .then(() => {
                  NotificationHandler.addNotification({
                    message: 'Reset Password Email Sent!',
                    severity: 'success',
                  });
                  setDisplaySignInForm((current) => !current);
                })
                .catch((err) => {
                  if (err.code === 'auth/user-not-found') {
                    actions.setFieldError('email', 'User not Found');
                  } else if (err.code === 'auth/user-disabled') {
                    actions.setFieldError(
                      'email',
                      'This user has been disabled'
                    );
                  } else if (err.code === 'auth/invalid-email') {
                    actions.setFieldError(
                      'email',
                      'Please enter a valid email'
                    );
                  } else {
                    console.error(err);
                    actions.setFieldError(
                      'email',
                      `Internal error: ${err.code}`
                    );
                    NotificationHandler.addNotification({
                      message: `An unexpected error occurred: ${err.code} ${err.message}`,
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
            {({ values, errors, isSubmitting, handleChange, submitCount }) => (
              <Form noValidate>
                <DialogTitle>
                  <h2>Reset Password</h2>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    If you already have an account, but forgot your password,
                    enter your email here. If you also forgot which email you
                    used, visit the library for help.
                  </DialogContentText>

                  <TextField
                    id="email"
                    type="email"
                    label="Email"
                    fullWidth
                    error={!!errors.email && submitCount > 0}
                    helperText={submitCount > 0 ? errors.email : ''}
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                  />

                  <br />
                  <div style={{ float: 'right', paddingTop: 3 }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setDisplaySignInForm((current) => !current);
                      }}
                    >
                      Sign In instead
                    </Button>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {!isSubmitting && <p className="m-0">Reset Password</p>}
                    {isSubmitting && (
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </div>
  );
};

export default SignIn;
