import React, { useContext, useState } from 'react';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBTypography,
  MDBBadge,
} from 'mdbreact';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { FirebaseContext } from '../../../Firebase';

const SetRoleForm = () => {
  const firebase = useContext(FirebaseContext);
  const SetRoleSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required("Please enter the user's email"),
    role: yup
      .number('Please enter a valid role')
      .min(0, 'The role must be greater than or equal to 0')
      .max(1000, 'The role must be less than or equal to 1000')
      .required("Please enter the user's new role"),
  });
  const [alert, setAlert] = useState({ show: false, user: '', newRole: '' });

  return (
    <MDBContainer>
      {alert.show && (
        <MDBTypography
          note
          noteColor="primary"
          noteTitle="Successfully updated roles: "
        >
          <>
            Set {alert.user}&apos;s role to <MDBBadge>{alert.newRole}</MDBBadge>
          </>
        </MDBTypography>
      )}
      <Formik
        initialValues={{
          email: '',
          role: '',
        }}
        validationSchema={SetRoleSchema}
        onSubmit={(values, actions) => {
          firebase.functions
            .httpsCallable('setRole')({
              email: values.email,
              role: values.role,
            })
            .then((result) => {
              actions.setFieldValue('email', '', true);
              actions.setFieldTouched('email', false, true);
              setAlert({
                show: true,
                user: result.data.displayName
                  ? result.data.displayName
                  : result.data.email,
                newRole: result.data.role,
              });
            })
            .catch((err) => {
              if (err.code === 'unauthenticated') {
                actions.setFieldError('role', 'Permission denied.');
              } else if (err.code === 'permission-denied') {
                actions.setFieldError(
                  'email',
                  'You do not have the permissions required to complete this request.'
                );
              } else if (err.code === 'invalid-argument') {
                actions.setFieldError('email', 'This user could not found.');
              } else if (err.code === 'already-exists') {
                actions.setFieldError(
                  'email',
                  'This user already has this role.'
                );
              } else {
                actions.setFieldError('email', 'An internal error occurred.');
              }
            });
          actions.setSubmitting(false);
        }}
      >
        {({ values, touched, errors, isSubmitting, handleChange }) => (
          <Form noValidate>
            <MDBInput
              id="email"
              type="email"
              className={errors.email && touched.email ? 'is-invalid' : ''}
              label="Email"
              icon="envelope"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && touched.email ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.email}
              </div>
            ) : null}
            <MDBInput
              id="role"
              type="number"
              className={errors.role && touched.role ? 'is-invalid' : ''}
              label="New Role (in numbers)"
              icon="lock"
              value={values.role}
              onChange={handleChange}
            />
            {errors.role && touched.role ? (
              <div
                className="invalid-feedback align-content-center"
                style={{ display: 'inline' }}
              >
                {errors.role}
              </div>
            ) : null}
            <div className="text-center mt-4 black-text">
              <MDBBtn color="orange" type="submit" disabled={isSubmitting}>
                Set Role
              </MDBBtn>
            </div>
          </Form>
        )}
      </Formik>
    </MDBContainer>
  );
};

export default SetRoleForm;
