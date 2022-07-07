import React, { useContext } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { useFirestore, useUser } from 'reactfire';
import { useParams } from 'react-router-dom';
import { TextField, Grid, Button, CircularProgress } from '@mui/material';

import user, { checkoutInfo } from '@common/types/User';
import RecursivePartial from '@common/types/util/RecursivePartial';

import NotificationContext from 'src/contexts/NotificationContext';
import { doc, setDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/database';

const checkoutInfoSchema = yup.object().shape({
  activeCheckouts: yup.array().of(yup.string()),
  maxCheckouts: yup.number().min(0),
  maxRenews: yup.number().min(0),
});

const UserCheckouts = ({ checkouts }: { checkouts: checkoutInfo }) => {
  const NotificationHandler = useContext(NotificationContext);

  const firestore = useFirestore();
  const currentUser = useUser().data;
  if (currentUser === null) throw new Error('User does not exist.');

  const firebaseContext = useContext(FirebaseContext);

  const { id } = useParams<any>();
  if (id === undefined) throw new Error('No user defined.');

  const userDocRef = doc(firestore, 'users', id);
  return (
    <div className="text-center">
      <h5>{checkouts?.activeCheckouts.length ?? 0} active checkouts</h5>
      <br />
      <Formik
        enableReinitialize
        initialValues={{
          activeCheckouts: checkouts?.activeCheckouts ?? [],
          maxCheckouts: checkouts?.maxCheckouts ?? 0,
          maxRenews: checkouts?.maxRenews ?? 0,
        }}
        validationSchema={checkoutInfoSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          const newData: RecursivePartial<user> = {
            checkoutInfo: {
              activeCheckouts: values.activeCheckouts,
              maxCheckouts: values.maxCheckouts,
              maxRenews: values.maxRenews,
            },
            userInfo: {
              editedBy: currentUser.uid,
              editedTime: serverTimestamp(),
            },
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
                    firebaseContext.claims?.role < 1000
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
                    firebaseContext.claims?.role < 1000
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
                (currentUser.uid === id && firebaseContext.claims?.role < 1000)
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
