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
import emptyImg from '../../assets/images/Empty.png';

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
            let chatbotId = sessionStorage.getItem('chatbot');
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

    const getIntents = async () => {
        try {
            let chatbotId = sessionStorage.getItem('chatbot');
            const response = await intentService.get(chatbotId, accessToken, setAccessToken);
            setIntents(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const clearState = () => {
        setStatus(undefined);
        setMessage("");
        setPreviousIntent(undefined);
    }

    const onCreate = async (values) => {
        try {
            let response = await intentService.create(values, previousIntent, chatbotId, accessToken, setAccessToken);
            setIntents(prevIntents => [...prevIntents, response.data])
            getIntents();
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
            setIntents(prevIntents => prevIntents.filter(item => item.intentId !== intent.intentId));
            getIntents();
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated} >
            </Navbar>
            <div className="text-center mt-5 ">
                <button id="createI" type="button" className="btn btn-primary button1" data-toggle="modal" data-target="#createIntent">
                    Create an intent
                </button>
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
                                title="Create Intent"
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
            </div>
            {intents?.length === 0 ?
                <div className="container">
                    <div className="row">
                        <div className="col-6 offset-3">
                            <img src={emptyImg} className="rounded img-fluid mx-auto d-block" alt="No intent image" />
                        </div>
                    </div>


                </div>
                :
                <React.Fragment>
                    <div className="container">
                        {intents?.map((intent, index) => (
                            <IntentCard
                                key={Math.random()}
                                previousIntent={previousIntent}
                                setPreviousIntent={setPreviousIntent}
                                setSelectedIntent={setSelectedIntent}
                                onDelete={onDelete}
                                intent={intent}
                            />
                        ))}
                    </div>


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
                </React.Fragment>
            }

            <ChatBox />
        </React.Fragment>
    );
}

export default Intents;