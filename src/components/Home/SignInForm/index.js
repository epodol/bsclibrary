import React from 'react';
import {
    MDBIcon,
    MDBBtn,
    MDBInput,
} from 'mdbreact';
import {Formik, Form} from 'formik';
import * as yup from 'yup';

const SignInForm = (props) => {

    const SignInSchema = yup.object().shape({
        email: yup.string().email('Please enter a valid email').required('Please enter your email'),
        password: yup.string('Please enter a valid password').required('Please enter your password'),
    });

    return (
        <div>
            <h3 className='text-center'>
                <MDBIcon icon='user'/> Sign In
            </h3>
            <hr className='hr-dark'/>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={SignInSchema}
                onSubmit={async (values, actions) => {
                    console.log("SUBMITTING", values)
                        props.firebase.auth.signInWithEmailAndPassword(values.email, values.password)
                        .then((user) => {
                            console.log("Signed in user: ", user)
                        })
                        .catch(err => {
                            console.log('Error signing in:', err)
                            if (err.code === 'auth/wrong-password') {
                                actions.setFieldError("password", "Wrong Password")
                            } else if (err.code === 'auth/user-not-found') {
                                actions.setFieldError("email", "User not Found")
                            } else if (err.code === 'auth/user-disabled') {
                                actions.setFieldError("email", "This user has been disabled")
                            } else if (err.code === 'auth/invalid-email') {
                                actions.setFieldError("email", "Please enter a valid email")
                            }
                        });
                }}
            >
                {({
                      values,
                      touched,
                      errors,
                      isSubmitting,
                      handleChange,
                      submitCount
                  }) => (
                    <Form noValidate>
                        <MDBInput
                            id="email"
                            type="email"
                            className={(errors.email && (touched.email || submitCount > 1)) ? "is-invalid" : ""}
                            label='Email'
                            icon='envelope'
                            autoComplete="email"
                            value={values.email}
                            onChange={handleChange}
                        />
                        {errors.email && touched.email ? <div className="invalid-feedback" style={{display: "inline"}}>{errors.email}</div> : null}
                        <MDBInput
                            id="password"
                            type='password'
                            className={(errors.password && (touched.password || submitCount > 1)) ? "is-invalid" : ""}
                            label='Password'
                            icon='lock'
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                        />
                        {errors.password && touched.password ? <div className="invalid-feedback align-content-center" style={{display: "inline"}}>{errors.password}</div> : null}
                        <p className="d-flex justify-content-end">
                            <b className="btn-link font-small grey-text ml-1 font-weight-bold">
                                Forgot Password?
                            </b>
                        </p>
                        <div className='text-center mt-4 black-text'>
                            <MDBBtn color='orange' type="submit" disabled={isSubmitting}>Sign In</MDBBtn>
                            <div className='text-center d-flex justify-content-end '>
                                <b>Don't have an account?</b>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>


        </div>
    )
};

export default SignInForm;