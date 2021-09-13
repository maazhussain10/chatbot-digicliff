import React, { useState, useContext } from 'react';
import ModalTemplate from '../common/ModalTemplate';
import { Formik, Form } from 'formik';
import TextField from '../common/TextField';
import { IconPassword } from '../common/Icons';
import authService from '../../services/auth.service.js';
import { AccessTokenContext } from '../../accessTokenContext';
import { Redirect, useLocation } from 'react-router-dom';
import $ from 'jquery';
import './css/login.css';


const Login = (props) => {
    const { setAccessToken } = useContext(AccessTokenContext);
    const [status, setStatus] = useState(undefined);
    const [message, setMessage] = useState("");
    const [redirectToReferrer, setRedirectToReferrer] = useState(false)

    const clearState = () => {
        setStatus(undefined);
        setMessage("");
    }


    const { state } = useLocation()

    const onSubmit = async (values) => {
        try {
            const response = await authService.login(values, setAccessToken);
            if (response.status === 200) {
                clearState();
                $('#login').modal('hide')
                setRedirectToReferrer(true);
            }
        } catch (err) {
            setStatus("danger");
            if (err.response.status === 404)
                setMessage("User not found")
            else if (err.response.status === 401)
                setMessage("Invalid Credentials");
            else
                setMessage("Login failure!");
        }
    }

    if (redirectToReferrer === true) {
        return <Redirect push to={state?.from || '/dashboard'} />
    }
    return (
        <React.Fragment>
            <button className="btn btn-outline-secondary mb-1 mb-xl-0" data-toggle="modal" data-target="#login">Login</button>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                onSubmit={onSubmit}
            >
                <Form>
                    <ModalTemplate
                        id="login"
                        title="Login into your Account"
                        buttonName="Login"
                        status={status}
                        message={message}
                        handleCloseButton={clearState}
                    >
                        <TextField
                            label="Email Address or Username"
                            name="username"
                            placeholder="Username"
                            type="text"
                            subText="We'll never share your information with anyone else."
                            icon='@'
                        />
                        <TextField
                            label="Password"
                            name="password"
                            placeholder="Password"
                            type="password"
                            icon={
                                <IconPassword />
                            }
                        />

                    </ModalTemplate>
                </Form>
            </Formik>
        </React.Fragment >);
}

export default Login;