import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import intentService from '../../services/intent.service.js';
import ModalTemplate from '../common/ModalTemplate';
import Navbar from '../common/Navbar';
import TextField from '../common/TextField';
import IntentCard from '../intent/intentCard';
import $ from 'jquery';
import ChatBox from '../chatbox/Chatbox';

const IntentCreationSchema = Yup.object().shape({
    intentName: Yup.string()
        .required('Please enter the name of your Assistant'),
    description: Yup.string()
        .required('Please add a description'),
});

const Intents = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [selectedIntent, setSelectedIntent] = useState(undefined);
    const [previousIntent, setPreviousIntent] = useState(null);
    const [chatbotId, setChatbotId] = useState("");
    const [intents, setIntents] = useState([]);
    const [status, setStatus] = useState(undefined);
    const [message, setMessage] = useState("");

    useEffect(async () => {
        let chatbotId = sessionStorage.getItem('chatbot');
        setChatbotId(chatbotId);
        try {
            const response = await intentService.get(chatbotId, accessToken, setAccessToken);
            setIntents(response.data);
        } catch (err) {
            console.log(err);
        }

        // To Prevent button from redirecting
        $(document).on('click', ".button-group", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    }, []);


    const clearState = () => {
        setStatus(undefined);
        setMessage("");
    }

    const onCreate = async (values) => {
        try {
            let response = await intentService.create(values, previousIntent, chatbotId, accessToken, setAccessToken);
            let newIntent = response.data;
            setIntents([...intents, newIntent]);
            clearState();
            $('#createIntent').modal('hide')
        } catch (err) {
            console.log(err);
            setStatus("danger");
            if (err.response.status === 409)
                setMessage("Intent with same name already exists!")
            else
                setMessage("Intent creation failure!");
        }
    }

    const onUpdate = async (values) => {
        try {
            let response = await intentService.update(values, previousIntent, selectedIntent.intentId, accessToken, setAccessToken);
            if (response.status === 204) {
                clearState();
                let intentToBeUpdated = intents.filter(item => item.intentId === selectedIntent.intentId)[0];
                intentToBeUpdated.intentName = values.intentName;
                intentToBeUpdated.description = values.description;
                setIntents([intentToBeUpdated, ...[...intents].filter(item => item.intentId !== selectedIntent.intentId)]);
            }
            $('#updateIntent').modal('hide')
        } catch (err) {
            setStatus("danger");
            if (err.response.status === 409)
                setMessage("Intent with same name already exists!")
            else
                setMessage("Intent creation failure!");
        }
    }

    const onDelete = async (intent) => {
        try {
            console.log("Deleting");
            await intentService.delete(intent.intentId, accessToken, setAccessToken);
            setIntents([...intents].filter(item => item.intentId !== intent.intentId));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated} >
                <li className="nav-item">
                    <a id="creat" type="button" className=" navlinks" data-toggle="modal" data-target="#databaseModal">
                        Connect DB
                    </a>
                </li>
            </Navbar>

            <div className="text-center mt-5 mb-5">
                <button id="createI" type="button" className="btn btn-primary button1" data-toggle="modal" data-target="#createIntent">
                    Create an intent
                </button>
            </div>
            <div className="container">
                {intents.map((intent, index) => (
                    <IntentCard
                        previousIntent={previousIntent}
                        setPreviousIntent={setPreviousIntent}
                        setSelectedIntent={setSelectedIntent}
                        onDelete={onDelete}
                        key={intent.intentId}
                        intent={intent}
                    />
                ))}
            </div>
            {/* Create Modal */}
            <Formik
                initialValues={{
                    intentName: '',
                    description: '',
                }}
                validationSchema={IntentCreationSchema}
                onSubmit={onCreate}
            >
                {({ errors, touched }) => (

                    <Form>
                        <ModalTemplate
                            id="createIntent"
                            title="Create Assistant"
                            buttonName="Create"
                            status={status}
                            message={message}
                            handleCloseButton={clearState}
                        >
                            <TextField
                                label="Intent's Name"
                                name="intentName"
                                type="text"
                                errorMessage={touched.intentName ? errors.intentName : null}
                            />
                            <TextField
                                as="textarea"
                                rows={3}
                                label="Description"
                                name="description"
                                type="password"
                                errorMessage={touched.description ? errors.description : null}
                            /></ModalTemplate>
                    </Form>
                )}
            </Formik>

            {/* Update Modal */}
            <Formik
                initialValues={{
                    intentName: selectedIntent?.intentName || '',
                    description: selectedIntent?.description || '',
                }}
                enableReinitialize
                validationSchema={IntentCreationSchema}
                onSubmit={onUpdate}
            >

                {({ errors, touched }) => (
                    <Form>
                        <ModalTemplate
                            id="updateIntent"
                            title="Update Intent"
                            buttonName="Update"
                            status={status}
                            message={message}
                            handleCloseButton={clearState}
                        >
                            <TextField
                                label="Intent's Name"
                                name="intentName"
                                type="text"
                                errorMessage={touched.intentName ? errors.intentName : null}
                            />
                            <TextField
                                as="textarea"
                                rows={3}
                                label="Description"
                                name="description"
                                type="password"
                                errorMessage={touched.description ? errors.description : null}
                            /></ModalTemplate>
                    </Form>
                )}
            </Formik>
            <ChatBox />
        </React.Fragment>
    );
}

export default Intents;