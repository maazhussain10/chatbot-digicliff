import React, { Component } from 'react';
import { Messageicon } from '../messageIcon';
class ChipOptions extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="chat-reciever">
                    <Messageicon />

                    <div className="media-right">
                        <div className="n-content">
                            <p>Good Afternoon, How may I assist you today?</p>
                        </div>
                        <div className="n-content">
                            <p>I can help you with the following, kindly choose from one to proceed.</p>
                        </div>
                        <div className="m-option">
                            <div className="s-box">About Afterschool</div>
                            <div className="s-box active">Apply for Admission</div>
                            <div className="s-box">Contact Details</div>
                            <div className="s-box">Post Enquiry</div>
                            <div className="s-box">Show All Programs</div>
                        </div>
                        <span className="time">Fri 4:00 PM</span>
                    </div>

                </div>
                <div className="clearfix"></div>
            </div>


        );
    }
}

export { ChipOptions };