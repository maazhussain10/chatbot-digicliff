import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import profileService from '../../services/profile.service.js';
import ModalTemplate from '../common/ModalTemplate';
import Navbar from '../common/Navbar';
import TextField from '../common/TextField';
import img1 from "../../assets/images/web.png";
import img2 from "../../assets/images/web2.png";

const userDeactivationSchema = Yup.object().shape({
    deleteText: Yup.string()
        .test('check-DELETE', "Enter 'DELETE' to delete this assistant", (value, context) => value === 'DEACTIVATE')
});
const Profile = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [chatbots, setChatbots] = useState([]);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        createdAt: ""
    })

    useEffect(async () => {
        try {
            const userResponse = await profileService.get(accessToken, setAccessToken)
            console.log(userResponse);
            setUser(userResponse.data);
            const chatbotResponse = await chatbotService.get(accessToken, setAccessToken);
            setChatbots(chatbotResponse.data)
        } catch (err) {
            console.log(err);
        }
    }, []);

    const onDeactivate = async (values) => {
        try {
            await profileService.delete(accessToken, setAccessToken);
            $('#deactivateUser').modal('hide')
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated}></Navbar>
            <nav className="navbar navbar-expand-lg navbar-light sticky-to container">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="ml-auto navbar-na text-center nav nav-pills" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active navlinks" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="true">Profile</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link navlinks" id="pills-integs-tab" data-toggle="pill" href="#pills-integs" role="tab" aria-controls="pills-integs" aria-selected="false">Integrations</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link navlinks" id="pills-stats-tab" data-toggle="pill" href="#pills-stats" role="tab" aria-controls="pills-stats" aria-selected="false">Stats</a>
                        </li>
                    </ul>

                </div>
            </nav>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="mt-5 container">
                        <div className="card shadow-lg text-center">
                            <div className="card-body pb-5">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-sm btn-outline-warning">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="card-title mb-2 text-muted"><b>User Information</b></h3>
                                <h5 className="card-title pt-3"><b>Name:   </b> {user.firstName} {user.lastName}</h5>
                                <h6 className="card-subtitle mb-2 "><b>Username:   </b> {user.username}</h6>
                                <p className="card-text"><b>E-Mail:   </b> {user.email}</p>

                                <div className="container">
                                    <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#deactivateUser">
                                        Deactivate Account
                                    </button>
                                    <Formik
                                        initialValues={{
                                            deleteText: '',
                                        }}
                                        validationSchema={userDeactivationSchema}
                                        onSubmit={onDeactivate}>
                                        {({ errors, touched }) => (
                                            <Form >
                                                <ModalTemplate
                                                    id="deactivateUser"
                                                    title="Deactivate Account"
                                                    buttonName="Deactivate"
                                                    handleCloseButton={() => { }}
                                                >
                                                    Are you sure you want to deactivate your account? Deactivating your account will remove all data associated with this account.
                                                    <p>This decision cannot be undone.</p>
                                                    <TextField
                                                        name="deleteText"
                                                        type="text"
                                                        errorMessage={touched.deleteText ? errors.deleteText : null}
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
                <div className="tab-pane fade" id="pills-integs" role="tabpanel" aria-labelledby="pills-integs-tab">
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
                <div className="tab-pane fade" id="pills-stats" role="tabpanel" aria-labelledby="pills-stats-tab">
                    <div className="mt-5 text-center container">
                        <div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "green" }} className="text-right mr-1">
                                                +6%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-up-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "red" }} className="text-right mr-1">
                                                -7%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-down-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "green" }} className="text-right mr-1">
                                                +6%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-up-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "red" }} className="text-right mr-1">
                                                -7%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-down-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "green" }} className="text-right mr-1">
                                                +6%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-up-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card shadow border border-primary">
                                            <p style={{ color: "red" }} className="text-right mr-1">
                                                -7%
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        class="bi bi-arrow-down-short"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
                                                        />
                                                    </svg>
                                                </span>
                                            </p>
                                            <h1 className="">323</h1>
                                            <p>Some text here</p>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card shadow" style={{ minHeight: "640px" }}>
                                            <h4 className="text-left ml-3 mt-3">Activity</h4>
                                            <hr style={{ width: "100%" }} />
                                            <span className="mb-5"></span>
                                            <table class="table table-striped table-responsive-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">First</th>
                                                        <th scope="col">Last</th>
                                                        <th scope="col">Handle</th>
                                                        <th scope="col">button</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td>Mark</td>
                                                        <td>Otto</td>
                                                        <td>@mdo</td>
                                                        <td>
                                                            <button className="btn" style={{ color: "red" }}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="19"
                                                                    height="19"
                                                                    fill="currentColor"
                                                                    class="bi bi-trash"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">2</th>
                                                        <td>Jacob</td>
                                                        <td>Thornton</td>
                                                        <td>@fat</td>
                                                        <td>
                                                            <button className="btn" style={{ color: "red" }}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="19"
                                                                    height="19"
                                                                    fill="currentColor"
                                                                    class="bi bi-trash"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">3</th>
                                                        <td>Larry</td>
                                                        <td>the Bird</td>
                                                        <td>@twitter</td>
                                                        <td>
                                                            <button className="btn" style={{ color: "red" }}>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="19"
                                                                    height="19"
                                                                    fill="currentColor"
                                                                    class="bi bi-trash"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card shadow" style={{ minHeight: "300px" }}>
                                                    <h5 className="text-left ml-3 mt-3">Pie chart</h5>
                                                    <hr style={{ width: "100%" }} />
                                                    <p>pie chat go brrr!</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card shadow" style={{ minHeight: "300px" }}>
                                                    <h5 className="text-left ml-3 mt-3">Pie chart</h5>
                                                    <hr style={{ width: "100%" }} />
                                                    <p>pie chat go brrr!</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card shadow" style={{ minHeight: "300px" }}>
                                                    <h5 className="text-left ml-3 mt-3">Pie chart</h5>
                                                    <hr style={{ width: "100%" }} />
                                                    <p>pie chat go brrr!</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card shadow" style={{ minHeight: "300px" }}>
                                                    <h5 className="text-left ml-3 mt-3">Pie chart</h5>
                                                    <hr style={{ width: "100%" }} />
                                                    <p>pie chat go brrr!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <br />
                            {/* <div className="container">
                                <div className="row">
                                    <div className="col-6 offset-3">
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label
                                                    class="input-group-text primary"
                                                    for="inputGroupSelect01"
                                                >
                                                    Options
                                                </label>
                                            </div>
                                            <select
                                                class="custom-select"
                                                id="inputGroupSelect01"
                                                ref={selectAssistantRef}
                                                onChange={() => selectedAssistant()}
                                            >
                                                <option selected>Select Assistant</option>
                                                {state.existingAssistant.map((assistant, index) => (
                                                    <option key={index}>{assistant.assistantName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <br />

                            <div>
                                <table class="table table-bordered table-responsive-md">
                                    <thead>
                                        <tr>
                                            <th scope="col">S No.</th>
                                            <th scope="col">IP Address</th>
                                            <th scope="col">Enitity name</th>
                                            <th scope="col">Visitor Details</th>
                                            <th scope="col">Chat Details</th>
                                            <th scope="col">Chat Transcription</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.visitorDetails.map((visitorDetail, index) => (
                                            <tr>
                                                <td scope="row">{index + 1}</td>
                                                <td>{visitorDetail.ipAddress}</td>
                                                <td>{visitorDetail.entityName}</td>
                                                <td>{visitorDetail.entityValue}</td>
                                                <td>12 Mins</td>
                                                <td>Download</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Profile;