import React, { useContext, useState } from 'react';

import { useUser, useFirestore, useAuth } from 'reactfire';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import PhoneInput from 'react-phone-number-input/input';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CircularProgress from '@material-ui/core/CircularProgress';

import FirebaseContext from '../../../Firebase';

const UserInfo = ({ user }) => {
  const firestore = useFirestore;
  const { FieldValue } = firestore;
  const auth = useAuth();
  const { id } = useParams();
  const userDocRef = firestore().collection('users').doc(id);

  const currentUser = useUser().data;
  const firebaseContext = useContext(FirebaseContext);

  const [sendResetPasswordSuccess, setSendResetPasswordSuccess] =
    useState(false);

  const UserSchema = yup.object().shape({
    disabled: yup.boolean(),
    displayName: yup.string(),
    email: yup.string().email(),
    firstName: yup.string(),
    lastName: yup.string(),
    VIEW_BOOKS: yup.boolean(),
    REVIEW_BOOKS: yup.boolean(),
    CHECK_IN: yup.boolean(),
    CHECK_OUT: yup.boolean(),
    MANAGE_BOOKS: yup.boolean(),
    MANAGE_CHECKOUTS: yup.boolean(),
    MANAGE_USERS: yup.boolean(),
    phoneNumber: yup.number().nullable(),
    photoURL: yup.string().url().nullable(),
    role: yup.number(),
  });

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VpnKeyIcon />}
            disabled={user.userInfo.disabled}
            onClick={() => {
              const actionCodeSettings = {
                url: window.location.host,
                handleCodeInApp: true,
              };
              auth
                .sendPasswordResetEmail(user.userInfo.email, actionCodeSettings)
                .then(() => {
                  setSendResetPasswordSuccess(true);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            {sendResetPasswordSuccess && <>Success!</>}
            {!sendResetPasswordSuccess && <>Reset Password</>}
          </Button>
        </Grid>
        <Grid item xs={6} className="text-center">
          <h1 className="text-center">
            {user.userInfo.firstName} {user.userInfo.lastName}
          </h1>
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant={user.userInfo.disabled ? 'contained' : 'outlined'}
            color="primary"
            disabled={currentUser.uid === user.userInfo.uid}
            startIcon={user.userInfo.disabled ? <LockOpenIcon /> : <LockIcon />}
            style={{ float: 'right' }}
            onClick={() => {
              userDocRef.set(
                {
                  userInfo: {
                    editedBy: currentUser.uid,
                    editedTime: FieldValue.serverTimestamp(),
                    disabled: !user.userInfo.disabled,
                  },
                },
                { merge: true }
              );
            }}
          >
            {user.userInfo.disabled && <>Enable Account</>}
            {!user.userInfo.disabled && <>Disable Account</>}
          </Button>
        </Grid>
      </Grid>
      <br />
      <div className="text-center">
        <Link
          to={`/users/${user.userInfo.createdBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Created:{' '}
          {user.userInfo?.createdTime?.toDate()?.toLocaleString() ||
            'Loading...'}
        </Link>
        <br />
        <Link
          to={`/users/${user.userInfo.editedBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Last Edited:{' '}
          {user.userInfo?.editedTime?.toDate()?.toLocaleString() ||
            'Loading...'}
        </Link>
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          displayName: user.userInfo.displayName || '',
          email: user.userInfo.email || '',
          firstName: user.userInfo.firstName || '',
          lastName: user.userInfo.lastName || '',
          VIEW_BOOKS: user.userInfo.permissions.VIEW_BOOKS || false,
          REVIEW_BOOKS: user.userInfo.permissions.REVIEW_BOOKS || false,
          CHECK_IN: user.userInfo.permissions.CHECK_IN || false,
          CHECK_OUT: user.userInfo.permissions.CHECK_OUT || false,
          MANAGE_BOOKS: user.userInfo.permissions.MANAGE_BOOKS || false,
          MANAGE_CHECKOUTS: user.userInfo.permissions.MANAGE_CHECKOUTS || false,
          MANAGE_USERS: user.userInfo.permissions.MANAGE_USERS || false,
          phoneNumber: user.userInfo.phoneNumber || '',
          photoURL: user.userInfo.photoURL || '',
          role: user.userInfo.role || 0,
        }}
        validationSchema={UserSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          userDocRef.set(
            {
              userInfo: {
                editedBy: currentUser.uid,
                editedTime: FieldValue.serverTimestamp(),
                displayName: `${values.firstName} ${values.lastName}`,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber:
                  (values.phoneNumber || null) === ''
                    ? null
                    : values.phoneNumber || null,
                photoURL:
                  (values.photoURL || null) === ''
                    ? null
                    : values.photoURL || null,
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
              },
            },
            { merge: true }
          );

          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          // submitCount,
          setFieldValue,
        }) => (
          <Form
            noValidate
            className="pb-5 px-5"
            onKeyDown={(keyEvent) => {
              if (
                (keyEvent.key || keyEvent.code) === 'Enter' &&
                keyEvent.target.id !== 'description'
              ) {
                keyEvent.preventDefault();
              }
            }}
          >
            <br />
            <hr />
            <h4>Basic Information</h4>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  value={values.firstName}
                  onChange={handleChange}
                  id="firstName"
                  label="First Name"
                  fullWidth
                  disabled={
                    currentUser.uid === user.userInfo.uid &&
                    firebaseContext.claims.role < 1000
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  value={values.lastName}
                  onChange={handleChange}
                  id="lastName"
                  label="Last Name"
                  fullWidth
                  disabled={
                    currentUser.uid === user.userInfo.uid &&
                    firebaseContext.claims.role < 1000
                  }
                />
              </Grid>
            </Grid>
            <br />
            <Grid container>
              <Grid item xs={8}>
                <TextField
                  value={values.email}
                  onChange={handleChange}
                  id="email"
                  label="Email"
                  fullWidth
                  disabled={
                    currentUser.uid === user.userInfo.uid &&
                    firebaseContext.claims.role < 1000
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <PhoneInput
                  country="US"
                  inputComponent={TextField}
                  value={values.phoneNumber}
                  smartCaret={false}
                  onChange={(phoneNumber) => {
                    setFieldValue('phoneNumber', phoneNumber, false);
                  }}
                  id="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  disabled={
                    currentUser.uid === user.userInfo.uid &&
                    firebaseContext.claims.role < 1000
                  }
                />
              </Grid>
            </Grid>
            <TextField
              value={values.photoURL}
              onChange={handleChange}
              id="photoURL"
              label="Photo URL"
              fullWidth
              disabled={
                currentUser.uid === user.userInfo.uid &&
                firebaseContext.claims.role < 1000
              }
              error={errors.photoURL && touched.photoURL}
              helperText={errors.photoURL}
            />
            <br />
            <br />
            <h4>Permissions</h4>
            <div>
              Default Permissions:
              <ButtonGroup
                variant="text"
                color="primary"
                aria-label="text primary button group"
                size="small"
                className="text-center mx-auto align-center center"
                disabled={
                  currentUser.uid === user.userInfo.uid &&
                  firebaseContext.claims.role < 1000
                }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
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
                    disabled={
                      currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000
                    }
                  />
                }
                label="Manage Users"
                labelPlacement="end"
              />
            </div>
            <TextField
              value={values.role}
              onChange={handleChange}
              id="role"
              label="Role"
              disabled={
                currentUser.uid === user.userInfo.uid &&
                firebaseContext.claims.role < 1000
              }
            />
            <br />
            <div className="text-center">
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="large"
                  disabled={
                    isSubmitting ||
                    (currentUser.uid === user.userInfo.uid &&
                      firebaseContext.claims.role < 1000)
                  }
                >
                  {isSubmitting && <CircularProgress size={24} />}
                  {!isSubmitting && <>Submit</>}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserInfo;
