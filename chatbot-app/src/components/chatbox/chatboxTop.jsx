import React, { Component } from "react";
import chatboxLogo from "../../assets/images/chatlogo.png";
import hand from "../../assets/images/hand.png";

class ChatboxTop extends Component {
    state = {
        settings: [],
    };

    render() {
        const {
            description,
            name,
            chatBoxColor,
            chatboxFont,
            chatboxFontColor,
            sendMessageColor,
        } = this.props;
        return (
            <div
                className="chatbox-top"
                style={{
                    background: chatBoxColor,
                }}
            >
                <div
                    className="chatbox-profile"
                    style={{
                        background: chatBoxColor,
                    }}
                >
                    <div className="g-left">
                        <div className="media-left">
                            <div className="g-circle">
                                <img
                                    src={chatboxLogo}
                                    alt="Logo"
                                    className="img-responsive center-block"
                                    id="inner-logo"
                                />
                            </div>
                        </div>
                        <div className="media-right" >
                            <p>
                                <span style={{ color: chatboxFontColor, fontFamily: chatboxFont, }}>{name}</span>
                            </p>
                        </div>
                    </div>
                    <div className="g-right">
                        <p>
                            <span className="minimize close"></span>
                        </p>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="chatbox-offline" >
                    <h3 className="online" style={{
                        color: chatboxFontColor,
                        fontFamily: chatboxFont,
                    }}>
                        Hi there <img src={hand} alt="Hand" draggable="true" />
                    </h3>
                    <p className="start-chat" style={{ color: chatboxFontColor, fontFamily: chatboxFont, }}>{description}</p>
                </div>
            </div>
        );
    }
}

export { ChatboxTop };