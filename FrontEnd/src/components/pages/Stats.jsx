import React, { useContext, useEffect, useState } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import entityService from '../../services/entity.service.js';
import './css/stats.css';
import Navbar from '../common/Navbar';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

const Stats = (props) => {
  const [existingChatbots, setExistingChatbots] = useState([]);
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [selectedChatbot, setSelectedChatbot] = useState('Select Chatbot');
  const [selectedChatbotId, setSelectedChatbotId] = useState('');
  const [visitorDetails, setVisitorDetails] = useState([]);
  const [chatDetails, setChatDetails] = useState([]);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [val, setval] = useState(true);

  useEffect(() => {
    getExistingBots();
  }, []);

  useEffect(() => {
    document.getElementById('btnPrint').onclick = function () {
      printElement(document.getElementById('printThis'));
    };
    document.getElementById('btnPrint2').onclick = function () {
      printElement(document.getElementById('printThis2'));
    };
    function printElement(elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById('printSection');
      if (!$printSection) {
        var $printSection = document.createElement('div');
        $printSection.id = 'printSection';
        document.body.appendChild($printSection);
      }
      $printSection.innerHTML = '';
      $printSection.appendChild(domClone);
      window.print();
    }
    function printElement2(elem) {
      var domClone = elem.cloneNode(true);
      var $printSection = document.getElementById('printSection');
      if (!$printSection) {
        var $printSection = document.createElement('div');
        $printSection.id = 'printSection';
        document.body.appendChild($printSection);
      }
      $printSection.innerHTML = '';
      $printSection.appendChild(domClone);
      window.print();
    }
  });

  const viewEntityDetails = async (ipAddress, type) => {
    try {
      let response = await entityService.getEntityDetails(
        ipAddress,
        selectedChatbotId,
        type,
        accessToken,
        setAccessToken
      );
      if (type === 'entity') setVisitorDetails(response.data);
      else if (type === 'chat') setChatDetails(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteVisitor = async (ipAddress) => {
    try {
      let response = await entityService.deleteVisitor(
        ipAddress,
        selectedChatbotId,
        accessToken,
        setAccessToken
      );
    } catch (e) {
      console.log(e);
    }
  }

  const setChatbot = async (e) => {
    let temp = e.target.value.split('|||');
    console.log(temp);
    setSelectedChatbot(temp[1]);
    setSelectedChatbotId(temp[0]);

    for (let i = 0; i < existingChatbots.length; i++) {
      if (existingChatbots[i].chatbotName === e.target.value.split('|||')[1]) {
        setIpAddresses(existingChatbots[i].visitors);
      }
    }
  };

  const setStatus = (i) => {
    let temp = existingChatbots;
    temp[i].status = !temp[i].status;
    setExistingChatbots(temp);
    setval(!val);
  };

  const getExistingBots = async () => {
    console.log("BOTS");

    let response = await chatbotService.getExistingBots(
      accessToken,
      setAccessToken
    );

    setExistingChatbots(response.data);
    console.log("BOTS", response.data);
  };
  console.log(selectedChatbot, selectedChatbotId);
  return (
    <div>
      <Navbar isAuthenticated={props.isAuthenticated}></Navbar>
      <div className="container text-center" style={{ fontFamily: 'Tinos' }}>
        <div className="row  d-flex justify-content-center">
          {existingChatbots?.map((chatbot, index) => (
            <div className="col-md-2 pb-3" onClick={() => setStatus(index)}>
              <div
                className="card shadow border border-primary d-flex justify-content-between"
                style={{ minHeight: '200px' }}
              >
                <p
                  style={chatbot.status ? { color: 'green' } : { color: 'red' }}
                  className="text-right mr-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <circle cx="8" cy="8" r="8" />
                  </svg>
                </p>
                <h2 className="">{chatbot.chatbotName}</h2>
                <p>{chatbot.createdAt.slice(0, 10)}</p>
              </div>
            </div>
          ))}
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-lg-6">
            <div className="card shadow" style={{ minHeight: '640px' }}>
              <div className="card-header">
                <h4 className="text-left ml-3 mt-3">Activity</h4>
              </div>
              <br />
              <br />
              <div className="row container">
                <div className="col-12 offset-1">
                  <LineChart chatbots={existingChatbots} />
                </div>
              </div>


              <span className="mb-5"></span>
              <table className="table table-striped table-responsive-md" style={{ maxHeight: "550px" }}>
                <thead>
                  <tr>
                    <th scope="col">SNo</th>
                    <th scope="col">Chatbot Name</th>
                    <th scope="col">Visitors Count</th>
                    <th scope="col">Created On</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>
                  {existingChatbots?.map((chatbot, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{chatbot.chatbotName}</td>
                      <td>{chatbot.visitors.length}</td>
                      <td>{chatbot.createdAt.slice(0, 10)}</td>
                      <td>
                        {chatbot.status ? (
                          <button
                            onClick={() => setStatus(index)}
                            className="btn"
                            style={{ color: 'green' }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(index)}
                            className="btn"
                            style={{ color: 'red' }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-slash-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6 pt-3">
            <div className="row text-center">
              <div className="col-sm-6">
                <PieChart chatbots={existingChatbots} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-sm-6 offset-3">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text primary"
                  htmlFor="inputGroupSelect01"
                >
                  Options
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect01"
                onChange={setChatbot}
              >
                <option selected>Select Chatbot</option>
                {existingChatbots?.map((chatbot, index) => (
                  <option
                    value={chatbot.chatbotId + '|||' + chatbot.chatbotName}
                    id="selected-bot"
                    key={chatbot.chatbotId}
                  >
                    {chatbot.chatbotName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <br />

      {selectedChatbot !== 'Select Chatbot' ? (
        <div>
          <table className="table table-bordered table-responsive-sm container">
            <thead>
              <tr>
                <th scope="col">S No.</th>
                <th scope="col">IP Address</th>
                <th scope="col">Duration</th>
                <th scope="col">Location</th>
                <th scope="col">Enitity Details</th>
                <th scope="col">Chat Transcription</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {ipAddresses.map((ip, index) => (
                <tr>
                  <td scope="row">{index + 1}</td>
                  <td>{ip.ipAddress}</td>
                  <td>
                    {ip.duration.length <= 2
                      ? ip.duration + ' Seconds'
                      : ip.duration + ' Minutes'}
                  </td>
                  <td>{ip.city}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target="#entityModal"
                      onClick={() => viewEntityDetails(ip.ipAddress, 'entity')}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target="#chatModal"
                      onClick={() => viewEntityDetails(ip.ipAddress, 'chat')}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteVisitor(ip.ipAddress)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* VISITOR DETAILS MODAL */}
      <div id="printThis">
        <div
          className="modal fade"
          id="entityModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="entityModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="entityModalLabel">
                  Entity Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">SNo</th>
                      <th scope="col">Ip Address</th>
                      <th scope="col">Entity Type</th>
                      <th scope="col">Entity Name</th>
                      <th scope="col">Entity Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitorDetails.map((visitorDetail, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{visitorDetail.ipAddress}</td>
                        <td>{visitorDetail.entityType}</td>
                        <td>{visitorDetail.entityName}</td>
                        <td>{visitorDetail.entityValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" id="btnPrint" className="btn btn-primary">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* CHAT DETAILS MODAL */}
      <div id="printThis2">
        <div
          className="modal fade"
          id="chatModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="chatModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="chatModalLabel">
                  Chat Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {chatDetails.map((chatDetail, index) => (
                  <div>
                    {chatDetail.messageType === 'user' ?
                      <div style={{ fontFamily: 'Arial', float: "left", clear: "both" }}
                      >
                        {chatDetail.message}
                      </div> :
                      <div style={{ fontFamily: 'Arial', float: "right", clear: "both" }}>
                        {chatDetail.message}
                      </div>
                    }
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" id="btnPrint2" className="btn btn-primary">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Stats;
