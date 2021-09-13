import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as Yup from 'yup';
import Navbar from '../common/Navbar';
import ModalTemplate from '../common/ModalTemplate';
import TextField from '../common/TextField';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import $ from 'jquery';
import noBot from '../../assets/images/nobot.jpg';
import integrationImg from '../../assets/images/web2.png';
import ChatbotCard from '../chatbot/ChatbotCard';

const ChatbotCreationSchema = Yup.object().shape({
  chatbotName: Yup.string().required('Please enter the name of your Assistant'),
  description: Yup.string().required('Please add a description'),
});

const ChatbotDeletion = Yup.object().shape({
  deleteText: Yup.string().test(
    'check-DELETE',
    "Enter 'DELETE' to delete this assistant",
    (value, context) => value === 'DELETE'
  ),
});

const Dashboard = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [selectedChatbot, setSelectedChatbot] = useState(undefined);
  const [chatbots, setChatbots] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [message, setMessage] = useState('');

  const [hostName, setHostName] = useState('');


  useEffect(async () => {
    try {
      const response = await chatbotService.get(accessToken, setAccessToken);
      setChatbots(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const clearState = () => {
    setStatus(undefined);
    setMessage('');
  };

  const onCreate = async (values) => {
    try {
      let response = await chatbotService.create(
        values,
        accessToken,
        setAccessToken
      );
      let newChatbot = response.data;
      setChatbots([...chatbots, newChatbot]);
      clearState();
      $('#createChatbot').modal('hide');
    } catch (err) {
      console.log(err);
      setStatus('danger');
      if (err.response.status === 409)
        setMessage('Assistant with same name already exists!');
      else setMessage('Assistant creation failure!');
    }
  };
  const onUpdate = async (values) => {
    try {
      let response = await chatbotService.update(
        values,
        selectedChatbot.chatbotId,
        accessToken,
        setAccessToken
      );
      if (response.status === 204) {
        clearState();
        let chatbotToBeUpdated = chatbots.filter(
          (item) => item.chatbotId === selectedChatbot.chatbotId
        )[0];
        chatbotToBeUpdated.chatbotName = values.chatbotName;
        chatbotToBeUpdated.description = values.description;
        setChatbots([
          chatbotToBeUpdated,
          ...[...chatbots].filter(
            (item) => item.chatbotId !== selectedChatbot.chatbotId
          ),
        ]);
      }
      $('#updateChatbot').modal('hide');
    } catch (err) {
      setStatus('danger');
      if (err.response.status === 409)
        setMessage('Assistant with same name already exists!');
      else setMessage('Assistant creation failure!');
    }
  };
  const onDelete = async (values) => {
    try {
      await chatbotService.delete(
        selectedChatbot.chatbotId,
        accessToken,
        setAccessToken
      );
      $('#confirmDelete').modal('hide');
      setChatbots(
        [...chatbots].filter(
          (item) => item.chatbotId !== selectedChatbot.chatbotId
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateHostName = async (e) => {
    e.preventDefault();
    try {
      console.log(hostName);
      await chatbotService.setHostName(
        hostName,
        selectedChatbot.chatbotId,
        accessToken,
        setAccessToken
      );
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <React.Fragment>
      <Navbar isAuthenticated={props.isAuthenticated}> </Navbar>
      <div className="container text-center mt-5 mb-5">
        <button
          type="button"
          className="btn btn-lg btn-primary button"
          data-toggle="modal"
          data-target="#createChatbot"
        >
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
                />
              </ModalTemplate>
            </Form>
          )}
        </Formik>
      </div>
      {chatbots.length === 0 ? (
        <div className="container">
          <img
            src={noBot}
            className="rounded mx-auto d-block no-bot"
            alt="No bot image"
          />
        </div>
      ) : (
        <React.Fragment>
          {chatbots.slice(0, chatbots.length / 2 + 1).map((_, index) => (
            <div
              className="container"
              style={{ fontFamily: 'Tinos' }}
              key={Math.random()}
            >
              <div className="row text-center pb-3">
                {chatbots[2 * index] ? (
                  <div className="col-sm-6">
                    <ChatbotCard
                      chatbots={chatbots}
                      setChatbots={setChatbots}
                      setSelectedChatbot={setSelectedChatbot}
                      chatbot={chatbots[2 * index]}
                      setHostName={setHostName}
                    />
                  </div>
                ) : null}
                {chatbots[2 * index + 1] ? (
                  <div className="col-sm-6">
                    <ChatbotCard
                      chatbots={chatbots}
                      setChatbots={setChatbots}
                      setSelectedChatbot={setSelectedChatbot}
                      chatbot={chatbots[2 * index + 1]}
                      setHostName={setHostName}

                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
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
                    errorMessage={
                      touched.chatbotName ? errors.chatbotName : null
                    }
                  />
                  <TextField
                    as="textarea"
                    rows={3}
                    label="Description"
                    name="description"
                    type="password"
                    errorMessage={
                      touched.description ? errors.description : null
                    }
                  />
                </ModalTemplate>
              </Form>
            )}
          </Formik>
          {/* Delete Modal */}
          <Formik
            initialValues={{
              deleteText: '',
            }}
            validationSchema={ChatbotDeletion}
            onSubmit={onDelete}
          >
            {({ errors, touched }) => (
              <Form>
                <ModalTemplate
                  id="confirmDelete"
                  title="Are you sure you want to delete this assistant?"
                  buttonName="Delete"
                  handleCloseButton={() => { }}
                >
                  <p>
                    Type <strong>DELETE</strong> to delete this assitant
                  </p>
                  <TextField
                    name="deleteText"
                    type="text"
                    errorMessage={touched.deleteText ? errors.deleteText : null}
                  />
                </ModalTemplate>
              </Form>
            )}
          </Formik>
          {/* Integration Modal */}
          <form onSubmit={updateHostName}>
            <div className="modal fade" id="embedscript" tabIndex="-1" data-backdrop="static" data-keyboard="false" aria-labelledby="embedModal" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="embedscript">Embed <b>{selectedChatbot?.chatbotName}</b></h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="container">
                      <img className="img-fluid rounded mx-auto d-block" src={integrationImg} alt="" />

                      <div className="form-group">
                        <label htmlFor="hostname">Host Name</label>
                        <input type="text" onChange={(e) => setHostName(e.target.value)} value={hostName} placeholder="https://www.companion.com" className="form-control" id="hostname" />
                        <small id="hostHelp" className="form-text text-muted">Enter your website address in order to integrate it.</small>
                      </div>

                      <div className="input-group mb-3">
                        <input type="text" className="form-control" readOnly
                          placeholder={`<script id="get-chatbot-script" data-chatbot-id="${selectedChatbot?.chatbotId}">
                        let scripts = document.getElementsByTagName("script");
                        let currentScript = scripts[scripts.length - 1];
                        let chatbotId = currentScript.dataset.chatbotId;

                        let chatbotScript = document.createElement("script");
                        chatbotScript.src = "http://49.206.201.140:3000/api/chat-window/script";
                        chatbotScript.defer = true;
                        chatbotScript.id="chatbot-script"
                        chatbotScript.chatbotId = chatbotId;

                        currentScript.parentNode.insertBefore(chatbotScript, currentScript);
                      </script>
                      `}
                        />
                        <div className="input-group-append">

                          <CopyToClipboard text={`<script id="get-chatbot-script" data-chatbot-id="${selectedChatbot?.chatbotId}">
                        let scripts = document.getElementsByTagName("script");
                        let currentScript = scripts[scripts.length - 1];
                        let chatbotId = currentScript.dataset.chatbotId;

                        let chatbotScript = document.createElement("script");
                        chatbotScript.src = "${API_URL}/chat-window/script";
                        chatbotScript.defer = true;
                        chatbotScript.id="chatbot-script"
                        chatbotScript.chatbotId = chatbotId;

                        currentScript.parentNode.insertBefore(chatbotScript, currentScript);
                      </script>
                      `}
                            onCopy={() => { }}>
                            <button className="btn btn-outline-success" type="button" data-toggle="tooltip" data-placement="right" title="Copy the script">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                              </svg>
                            </button>
                          </CopyToClipboard>

                        </div>
                      </div>

                    </div>


                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </React.Fragment>


      )}
    </React.Fragment>
  );
};

export default Dashboard;
