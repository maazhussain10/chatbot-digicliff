import React, { useState } from 'react';
import { Formik, Form, } from 'formik';
import ModalTemplate from '../common/ModalTemplate';
import TextField from '../common/TextField';
import { IconEmail, IconFirstName, IconLastName, IconPassword } from '../common/Icons';

import './css/signup.css';
import * as Yup from 'yup';
import authService from '../../services/auth.service.js';


const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Please enter your first name'),
    lastName: Yup.string()
        .required('Please enter your last name'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Please enter an email address'),
    username: Yup.string()
        .min(3, "Username is too short!")
        .max(25, "Username is too long!")
        .required("Please enter an username"),
    password: Yup.string()
        .min(8, "Length of password must be atleast 8")
        .required("Please enter a password"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
});

const Signup = () => {
    const [status, setStatus] = useState(undefined);
    const [message, setMessage] = useState("");

    const clearState = () => {
        setStatus(undefined);
        setMessage("");
    }

    return (
        <React.Fragment>
            <button className="signup-button" data-toggle="modal" data-target="#signup">Sign up</button>
            <Formik
                initialValues={{
                    firstName: 'Pragadeesh',
                    lastName: 'J S',
                    email: 'jspragadeesh@gmail.com',
                    username: 'Dwabzy',
                    password: 'Dwabzy123',
                    confirmPassword: 'Dwabzy123',
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                    try {
                        let response = await authService.signup(values);
                        if (response.status === 201) {
                            setStatus("success");
                            setMessage("Account created Successfully!")
                        }
                    } catch (err) {
                        setStatus("danger");
                        if (err.response.status === 409) {
                            let { errorField } = err.response.data;
                            if (errorField === "users.email")
                                setMessage("Email already exists. Please Login")
                            else if (errorField === "users.username")
                                setMessage("Username is unavailable");
                        } else {
                            setMessage("Account Creation Failure!");
                        }
                    }
                }}
            >
                {({ errors, touched }) => (

                    <Form>
                        <ModalTemplate
                            id="signup"
                            title="Create a new Account"
                            buttonName="Create Account"
                            status={status}
                            message={message}
                            handleCloseButton={clearState}
                        >
                            <div className="row">
                                <div className="col">
                                    <TextField
                                        name="firstName"
                                        placeholder="First Name"
                                        type="text"
                                        icon={
                                            <IconFirstName />
                                        }
                                        errorMessage={touched.firstName ? errors.firstName : null}
                                    />
                                </div>
                                <div className="col">
                                    <TextField
                                        name="lastName"
                                        placeholder="Last Name"
                                        type="text"
                                        icon={
                                            <IconLastName />
                                        }
                                        errorMessage={touched.lastName ? errors.lastName : null}
                                    />
                                </div>
                            </div>
                            <TextField
                                name="email"
                                label="Email address"
                                placeholder="Email address"
                                type="email"
                                icon={
                                    <IconEmail />
                                }
                                errorMessage={touched.email ? errors.email : null} />
                            <TextField
                                name="username"
                                label="Username"
                                placeholder="Username"
                                type="text"
                                icon='@'
                                errorMessage={touched.username ? errors.username : null} />
                            <TextField
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                                icon={
                                    <IconPassword />
                                }
                                errorMessage={touched.password ? errors.password : null} />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                                icon={
                                    <IconPassword />
                                }
                                errorMessage={touched.confirmPassword ? errors.confirmPassword : null} />
                        </ModalTemplate>
                    </Form>
                )}
            </Formik>

        </React.Fragment >
    );
}

export default Signup;