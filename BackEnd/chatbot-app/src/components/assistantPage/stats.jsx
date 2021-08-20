import React, { Component, createRef } from "react";
import axios from "axios";
import URL from "../../websiteURL";
import "./css/stats.css";
class Stats extends Component {
  state = {
    existingAssistant: [],
    visitorDetails: [],
  };
  constructor(props) {
    super(props);
    this.selectAssistantRef = createRef();
  }

  componentDidMount() {
    let { username } = JSON.parse(sessionStorage.getItem("userDetails"));
    if (username) this.getAssistant(username);
  }

  getAssistant = (username) => {
    try {
      axios({
        method: "get",
        url: "http://" + URL + ":5000/assistant",
        params: {
          username: username,
        },
      }).then((response) => {
        this.setState({ existingAssistant: response.data });
      });
    } catch (e) {
      console.log(e);
    }
  };

  selectedAssistant = () => {
    let { username } = JSON.parse(sessionStorage.getItem("userDetails"));
    let assistant = this.selectAssistantRef.current.value;
    try {
      axios({
        method: "get",
        url: "http://" + URL + ":5000/visitor-details",
        params: {
          username: username,
          assistant: assistant,
        },
      }).then((response) => {
        this.setState({ visitorDetails: response.data });
        console.log(this.state.visitorDetails);
      });
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    console.log(this.state.existingAssistant);
    return (
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
                  ref={this.selectAssistantRef}
                  onChange={() => this.selectedAssistant()}
                >
                  <option selected>Select Assistant</option>
                  {this.state.existingAssistant.map((assistant, index) => (
                    <option key={index}>{assistant.assistantName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- */}
        {/* <select
          ref={this.selectAssistantRef}
          onChange={() => this.selectedAssistant()}
        >
          <option>Select Assistant</option>
          {this.state.existingAssistant.map((assistant, index) => (
            <option key={index}>{assistant.assistantName}</option>
          ))}
        </select> */}
        <br />

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
              {this.state.visitorDetails.map((visitorDetail, index) => (
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
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* <table>
          <tr>
            <th>S:no</th>
            <th>Ip Address</th>
            <th>Entity Name</th>
            <th>Visitor Details</th>
            <th>Chat Duration</th>
            <th>Chat Transcript</th>
          </tr>
          {this.state.visitorDetails.map((visitorDetail, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{visitorDetail.ipAddress}</td>
              <td>{visitorDetail.entityName}</td>
              <td>{visitorDetail.entityValue}</td>
              <td>12 Mins</td>
              <td>Download</td>
            </tr>
          ))}
        </table> */}
      </div>
    );
  }
}

export default Stats;
