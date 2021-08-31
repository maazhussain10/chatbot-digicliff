import React, { Component } from "react";
import { Cards } from "./richresponses/cards";
import { Chips } from "./richresponses/chips";
import { MessageIcon } from "./messageIcon";
import URL from '../../websiteURL';

import axios from "axios";

function RichResponse(props) {
    const { cardMessage, chipMessage, sendMessage, cardTheme, chipTheme } =
        props;

    if (cardMessage.length >= 1) {
        return <Cards cards={cardMessage} cardTheme={cardTheme} />;
    }

    if (chipMessage.length >= 1) {
        return (
            <div className="m-option">
                {chipMessage.map((chip, index) => (
                    <Chips
                        key={index}
                        chip={chip}
                        sendMessage={sendMessage}
                        chipTheme={chipTheme}
                    />
                ))}
            </div>
        );
    }

    return <span></span>;
}

class Message extends Component {
    state = {
        load: [],
        settings: [],
    };
    componentDidMount = async () => {
        // this.getSettings();

        let { messages } = this.props.messageObject;
        let { load } = this.state;
        for (let i = 0; i < messages.length; i++) {
            load.push(true);
        }
    };

    sleepTime = (index) => {
        let { duration } = this.props;
        if (duration !== 0) {
            duration = 2000;
        }
        setTimeout(() => {
            let { load } = this.state;
            load[index] = false;
            this.setState({ load: load });
            let chatbox = document.querySelector(".chatbox-body");
            chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
        }, duration);
    };

    getSettings = () => {
        // Get the necessary details ( userId, assistantId )
        let { userId } = JSON.parse(sessionStorage.getItem("userDetails"));
        let { assistantId } = JSON.parse(
            sessionStorage.getItem("assistantDetails")
        );
        try {
            axios({
                method: "get",
                url: "http://" + URL + ":5000/settings",
                params: {
                    userId: userId,
                    assistantId: assistantId,
                },
            }).then((response) => {
                this.setState({ settings: response.data });
            });
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const {
            sendMessage,
            messageObject,
            cardTheme,
            chipTheme,
            messagesTheme,
        } = this.props;
        const { from, messages, time, cardMessage, chipMessage } =
            messageObject;
        let {
            userBg,
            userColor,
            userFont,
            assistantBg,
            assistantColor,
            assistantFont,
        } = messagesTheme;

        const { load } = this.state;
        if (from === "user") {
            return (
                <div>
                    <div className="chatbox-sender">
                        <div
                            className="s-content"
                            style={{ backgroundColor: userBg }}
                        >
                            <span
                                className="text"
                                style={{
                                    color: userColor,
                                    fontFamily: userFont,
                                }}
                            >
                                {messages[0]}
                            </span>
                        </div>
                        <span className="time">{time}</span>
                    </div>
                    <div className="clearfix"></div>
                </div>
            );
        } else if (from === "bot") {
            return (
                <div className="chat-reciever">
                    <MessageIcon />
                    <div className="media-left"></div>
                    <div className="media-right">
                        {/* Bot's Text Reply */}
                        {(() => {
                            if (messages.length !== 0) {
                                return (
                                    <React.Fragment>
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className="chat-conversion"
                                            >
                                                {load[index] ? (
                                                    <div className="reciever-load">
                                                        <h1 className="load-dot first">
                                                            <span></span>
                                                        </h1>
                                                        <h1 className="load-dot second">
                                                            <span></span>
                                                        </h1>
                                                        <h1 className="load-dot third">
                                                            <span></span>
                                                        </h1>
                                                        <h1 className="load-dot fourth">
                                                            <span></span>
                                                        </h1>
                                                        {this.sleepTime(index)}
                                                    </div>
                                                ) : (
                                                    <React.Fragment>
                                                        <div
                                                            className="n-content"
                                                            style={{
                                                                backgroundColor:
                                                                    assistantBg,
                                                            }}
                                                        >
                                                            <span
                                                                key={index}
                                                                style={{
                                                                    color: assistantColor,
                                                                    fontFamily:
                                                                        assistantFont,
                                                                }}
                                                                className="text"
                                                            >
                                                                {message}
                                                            </span>
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        ))}
                                        {load[load.length - 1] ? null : (
                                            <RichResponse
                                                cardMessage={cardMessage}
                                                chipMessage={chipMessage}
                                                sendMessage={sendMessage}
                                                cardTheme={cardTheme}
                                                chipTheme={chipTheme}
                                            />
                                        )}
                                        {load[load.length - 1] ? null : (
                                            <span className="time">{time}</span>
                                        )}
                                    </React.Fragment>
                                );
                            }
                        })()}
                    </div>
                </div>
            );
        }
    }
}

export { Message };
