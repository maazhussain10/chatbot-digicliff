import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import profileService from '../../services/profile.service.js';
import ModalTemplate from '../common/ModalTemplate';
import Navbar from '../common/Navbar';
import TextField from '../common/TextField';
import img1 from '../../assets/images/web.png';
import img2 from '../../assets/images/web2.png';
import Stats from './Stats';

const userDeactivationSchema = Yup.object().shape({
  deleteText: Yup.string().test(
    'check-DELETE',
    "Enter 'DELETE' to delete this assistant",
    (value, context) => value === 'DEACTIVATE'
  ),
});
const Profile = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [chatbots, setChatbots] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    createdAt: '',
  });

  useEffect(async () => {
    try {
      const userResponse = await profileService.get(
        accessToken,
        setAccessToken
      );
      console.log(userResponse);
      setUser(userResponse.data);
      const chatbotResponse = await chatbotService.get(
        accessToken,
        setAccessToken
      );
      setChatbots(chatbotResponse.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onDeactivate = async (values) => {
    try {
      await profileService.delete(accessToken, setAccessToken);
      $('#deactivateUser').modal('hide');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <Navbar isAuthenticated={props.isAuthenticated}></Navbar>
      <nav className="navbar navbar-expand-lg navbar-light sticky-to container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="ml-auto navbar-na text-center nav nav-pills"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active navlinks"
                id="pills-profile-tab"
                data-toggle="pill"
                href="#pills-profile"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="true"
              >
                Profile
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link navlinks"
                id="pills-integs-tab"
                data-toggle="pill"
                href="#pills-integs"
                role="tab"
                aria-controls="pills-integs"
                aria-selected="false"
              >
                Integrations
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link navlinks"
                id="pills-stats-tab"
                data-toggle="pill"
                href="#pills-stats"
                role="tab"
                aria-controls="pills-stats"
                aria-selected="false"
              >
                Stats
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <div className="mt-5 container">
            <div className="card shadow-lg text-center">
              <div className="card-body pb-5">
                <div className="d-flex justify-content-end">
                  <button className="btn btn-sm btn-outline-warning">
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      className="bi bi-pencil-square"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="card-title mb-2 text-muted">
                  <b>User Information</b>
                </h3>
                <h5 className="card-title pt-3">
                  <b>Name: </b> {user.firstName} {user.lastName}
                </h5>
                <h6 className="card-subtitle mb-2 ">
                  <b>Username: </b> {user.username}
                </h6>
                <p className="card-text">
                  <b>E-Mail: </b> {user.email}
                </p>

                <div className="container">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    data-toggle="modal"
                    data-target="#deactivateUser"
                  >
                    Deactivate Account
                  </button>
                  <Formik
                    initialValues={{
                      deleteText: '',
                    }}
                    validationSchema={userDeactivationSchema}
                    onSubmit={onDeactivate}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <ModalTemplate
                          id="deactivateUser"
                          title="Deactivate Account"
                          buttonName="Deactivate"
                          handleCloseButton={() => {}}
                        >
                          Are you sure you want to deactivate your account?
                          Deactivating your account will remove all data
                          associated with this account.
                          <p>This decision cannot be undone.</p>
                          <TextField
                            name="deleteText"
                            type="text"
                            errorMessage={
                              touched.deleteText ? errors.deleteText : null
                            }
                          />
                        </ModalTemplate>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-integs"
          role="tabpanel"
          aria-labelledby="pills-integs-tab"
        >
          <div className="mt-5 text-center container">
            <h2>Websites</h2>
            <br />
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <div class="card mb-3">
                    <img class="card-img-top" src={img1} alt="Card image cap" />
                    <div class="card-body">
                      <h5 class="card-title">Connect with Web</h5>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div class="card mb-3">
                    <img class="card-img-top" src={img2} alt="Card image cap" />
                    <div class="card-body">
                      <h5 class="card-title">Connect with Angular/React</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-stats"
          role="tabpanel"
          aria-labelledby="pills-stats-tab"
        >
          <div className="mt-5 text-center container">
            <div>
              <Stats />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
