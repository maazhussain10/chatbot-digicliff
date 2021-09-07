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

  const setChatbot = async (e) => {
    let temp = e.target.value.split('|||');
    console.log(temp);
    setSelectedChatbot(temp[1]);
    setSelectedChatbotId(temp[0]);
    console.log(selectedChatbot, selectedChatbotId);
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
    let response = await chatbotService.getExistingBots(
      accessToken,
      setAccessToken
    );
    setExistingChatbots(response.data);
  };
  return (
    <div>
      <Navbar isAuthenticated={props.isAuthenticated}></Navbar>
      <div className="container text-center" style={{ fontFamily: 'Tinos' }}>
        <div className="row row-cols-6 d-flex justify-content-center">
          {existingChatbots.map((chatbot, index) => (
            <div className="col-sm-2 pb-3" onClick={() => setStatus(index)}>
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
                    class="bi bi-circle-fill"
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
          <div className="col-md-6">
            <div className="card shadow" style={{ minHeight: '640px' }}>
              <h4 className="text-left ml-3 mt-3">Activity</h4>
              <hr style={{ width: '100%' }} />
              <LineChart chatbots={existingChatbots} />
              <span className="mb-5"></span>
              <table class="table table-striped table-responsive-md">
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
                  {existingChatbots.map((chatbot, index) => (
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
                              class="bi bi-eye-fill"
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
                              class="bi bi-eye-slash-fill"
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
          <div className="col-md-6">
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
                onChange={setChatbot}
              >
                <option selected>Select Chatbot</option>
                {existingChatbots.map((chatbot, index) => (
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
          <table className="table table-bordered table-responsive-md container">
            <thead>
              <tr>
                <th scope="col">S No.</th>
                <th scope="col">IP Address</th>
                <th scope="col">Duration</th>
                <th scope="col">Location</th>
                <th scope="col">Enitity Details</th>
                <th scope="col">Chat Transcription</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* VISITOR DETAILS MODAL */}
      <div id="printThis">
        <div
          class="modal fade"
          id="entityModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="entityModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="entityModalLabel">
                  Entity Details
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <table class="table">
                  <thead class="thead-dark">
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
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" id="btnPrint" class="btn btn-primary">
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
          class="modal fade"
          id="chatModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="chatModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="chatModalLabel">
                  Entity Details
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {chatDetails.map((chatDetail, index) => (
                  <div>
                    {chatDetail.type === 'user' ?
                      <div style={{ fontFamily: 'Arial'}}
                      >
                        {chatDetail.message}
                      </div> :
                      <div>
                        {chatDetail.message}
                        </div>
                      }
                    </div>
                  ))}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" id="btnPrint2" class="btn btn-primary">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Stats;
