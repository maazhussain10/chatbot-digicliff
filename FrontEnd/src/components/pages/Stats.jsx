import React, { useContext, useEffect, useState } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import chatbotService from '../../services/chatbot.service.js';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

const Stats = () => {
  const [existingChatbots, setExistingChatbots] = useState([]);
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [selectedChatbot, setSelectedChatbot] = useState('Select Chatbot');
  const [visitorDetails, setVisitorDetails] = useState(undefined);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [val, setval] = useState(true);

  useEffect(() => {
    getExistingBots();
  }, []);

  const setChatbot = async (e) => {
    setSelectedChatbot(e.target.value);
    for (let i = 0; i < existingChatbots.length; i++) {
      if (existingChatbots[i].chatbotName === selectedChatbot) {
        setVisitorDetails(existingChatbots[i].visitorDetails);
        setIpAddresses(Object.keys(existingChatbots[i].visitorDetails));
      }
    }
  };

  const setStatus = (i) => {
    let temp = existingChatbots;
    temp[i].status = !temp[i].status;
    setExistingChatbots(temp);
    setval(!val);
    console.log(val);
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
      <div className="container">
        <div className="row">
          {existingChatbots.map((chatbot, index) => (
            <div className="col-md-2" onClick={() => setStatus(index)}>
              <div className="card shadow border border-primary">
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
                <p>{chatbot.description}</p>
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
              <LineChart existingChatbots={existingChatbots} val={val} />
              <span className="mb-5"></span>
              <table class="table table-striped table-responsive-sm">
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
                      <td>{Object.keys(chatbot.visitorDetails).length}</td>
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
            {existingChatbots
              .slice(0, existingChatbots.length / 2 + 1)
              .map((chatbot, index) => (
                <div className="row text-center">
                  {existingChatbots[2 * index]&&
                  existingChatbots[2 * index ].status ? (
                    <div className="col-sm-6">
                      <PieChart chatbots={existingChatbots[2 * index]} />
                    </div>
                  ) : null}
                  {existingChatbots[2 * index + 1] &&
                  existingChatbots[2 * index + 1].status ? (
                    <div className="col-sm-6">
                      <PieChart chatbots={existingChatbots[2 * index + 1]} />
                    </div>
                  ) : null}
                </div>
              ))}
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
                  <option value={chatbot.chatbotName} key={index}>
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
          <table class="table table-bordered table-responsive-md">
            <thead>
              <tr>
                <th scope="col">S No.</th>
                <th scope="col">IP Address</th>
                <th scope="col">Enitity Type</th>
                <th scope="col">Enitity Name</th>
                <th scope="col">Visitor Detail</th>
                <th scope="col">Chat Details</th>
                <th scope="col">Chat Transcription</th>
              </tr>
            </thead>
            <tbody>
              {ipAddresses.map((ip, index) =>
                visitorDetails[ip].map((visitorDetail, index3) => (
                  <tr>
                    <td scope="row">{index + 1}</td>
                    <td>{ip}</td>
                    <td>{visitorDetail.entityType}</td>
                    <td>{visitorDetail.entityName}</td>
                    <td>{visitorDetail.entityValue}</td>
                    <td>12 Mins</td>
                    <td>Download</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Stats;
