import React from 'react';
import { MDBIcon, MDBBtn, MDBInput } from 'mdbreact';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

const ResetPasswordForm = ({ setShowResetPasswordForm }) => {
  const auth = useAuth();

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Please enter your email'),
  });

  return (
    <div>
      <h3 className="text-center">
        <MDBIcon icon="lock" /> Reset Password
      </h3>
      <hr className="hr-dark" />
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={SignInSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
          };
          await auth
            .sendPasswordResetEmail(values.email, actionCodeSettings)
            .then(() => {
              setShowResetPasswordForm(false);
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
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          submitCount,
        }) => (
          <Form noValidate>
            <MDBInput
              id="email"
              type="email"
              className={
                errors.email && (touched.email || submitCount > 1)
                  ? 'is-invalid'
                  : ''
              }
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
            <p
              className="btn-link font-small ml-1 font-weight-bold d-flex justify-content-end"
              aria-hidden="true"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowResetPasswordForm(false);
              }}
            >
              Sign In
            </p>
            <div className="text-center mt-5 mb-4">
              <MDBBtn
                // className="ml-3 px-5"
                color="orange"
                type="submit"
                disabled={isSubmitting}
              >
                {!isSubmitting && <>Send Email</>}
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
    </div>
  );
};

export default ResetPasswordForm;
