import React, { useContext } from 'react';

import { useUser, useFirestore, useAuth, useFirestoreDocData } from 'reactfire';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input/input';

import { TextField, Button, Grid, CircularProgress } from '@mui/material';
import { VpnKey, Lock, LockOpen } from '@mui/icons-material';

import NotificationContext from 'src/contexts/NotificationContext';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import User from '@common/types/User';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';

const UserInfo = ({ user }: { user: User }) => {
  const NotificationHandler = useContext(NotificationContext);
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();
  const auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<any>();
  if (id === undefined) throw new Error('No user defined.');

  const userDocRef = doc(firestore, 'libraries', activeLibraryID, 'users', id);

  const currentUser = useUser().data;
  if (!currentUser) throw new Error('User is not signed in.');

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const UserSchema = yup.object().shape({
    expiration: yup.date(),
    email: yup.string().email(),
    phoneNumber: yup.string().optional(),
    firstName: yup.string(),
    lastName: yup.string(),
  });

  const userExpired = user.expiration
    ? user.expiration.toDate() < new Date()
    : false;

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            size="small"
            color="primary"
            startIcon={<VpnKey />}
            disabled={userExpired}
            onClick={() => {
              const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: true,
              };
              if (user.email)
                sendPasswordResetEmail(auth, user.email, actionCodeSettings)
                  .then(() => {
                    NotificationHandler.addNotification({
                      message: `Reset Password Email Sent`,
                      severity: 'success',
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                    NotificationHandler.addNotification({
                      message: `An unexpected error occurred: ${err.code} ${err.message}`,
                      severity: 'error',
                      timeout: 10000,
                    });
                  });
            }}
          >
            Reset Password
          </Button>
        </Grid>
        <Grid item xs={6} className="text-center">
          <h1 className="text-center">
            {user.firstName} {user.lastName}
          </h1>
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant={userExpired ? 'contained' : 'outlined'}
            color="primary"
            disabled={currentUser.uid === user.uid}
            startIcon={userExpired ? <LockOpen /> : <Lock />}
            style={{ float: 'right' }}
            onClick={() => {
              navigate(`/checkouts`);
            }}
          >
            View Checkouts
          </Button>
        </Grid>
      </Grid>
      <br />
      <div className="text-center">
        <Link
          to={`/users/${user.createdBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Created: {user?.createdAt?.toDate()?.toLocaleString() || 'Loading...'}
        </Link>
        <br />
        <Link
          to={`/users/${user.updatedBy}`}
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          Last Edited:{' '}
          {user?.updatedAt?.toDate()?.toLocaleString() || 'Loading...'}
        </Link>
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        }}
        validationSchema={UserSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          const updatedUserData: Partial<User> = {
            updatedBy: currentUser.uid,
            updatedAt: serverTimestamp() as any,
            email: values.email,
            phoneNumber: values.phoneNumber === '' ? null : values.phoneNumber,
            firstName: values.firstName,
            lastName: values.lastName,
          };

          setDoc(userDocRef, updatedUserData, { merge: true })
            .then(() => {
              NotificationHandler.addNotification({
                message: `User info updated.`,
                severity: 'success',
              });
            })
            .catch((err) => {
              console.error(err);
              NotificationHandler.addNotification({
                message: `An unexpected error occurred: ${err.code} ${err.message}`,
                severity: 'error',
                timeout: 10000,
              });
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {({ values, isSubmitting, handleChange, setFieldValue }) => (
          <Form
            noValidate
            className="px-5"
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
            <h3 className="text-center">Basic Information</h3>
            <br />
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  value={values.firstName}
                  onChange={handleChange}
                  id="firstName"
                  label="First Name"
                  fullWidth
                  disabled={
                    currentUser.uid === user.uid &&
                    libraryDoc.ownerUserID !== user.uid
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
                    currentUser.uid === user.uid &&
                    libraryDoc.ownerUserID !== user.uid
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
                    currentUser.uid === user.uid &&
                    libraryDoc.ownerUserID !== user.uid
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <PhoneInput
                  country="US"
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
                    currentUser.uid === user.uid &&
                    libraryDoc.ownerUserID !== user.uid
                  }
                />
              </Grid>
            </Grid>
            <br />
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
                    (currentUser.uid === user.uid &&
                      libraryDoc.ownerUserID !== user.uid)
                  }
                >
                  {isSubmitting && <CircularProgress size={24} />}
                  {!isSubmitting && <>Update User Info</>}
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
