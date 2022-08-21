import React, { useContext } from 'react';
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import {
  setPersistence,
  indexedDBLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import NotificationContext from 'src/contexts/NotificationContext';

const CreateAccount = () => {
  const NotificationHandler = useContext(NotificationContext);
  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
    confirmPassword: yup.string().required(),
  });

  const auth = useAuth();

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
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
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
              await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              )
                .then(({ user }) => {
                  actions.setSubmitting(false);
                  if (user.email) {
                    const actionCodeSettings = {
                      url: window.location.origin,
                      handleCodeInApp: true,
                    };
                    sendEmailVerification(user, actionCodeSettings)
                      .then(() => {
                        NotificationHandler.addNotification({
                          message: 'Email verification sent!',
                          severity: 'success',
                        });
                      })
                      .catch((error) => {
                        NotificationHandler.addNotification({
                          message: error.message,
                          severity: 'error',
                        });
                      });
                  }
                })
                .catch((err) => {
                  if (err.code === 'auth/email-already-in-use') {
                    actions.setFieldError(
                      'email',
                      'An account already exists with this email. Please sign in or reset your password instead.'
                    );
                  } else if (err.code === 'auth/weak-password') {
                    actions.setFieldError(
                      'password',
                      'Please enter a stronger password.'
                    );
                  } else if (err.code === 'auth/invalid-email') {
                    actions.setFieldError(
                      'email',
                      'This email is invalid. Please enter a valid email.'
                    );
                  } else {
                    actions.setFieldError(
                      'email',
                      'Uh oh. Something went wrong. Please try again later.'
                    );
                  }
                  actions.setSubmitting(false);
                });
            });
          }}
        >
          {({ values, errors, isSubmitting, handleChange, submitCount }) => (
            <Form noValidate style={{ textAlign: 'center' }}>
              <h1>Create Account</h1>
              <p>
                Welcome! If you do not have an account, please create one here.
                If you already have an account, please sign in instead.
              </p>
              <TextField
                id="email"
                type="email"
                label="Email"
                fullWidth
                sx={{ width: '50%' }}
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
                sx={{ width: '50%' }}
                error={!!errors.password && submitCount > 0}
                helperText={submitCount > 0 ? errors.password : ''}
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                style={{ paddingBottom: '1rem' }}
              />
              <br />
              <TextField
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                fullWidth
                sx={{ width: '50%' }}
                error={values.password !== values.confirmPassword}
                helperText={submitCount > 0 ? errors.confirmPassword : ''}
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={handleChange}
              />
              <br />
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
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                {!isSubmitting && <p className="m-0">Create Account</p>}
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </div>
  );
};

export default CreateAccount;
