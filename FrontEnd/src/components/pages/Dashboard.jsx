import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Navbar from '../common/Navbar';
import ModalTemplate from '../common/ModalTemplate';
import TextField from '../common/TextField';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import $ from 'jquery';
import noBot from '../../assets/images/nobot.jpg';
import ChatbotCard from '../chatbot/ChatbotCard';


const ChatbotCreationSchema = Yup.object().shape({
    chatbotName: Yup.string()
        .required('Please enter the name of your Assistant'),
    description: Yup.string()
        .required('Please add a description'),
});

const ChatbotDeletion = Yup.object().shape({
    deleteText: Yup.string()
        .test('check-DELETE', "Enter 'DELETE' to delete this assistant", (value, context) => value === 'DELETE')
});

const Dashboard = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [selectedChatbot, setSelectedChatbot] = useState(undefined);
    const [chatbots, setChatbots] = useState([]);
    const [status, setStatus] = useState(undefined);
    const [message, setMessage] = useState("");

    useEffect(async () => {
        try {
            const response = await chatbotService.get(accessToken, setAccessToken);
            setChatbots(response.data)
        } catch (err) {
            console.log(err);
        }
    }, []);

    const clearState = () => {
        setStatus(undefined);
        setMessage("");
    }

    const onCreate = async (values) => {
        try {
            let response = await chatbotService.create(values, accessToken, setAccessToken);
            let newChatbot = response.data;
            setChatbots([...chatbots, newChatbot]);
            clearState();
            $('#createChatbot').modal('hide')
        } catch (err) {
            console.log(err);
            setStatus("danger");
            if (err.response.status === 409)
                setMessage("Assistant with same name already exists!")
            else
                setMessage("Assistant creation failure!");
        }
    }
    const onUpdate = async (values) => {
        try {
            let response = await chatbotService.update(values, selectedChatbot.chatbotId, accessToken, setAccessToken);
            if (response.status === 204) {
                clearState();
                let chatbotToBeUpdated = chatbots.filter(item => item.chatbotId === selectedChatbot.chatbotId)[0];
                chatbotToBeUpdated.chatbotName = values.chatbotName;
                chatbotToBeUpdated.description = values.description;
                setChatbots([chatbotToBeUpdated, ...[...chatbots].filter(item => item.chatbotId !== selectedChatbot.chatbotId)]);
            }
            $('#updateChatbot').modal('hide')
        } catch (err) {
            setStatus("danger");
            if (err.response.status === 409)
                setMessage("Assistant with same name already exists!")
            else
                setMessage("Assistant creation failure!");
        }
    }
    const onDelete = async (values) => {
        try {
            await chatbotService.delete(selectedChatbot.chatbotId, accessToken, setAccessToken);
            $('#confirmDelete').modal('hide')
            setChatbots([...chatbots].filter(item => item.chatbotId !== selectedChatbot.chatbotId));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated}> </Navbar>
            <div className="container text-center mt-5 mb-5">
                <button type="button" className="btn btn-lg btn-primary button" data-toggle="modal" data-target="#createChatbot">
                    Create an Assistant
                </button>
                <Formik
                    initialValues={{
                        chatbotName: '',
                        description: '',
                    }}
                    validationSchema={ChatbotCreationSchema}
                    onSubmit={onCreate}
                >
                    {({ errors, touched }) => (

                        <Form>
                            <ModalTemplate
                                id="createChatbot"
                                title="Create Assistant"
                                buttonName="Create"
                                status={status}
                                message={message}
                                handleCloseButton={clearState}
                            >
                                <TextField
                                    label="Assistant's Name"
                                    name="chatbotName"
                                    type="text"
                                    errorMessage={touched.chatbotName ? errors.chatbotName : null}
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

            {chatbots.length === 0 ?
                <div className="container">
                    <img src={noBot} className="rounded mx-auto d-block no-bot" alt="No bot image" />
                </div>
                :
                <React.Fragment>
                    {
                        chatbots.slice(0, chatbots.length / 2 + 1).map((chatbot, index) => (
                            <div className="container" style={{ fontFamily: 'Tinos' }} key={chatbot.chatbotId || "1"}>
                                <div className="row text-center">
                                    {chatbots[2 * index] ?
                                        <div className="col-sm-6">
                                            <ChatbotCard
                                                chatbots={chatbots}
                                                setChatbots={setChatbots}
                                                setSelectedChatbot={setSelectedChatbot}
                                                chatbot={chatbots[2 * index]}
                                            />
                                        </div>
                                        : null}
                                    {chatbots[2 * index + 1] ?
                                        <div className="col-sm-6">
                                            <ChatbotCard
                                                chatbots={chatbots}
                                                setChatbots={setChatbots}
                                                setSelectedChatbot={setSelectedChatbot}
                                                chatbot={chatbots[2 * index + 1]}
                                            />
                                        </div>
                                        : null}
                                </div>
                            </div >
                        ))
                    }
                    {/* Create Modal */}

                    {/* Update Modal */}
                    <Formik
                        initialValues={{
                            chatbotName: selectedChatbot?.chatbotName || '',
                            description: selectedChatbot?.description || '',
                        }}
                        enableReinitialize
                        validationSchema={ChatbotCreationSchema}
                        onSubmit={onUpdate}
                    >

                        {({ errors, touched }) => (
                            <Form>
                                <ModalTemplate
                                    id="updateChatbot"
                                    title="Update Assistant"
                                    buttonName="Update"
                                    status={status}
                                    message={message}
                                    handleCloseButton={clearState}
                                >
                                    <TextField
                                        label="Assistant's Name"
                                        name="chatbotName"
                                        type="text"
                                        errorMessage={touched.chatbotName ? errors.chatbotName : null}
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
                    {/* Delete Modal */}
                    <Formik
                        initialValues={{
                            deleteText: '',
                        }}
                        validationSchema={ChatbotDeletion}
                        onSubmit={onDelete}>
                        {({ errors, touched }) => (
                            <Form >
                                <ModalTemplate
                                    id="confirmDelete"
                                    title="Are you sure you want to delete this assistant?"
                                    buttonName="Delete"
                                    handleCloseButton={() => { }}
                                >
                                    <p>Type <strong>DELETE</strong> to delete this assitant</p>
                                    <TextField
                                        name="deleteText"
                                        type="text"
                                        errorMessage={touched.deleteText ? errors.deleteText : null}
                                    />
                                </ModalTemplate>
                            </Form>
                        )}
                    </Formik>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default Dashboard;