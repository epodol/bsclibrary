import React, { useState, Fragment } from 'react';
import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBTypography,
  MDBBadge,
} from 'mdbreact';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useAuth, useFunctions } from 'reactfire';
import { useHistory } from 'react-router';

const AddUserForm = () => {
  const functions = useFunctions();
  const auth = useAuth();

  const history = useHistory();

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
    VIEW_BOOKS: yup.boolean(),
    REVIEW_BOOKS: yup.boolean(),
    CHECK_IN: yup.boolean(),
    CHECK_OUT: yup.boolean(),
    MANAGE_BOOKS: yup.boolean(),
    MANAGE_CHECKOUTS: yup.boolean(),
    MANAGE_USERS: yup.boolean(),
  });
  const [alert, setAlert] = useState({
    show: false,
    user: '',
    email: '',
    uid: '',
  });

  return (
    <MDBContainer>
      <h2 className="flex-center">Add New User</h2>

      {alert.show && (
        <div
          onClick={() =>
            history.push({
              pathname: `/users/${alert.uid}`,
            })
          }
          style={{ cursor: 'pointer' }}
          aria-hidden="true"
        >
          <MDBTypography
            note
            noteColor="primary"
            noteTitle="Successfully added a new user: "
          >
            <>
              {alert.user}: <MDBBadge>{alert.email}</MDBBadge>
            </>
          </MDBTypography>
        </div>
      )}
      <Formik
        initialValues={{
          email: '',
          first_name: '',
          last_name: '',
          role: 100,
          VIEW_BOOKS: true,
          REVIEW_BOOKS: true,
          CHECK_IN: false,
          CHECK_OUT: false,
          MANAGE_BOOKS: false,
          MANAGE_CHECKOUTS: false,
          MANAGE_USERS: false,
        }}
        validationSchema={SetRoleSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await functions
            .httpsCallable('addNewUser')({
              email: values.email,
              first_name: values.first_name,
              last_name: values.last_name,
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
            })
            .then((newUser) => {
              const actionCodeSettings = {
                url: window.location.host,
                handleCodeInApp: true,
              };
              auth.sendPasswordResetEmail(values.email, actionCodeSettings);
              actions.setFieldValue('email', '', true);
              actions.setFieldTouched('email', false, true);
              actions.setFieldValue('first_name', '', true);
              actions.setFieldTouched('first_name', false, true);
              actions.setFieldValue('last_name', '', true);
              actions.setFieldTouched('last_name', false, true);
              setAlert({
                show: true,
                user:
                  `${values.first_name} ${values.last_name}` || values.email,
                email: values.email,
                uid: newUser.data.uid,
              });
            })
            .catch((err) => {
              console.log(err);
              if (err.code === 'unauthenticated') {
                actions.setFieldError('role', 'Permission denied.');
              } else if (err.code === 'permission-denied') {
                actions.setFieldError(
                  'email',
                  'You do not have the permissions required to complete this request.'
                );
              } else if (err.code === 'invalid-argument') {
                actions.setFieldError('email', 'Invalid arguments');
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
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          setFieldValue,
        }) => (
          <Form noValidate>
            <h4>Basic Info</h4>
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
            <h4>Permissions</h4>
            <div>
              Default Permissions:
              <ButtonGroup
                variant="text"
                color="primary"
                aria-label="text primary button group"
                size="small"
                className="text-center mx-auto align-center center"
              >
                <Button
                  onClick={() => {
                    console.log(typeof ['values.permissions']);
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
                  />
                }
                label="Manage Users"
                labelPlacement="end"
              />
            </div>
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
