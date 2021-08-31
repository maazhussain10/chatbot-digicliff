import React, { Component } from "react";
import "./css/integration.css";
import axios from "axios";
import URL from "../../websiteURL";
import img1 from "../../assets/images/web.png";
import img2 from "../../assets/images/web2.png";
class Integration extends Component {
  state = { existingAssistant: [] };

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

  render() {
    return (
      <>
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
        {/* <div className="outer"> */}
        {/* <div className="box">Connect With Web </div> */}
        {/* <strong> &lt;iframe src="{URL}:8080/assistant/{username}/{assistantName}/chatwidget"&gt; &lt;/iframe&gt;</strong> */}
        {/* <div className="box">Connect With React/Angular</div> */}
        {/* {URL}:8080/assistant/{username}/{assistantName}/chatwidget */}
        {/* </div> */}
        {/* <br/>
                Other Applications
                <br/>
                <div className="outer">
                    <div className="box">Connect With Messenger</div>
                    <div className="box">Connect With Slack</div>
                    <div className="box">Connect With Telegram</div>
                </div> */}
      </>
    );
  }
}

export default Integration;
