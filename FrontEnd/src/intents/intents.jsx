import React, { Component } from 'react';
import axios from 'axios';
import './css/intent.css';
import { ChatBox } from '../chatbox/chatbox';
import { DisplayIntent } from './displayIntent'
import { CreateIntentModal } from './createIntentModal'
import { UpdateIntentModal } from './updateIntentModal';
import { CreateFollowUpIntentModal } from './createFollowUpIntentModal';

class Intents extends Component {
    state = {
        existingIntents: [],
        updateIntentDetails: {
            intentName: "",
            intentDesc: "",
            intentId: undefined,
        },
        followUpIntentDetails: {
            intentName: "",
            intentDesc: "",
            intentId: undefined,
        }
    }

    //-----------------------------------------------------------------SESSION STORAGE--------------------------------------------------------------
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        // Get the assistantId from session storage.
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        this.getIntents(assistantId);
    }


    //---------------------------------------------------------------GET INTENTS AXIOS---------------------------------------------------------------
    getIntents = (assistantId) => {
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/intent',
                params: {
                    assistantId: assistantId
                },

            }).then((response) => {
                if (this._isMounted) {
                    this.setState({ existingIntents: response.data });
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }




    setUpdateIntentDetails = (intent) => {
        this.setState({
            updateIntentDetails: intent,
            updateIntentName: intent.intentName,
            updateIntentDesc: intent.intentDesc,
        })
    }

    setFollowUpIntentDetails = (intent) => {
        this.setState({ followUpIntentDetails: intent });
    }
    render() {
        let { assistantId, assistantName, description } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let {
            existingIntents,
            updateIntentDetails,
            followUpIntentDetails,
        } = this.state;
        return (
            <React.Fragment>
                <button id="createI" type="button" className="btn btn-primary button1" data-toggle="modal" data-target="#intent">
                    Create an intent
            </button>
                <div className="container">
                    {existingIntents.map(intent => (
                        <DisplayIntent
                            key={intent.intentId}
                            intent={intent}
                            setUpdateIntentDetails={this.setUpdateIntentDetails}
                            setFollowUpIntentDetails={this.setFollowUpIntentDetails}
                            getIntents={this.getIntents}
                        />

                    ))}
                    <div className="row">
                        <div className="col-sm-12" >
                            {/* <DisplayIntent /> */}
                        </div>
                    </div>
                    {/* Modals */}
                    <CreateFollowUpIntentModal
                        followUpIntentDetails={followUpIntentDetails}
                        getIntents={this.getIntents} />
                    <CreateIntentModal
                        getIntents={this.getIntents}
                    />
                    <UpdateIntentModal
                        updateIntentDetails={updateIntentDetails}
                        getIntents={this.getIntents} />
                </div>
                <ChatBox
                    assistantId={assistantId}
                    assistantName={assistantName}
                    description={description} />
            </React.Fragment>
        );
    }
}

export { Intents };