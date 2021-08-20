import React, { Component } from "react";
import axios from "axios";
import URL from '../../websiteURL';
import './css/stats.css';
class Stats extends Component {
    state = {
        existingAssistant: [],
        visitorDetails:[]
    };

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

    selectedAssistant = (assistant) => {
        let { username } = JSON.parse(sessionStorage.getItem("userDetails"));
        try {
            axios({
                method: "get",
                url: "http://" + URL + ":5000/visitor-details",
                params: {
                    username: username,
                    assistant:assistant
                },
            }).then((response) => {
                this.setState({ visitorDetails: response.data });
            });
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        console.log(this.state.existingAssistant);
        return (
            <div>
                <select>
                    <option>Select Assistant</option>
                {this.state.existingAssistant.map((assistant, index) => (
                    <option key={index} onClick={()=>this.selectedAssistant(assistant.assistantName)}>{assistant.assistantName}</option>
                ))}
                </select>
                <table>
                    <tr>
                        <th>
                            S:no
                        </th>
                        <th>
                            Ip Address
                        </th>
                        <th>
                            Entity Name
                        </th>
                        <th>
                            Visitor Details
                        </th>
                        <th>
                            Chat Duration
                        </th>
                        <th>
                            Chat Transcript
                        </th>
                    </tr>
                    {this.state.visitorDetails.map((visitorDetail, index) => (
                        <tr>
                            <td>
                                {index+1}
                            </td>
                            <td>
                                {visitorDetail.ipAddress}
                            </td>
                            <td>
                                {visitorDetail.entityName}
                            </td>
                            <td>
                                {visitorDetail.entityValue}
                            </td>
                            <td>
                                12 Mins
                            </td>
                            <td>
                                Download
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }
}

export default Stats;
