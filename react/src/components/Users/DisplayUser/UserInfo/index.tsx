import React, { useContext, useState } from 'react';

import { useUser, useFirestore, useAuth } from 'reactfire';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
// @ts-ignore
import PhoneInput from 'react-phone-number-input/input';

import {
  TextField,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { VpnKey, Lock, LockOpen } from '@material-ui/icons';

import FirebaseContext from 'src/contexts/FirebaseContext';
import { userInfo as userInfoInterface } from '@common/types/User';

const UserInfo = ({ userInfo }: { userInfo: userInfoInterface }) => {
  const firestore = useFirestore;
  const { FieldValue } = firestore;
  const auth = useAuth();
  const { id } = useParams<any>();
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
            startIcon={<VpnKey />}
            disabled={userInfo.disabled}
            onClick={() => {
              const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: true,
              };
              if (userInfo.email)
                auth
                  .sendPasswordResetEmail(userInfo.email, actionCodeSettings)
                  .then(() => {
                    setSendResetPasswordSuccess(true);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
            }}
          >
            {sendResetPasswordSuccess && <>Success!</>}
            {!sendResetPasswordSuccess && <>Reset Password</>}
          </Button>
        </Grid>
        <Grid item xs={6} className="text-center">
          <h1 className="text-center">
            {userInfo.firstName} {userInfo.lastName}
          </h1>
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant={userInfo.disabled ? 'contained' : 'outlined'}
            color="primary"
            disabled={currentUser.uid === userInfo.uid}
            startIcon={userInfo.disabled ? <LockOpen /> : <Lock />}
            style={{ float: 'right' }}
            onClick={() => {
              userDocRef.set(
                {
                  userInfo: {
                    editedBy: currentUser.uid,
                    editedTime: FieldValue.serverTimestamp(),
                    disabled: !userInfo.disabled,
                  },
                },
                { merge: true }
              );
            }}
          >
            {userInfo.disabled && <>Enable Account</>}
            {!userInfo.disabled && <>Disable Account</>}
          </Button>
        </Grid>
      </Grid>
      <br />
      <div className="text-center">
        <Link
          to={`/users/${userInfo.createdBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Created:{' '}
          {userInfo?.createdTime?.toDate()?.toLocaleString() || 'Loading...'}
        </Link>
        <br />
        <Link
          to={`/users/${userInfo.editedBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Last Edited:{' '}
          {userInfo?.editedTime?.toDate()?.toLocaleString() || 'Loading...'}
        </Link>
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          displayName: userInfo.displayName || '',
          email: userInfo.email || '',
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          VIEW_BOOKS: userInfo.permissions?.VIEW_BOOKS || false,
          REVIEW_BOOKS: userInfo.permissions?.REVIEW_BOOKS || false,
          CHECK_IN: userInfo.permissions?.CHECK_IN || false,
          CHECK_OUT: userInfo.permissions?.CHECK_OUT || false,
          MANAGE_BOOKS: userInfo.permissions?.MANAGE_BOOKS || false,
          MANAGE_CHECKOUTS: userInfo.permissions?.MANAGE_CHECKOUTS || false,
          MANAGE_USERS: userInfo.permissions?.MANAGE_USERS || false,
          phoneNumber: userInfo.phoneNumber || '',
          photoURL: userInfo.photoURL || '',
          role: userInfo.role || 0,
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
            onKeyDown={(keyEvent: React.KeyboardEvent<HTMLFormElement>) => {
              const target = keyEvent.target as HTMLFormElement;
              if (
                (keyEvent.key || keyEvent.code) === 'Enter' &&
                target.id !== 'description'
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
                    currentUser.uid === userInfo.uid &&
                    firebaseContext.claims?.role < 1000
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
                    currentUser.uid === userInfo.uid &&
                    firebaseContext.claims?.role < 1000
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
                    currentUser.uid === userInfo.uid &&
                    firebaseContext.claims?.role < 1000
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <PhoneInput
                  country="US"
                  // @ts-ignore
                  inputComponent={TextField}
                  value={values.phoneNumber}
                  smartCaret={false}
                  onChange={(phoneNumber: any) => {
                    setFieldValue('phoneNumber', phoneNumber, false);
                  }}
                  id="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  disabled={
                    currentUser.uid === userInfo.uid &&
                    firebaseContext.claims?.role < 1000
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
                currentUser.uid === userInfo.uid &&
                firebaseContext.claims?.role < 1000
              }
              error={Boolean(errors.photoURL) && Boolean(touched.photoURL)}
              helperText={errors.photoURL}
            />
            <br />
            <br />
            <h4>Permissions</h4>
            <div>
              Role:
              <ButtonGroup
                variant="text"
                color="primary"
                aria-label="text primary button group"
                size="small"
                className="text-center mx-auto align-center center"
                disabled={
                  currentUser.uid === userInfo.uid &&
                  firebaseContext.claims?.role < 1000
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
                    disabled={
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
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
                      currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000
                    }
                  />
                }
                label="Manage Users"
                labelPlacement="end"
              />
            </div>
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
                    (currentUser.uid === userInfo.uid &&
                      firebaseContext.claims?.role < 1000)
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
