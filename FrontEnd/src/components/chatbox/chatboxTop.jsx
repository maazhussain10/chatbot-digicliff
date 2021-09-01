import React from 'react';
import chatboxLogo from '../../assets/images/chatlogo.png'
const ChatBoxTop = (props) => {

    const { description, name, chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor } = props;
    return (
        <div
            className="chatbox-top"
            style={{
                background: chatboxColor,
            }}
        >
            <div
                className="chatbox-profile"
                style={{
                    background: chatboxColor,
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
                    Hi there
                </h3>
                <p className="start-chat" style={{ color: chatboxFontColor, fontFamily: chatboxFont, }}>{description}</p>
            </div>
        </div>
    );
}

export default ChatBoxTop;