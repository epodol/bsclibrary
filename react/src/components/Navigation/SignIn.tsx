import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@material-ui/core';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

const SignIn = () => {
  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  });

  const ResetPassowrdScheme = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
  });

  const auth = useAuth();

  const [displaySignInForm, setDisplaySignInForm] = useState(false);
  const [displayResetPasswordForm, setDisplayResetPasswordForm] =
    useState(false);

  return (
    <>
      <Button
        size="large"
        variant="contained"
        color="default"
        onClick={() => setDisplaySignInForm(true)}
      >
        Sign In
      </Button>

      <Dialog
        open={displaySignInForm}
        onClose={() => setDisplaySignInForm(false)}
      >
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            await auth
              .signInWithEmailAndPassword(values.email, values.password)
              .catch((err) => {
                if (err.code === 'auth/wrong-password') {
                  actions.setFieldError('password', 'Wrong Password');
                } else if (err.code === 'auth/user-not-found') {
                  actions.setFieldError('email', 'User not Found');
                } else if (err.code === 'auth/user-disabled') {
                  actions.setFieldError('email', 'This user has been disabled');
                } else if (err.code === 'auth/invalid-email') {
                  actions.setFieldError('email', 'Please enter a valid email');
                }
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ values, errors, isSubmitting, handleChange, submitCount }) => (
            <Form noValidate>
              <DialogTitle disableTypography>
                <h2>Sign In</h2>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Welcome! If you already have registered for an account, please
                  sign in here. If you do not have an account, please vist the
                  library and register.
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
                <br />
                <div style={{ float: 'right', paddingTop: 3 }}>
                  <Button
                    className="text-dark"
                    size="small"
                    onClick={() => {
                      setDisplaySignInForm(false);
                      setDisplayResetPasswordForm(true);
                    }}
                  >
                    Reset password
                  </Button>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDisplaySignInForm(false)}
                  color="primary"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {!isSubmitting && <p className="white-text m-0">Sign In</p>}
                  {isSubmitting && (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>{' '}
      </Dialog>

      <Dialog
        open={displayResetPasswordForm}
        onClose={() => setDisplayResetPasswordForm(false)}
      >
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={ResetPassowrdScheme}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            const actionCodeSettings = {
              url: window.location.origin,
              handleCodeInApp: true,
            };
            await auth
              .sendPasswordResetEmail(values.email, actionCodeSettings)
              .then(() => {
                setDisplayResetPasswordForm(false);
              })
              .catch((err) => {
                if (err.code === 'auth/invalid-email') {
                  actions.setFieldError('email', 'Invalid email');
                } else if (err.code === 'auth/user-not-found') {
                  actions.setFieldError('email', 'User not Found');
                } else if (err.code === 'auth/user-disabled') {
                  actions.setFieldError('email', 'This user has been disabled');
                } else if (err.code === 'auth/invalid-email') {
                  actions.setFieldError('email', 'Please enter a valid email');
                } else
                  actions.setFieldError('email', `Internal error: ${err.code}`);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ values, errors, isSubmitting, handleChange, submitCount }) => (
            <Form noValidate>
              <DialogTitle disableTypography>
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
                    className="text-dark"
                    size="small"
                    onClick={() => {
                      setDisplayResetPasswordForm(false);
                      setDisplaySignInForm(true);
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDisplayResetPasswordForm(false)}
                  color="primary"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {!isSubmitting && (
                    <p className="white-text m-0">Reset Password</p>
                  )}
                  {isSubmitting && (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>{' '}
      </Dialog>
    </>
  );
};

export default SignIn;
