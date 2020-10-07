import React, {Component} from 'react';
import {
    MDBNavbarNav,
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBInput,
    MDBModalFooter,
} from 'mdbreact';
import {auth} from "../../../../fire/FirebaseConfig";


class SignedOutNavbar extends Component {
    state = {
        modal: false
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    submitHandler = event => {
        console.log("submitting form")
        event.preventDefault();
        if (document.getElementById('signInFormEmail').checkValidity() && document.getElementById('signInFormPassword').checkValidity()) {
            auth.signInWithEmailAndPassword(
                document.getElementById('signInFormEmail').value,
                document.getElementById('signInFormPassword').value
            )
                .then(() => {
                    console.log('USER SIGNED IN: ', auth.currentUser)
                }).catch((err) => {
                    console.log(err)
            });

            console.log()
        } else {
            document.getElementById('signInForm').classList += ' was-validated';
        }
        //
    };

    changeHandler = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render() {
        return (
            <MDBNavbarNav right>
                <MDBContainer>
                    <MDBBtn color="pink" onClick={this.toggle}>Sign In</MDBBtn>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                        <MDBModalHeader className="text-center" titleClass="w-100 font-weight-bold"
                                        toggle={this.toggle}>Sign in</MDBModalHeader>
                        <MDBModalBody>
                            <div id="signInForm" className="mx-3 needs-validation">
                                <MDBInput id="signInFormEmail" label="Email" icon="envelope" group type="email" validate
                                          required error="wrong"
                                          success="right"/>
                                <MDBInput id="signInFormPassword" label="Password" icon="lock" group type="password"
                                          validate required/>
                                <p className="font-small grey-text d-flex justify-content-end">
                                    <p className="dark-grey-text ml-1 font-weight-bold">Forgot Password?</p>
                                </p>
                            </div>
                        </MDBModalBody>
                        <MDBModalFooter className="justify-content-center">
                            <MDBBtn onClick={this.submitHandler}>Login</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
            </MDBNavbarNav>
        );
    }
}

export default SignedOutNavbar;