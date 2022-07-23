import React, { useContext } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { useParams } from 'react-router-dom';
import { TextField, Grid, Button, CircularProgress } from '@mui/material';

import User from '@common/types/User';

import NotificationContext from 'src/contexts/NotificationContext';
import { doc, setDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/database';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';

const checkoutInfoSchema = yup.object().shape({
  activeCheckouts: yup.array().of(yup.string()),
  maxCheckouts: yup.number().min(0),
  maxRenews: yup.number().min(0),
});

const UserCheckouts = ({ user }: { user: User }) => {
  const NotificationHandler = useContext(NotificationContext);
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const firestore = useFirestore();
  const currentUser = useUser().data;
  if (currentUser === null) throw new Error('User does not exist.');

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const { id } = useParams<any>();
  if (id === undefined) throw new Error('No user defined.');

  const userDocRef = doc(firestore, 'users', id);
  return (
    <div className="text-center">
      <h3>Checkouts</h3>
      <h5>
        {user?.activeCheckouts?.length ?? 0} active checkout
        {(user?.activeCheckouts?.length ?? 0) === 1 ? '' : 's'}
      </h5>
      <br />
      <Formik
        enableReinitialize
        initialValues={{
          activeCheckouts: user?.activeCheckouts ?? [],
          maxCheckouts: user?.maxCheckouts ?? 0,
          maxRenews: user?.maxRenews ?? 0,
        }}
        validationSchema={checkoutInfoSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          const newData: Partial<User> = {
            activeCheckouts: values.activeCheckouts,
            maxCheckouts: values.maxCheckouts,
            maxRenews: values.maxRenews,
            updatedBy: currentUser.uid,
            updatedAt: serverTimestamp() as any,
          };
          setDoc(userDocRef, newData, { merge: true })
            .then(() => {
              NotificationHandler.addNotification({
                message: `Checkout info updated.`,
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

          actions.setSubmitting(false);
        }}
      >
        {({ values, errors, isSubmitting, handleChange, submitCount }) => (
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
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  value={values.maxCheckouts}
                  onChange={handleChange}
                  id="maxCheckouts"
                  label="Max Checkouts"
                  type="number"
                  fullWidth
                  disabled={
                    currentUser.uid === id &&
                    libraryDoc.ownerUserID !== user.uid
                  }
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
                  disabled={
                    currentUser.uid === id &&
                    libraryDoc.ownerUserID !== user.uid
                  }
                  error={!!errors.maxRenews && submitCount > 0}
                  helperText={submitCount > 0 ? errors.maxRenews : ''}
                />
              </Grid>
            </Grid>
            <br />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disabled={
                isSubmitting ||
                (currentUser.uid === id && libraryDoc.ownerUserID !== user.uid)
              }
            >
              {isSubmitting && <CircularProgress size={24} />}
              {!isSubmitting && <>Update Checkout Info</>}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserCheckouts;
