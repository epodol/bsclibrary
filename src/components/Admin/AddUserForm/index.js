import React, { useState } from 'react';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBTypography,
  MDBBadge,
} from 'mdbreact';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useFunctions } from 'reactfire';

const AddUserForm = () => {
  const functions = useFunctions();
  const SetRoleSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required("Please enter the user's email"),
    first_name: yup.string().required("Please enter the user's first name"),
    last_name: yup.string().required("Please enter the user's last name"),
    role: yup
      .number('Please enter a valid role')
      .min(0, 'The role must be greater than or equal to 0')
      .max(1000, 'The role must be less than or equal to 1000')
      .required("Please enter the user's new role"),
  });
  const [alert, setAlert] = useState({ show: false, user: '', email: '' });

  return (
    <MDBContainer>
      <h2 className="flex-center">Add New User</h2>

      {alert.show && (
        <MDBTypography
          note
          noteColor="primary"
          noteTitle="Successfully added a new user: "
        >
          <>
            {alert.user}: <MDBBadge>{alert.email}</MDBBadge>
          </>
        </MDBTypography>
      )}
      <Formik
        initialValues={{
          email: '',
          first_name: '',
          last_name: '',
          role: '',
        }}
        validationSchema={SetRoleSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          functions
            .httpsCallable('addNewUser')({
              email: values.email,
              first_name: values.first_name,
              last_name: values.last_name,
              role: values.role,
            })
            .then((result) => {
              actions.setFieldValue('email', '', true);
              actions.setFieldTouched('email', false, true);
              actions.setFieldValue('first_name', '', true);
              actions.setFieldTouched('first_name', false, true);
              actions.setFieldValue('last_name', '', true);
              actions.setFieldTouched('last_name', false, true);
              setAlert({
                show: true,
                user: result.data.displayName
                  ? result.data.displayName
                  : result.data.email,
                email: result.data.email,
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
                actions.setFieldError('email', 'This user already exists.');
              } else {
                actions.setFieldError('email', 'An internal error occurred.');
              }
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
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
              id="first_name"
              type="text"
              className={
                errors.first_name && touched.first_name ? 'is-invalid' : ''
              }
              label="First Name"
              icon="user"
              autoComplete="given-name"
              value={values.first_name}
              onChange={handleChange}
            />
            {errors.first_name && touched.first_name ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.first_name}
              </div>
            ) : null}
            <MDBInput
              id="last_name"
              type="text"
              className={
                errors.last_name && touched.last_name ? 'is-invalid' : ''
              }
              label="Last Name"
              icon="user"
              autoComplete="family-name"
              value={values.last_name}
              onChange={handleChange}
            />
            {errors.last_name && touched.last_name ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.last_name}
              </div>
            ) : null}
            <MDBInput
              id="role"
              type="number"
              className={errors.role && touched.role ? 'is-invalid' : ''}
              label="Role (in numbers)"
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
                {!isSubmitting && <>Add User</>}
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </MDBBtn>
            </div>
          </Form>
        )}
      </Formik>
    </MDBContainer>
  );
};

export default AddUserForm;
