import React, { Component } from 'react';
import axios from 'axios';
import { ChatboxTop } from '../chatbox/chatboxTop';
import { Message } from '../chatbox/message';
import $ from 'jquery';

class Settings extends Component {
    state = {
        settings: {
            cardTheme: {
                cardBgColor: "",
                cardTextColor: "",
                cardBorder: "",
                cardFont: "",
            },
            chipTheme: {
                chipBgColor: "",
                chipTextColor: "",
                chipBorder: "",
                chipShape: "",
                chipFont: "",
            },
            chatBoxTheme: {
                userBg: "",
                userFont: "",
                userColor: "",
                assistantBg: "",
                assistantFont: "",
                assistantColor: "",
                chatBoxColor: "",
            }
        },
        selectedPane: "message",
        saveChangesStatus: true,
    }

    componentDidMount = () => {
        this.getTheme();

        $(".chats-box").show(0);
        let { saveChangesStatus } = this.state;

        window.onbeforeunload = function () {
            if (!saveChangesStatus)
                return 'Are you sure you want to leave?';
        };
    }

    getTheme = () => {

        // Get the necessary details ( username, assistantName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));

        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/settings',
                params: {
                    username: username,
                    assistantName: assistantName
                },

            }).then((response) => {
                const { chatBoxSettings } = response.data;
                this.setState({ settings: chatBoxSettings });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    saveChanges = () => {
        // Get the necessary details (assistantName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { settings } = this.state;
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/settings',
                params: {
                    username:username,
                    settings: settings,
                    assistantName: assistantName
                },

            }).then((response) => {
                this.setState({ saveChangesStatus: response.data });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    handleSelect = (selectedPane) => {
        this.setState({ selectedPane: selectedPane });
    }
    // -----------------------------------------------------------------------------HANDLER FUNCTIONS -------------------------------------------------------------------------------

    // Handle Chatbox Color
    chatboxColorChange = (e) => {
        let { settings } = this.state;
        settings.chatBoxTheme.chatBoxColor = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle background color of user's text message.
    userBgChange = (e) => {
        let { settings } = this.state;
        settings.chatBoxTheme.userBg = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle text color of user's text message.
    userColorChange = (e) => {
        let { settings } = this.state;
        settings.chatBoxTheme.userColor = e.target.value
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle text font style of user's text message.
    userFontSelect = (font) => {
        let { settings } = this.state;
        settings.chatBoxTheme.userFont = font;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }


    // Handle background color of assistant's text message.
    assistantBgChange = (e) => {
        let { settings } = this.state;
        settings.chatBoxTheme.assistantBg = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle text color of assistant's text message.
    assistantColorChange = (e) => {
        let { settings } = this.state;
        settings.chatBoxTheme.assistantColor = e.target.value
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle text font style of assistant's text message.
    assistantFontSelect = (font) => {
        let { settings } = this.state;
        settings.chatBoxTheme.assistantFont = font;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    // Handle Background color of card
    cardBgColorChange = (e) => {
        let { settings } = this.state;
        settings.cardTheme.cardBgColor = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    // Handle Text color of card
    cardTextColorChange = (e) => {
        let { settings } = this.state;
        settings.cardTheme.cardTextColor = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    // Handle Border color of card
    cardBorderChange = (e) => {
        let { settings } = this.state;
        settings.cardTheme.cardBorder = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    // Handle text font style of card
    cardFontSelect = (font) => {
        let { settings } = this.state;
        settings.cardTheme.cardFont = font;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    // Handle Background color of chip
    chipBgColorChange = (e) => {
        let { settings } = this.state;
        settings.chipTheme.chipBgColor = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    chipTextColorChange = (e) => {
        let { settings } = this.state;
        settings.chipTheme.chipTextColor = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    chipBorderChange = (e) => {
        let { settings } = this.state;
        settings.chipTheme.chipBorder = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    chipFontSelect = (font) => {
        let { settings } = this.state;
        settings.chipTheme.chipFont = font;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }
    chipShapeChange = (e) => {
        let { settings } = this.state;
        settings.chipTheme.chipShape = e.target.value;
        this.setState({ settings: settings })
        this.setState({ saveChangesStatus: false });
    }

    render() {
        let { settings, selectedPane } = this.state;
        let { chipTheme, chatBoxTheme, cardTheme } = settings;

        let { userBg, userColor, userFont, assistantBg, assistantColor, assistantFont, chatBoxColor } = chatBoxTheme;
        let { cardBgColor, cardTextColor, cardBorder, cardFont, } = cardTheme;
        let { chipBgColor, chipTextColor, chipBorder, chipShape, chipFont } = chipTheme;

        // Sample Messages to be displayed
        let sampleUserMessage = {
            from: 'user',
            type: 'text',
            messages: ["Sample User Message"],
            time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
        }

        let sampleBotMessage = {
            from: 'bot',
            type: 'text',
            messages: ["Sample Bot Reply", "Another sample bot reply1"],
            hasRichResponse: true,
            cardMessage: "",
            chipMessage: "",
            time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
        }
        let sampleCardMessage = {
            from: 'bot',
            type: 'text',
            messages: ["Sample Card Reply"],
            hasRichResponse: true,
            cardMessage: [
                { cardValue: ["Sample Header", "Sample SubHeader","Sample Paragraph"] }],
            chipMessage: "",
            time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
        }

        let sampleChipMessage = {
            from: 'bot',
            type: 'text',
            messages: ["Sample Chip Reply"],
            hasRichResponse: true,
            cardMessage: "",
            chipMessage: [{ chipValue: "Chip 1", clickable: "false" }, { chipValue: "Chip 2", clickable: "false" }],
            time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
        }

        let fonts = ["Verdana", "Cursive", "Times New Roman", "Arial", "Comic Sans Serif", "Monospace", "Tahoma", "Fantasy"];

        return (
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-chatBoxSettings" role="tabpanel" aria-labelledby="pills-chatBoxSettings-tab">
                    <div style={{ marginLeft: "7.5%", marginRight: "7.5%" }}>
                        <div className="card shadow-lg ">
                            <div className="card-body pb-5" style={{ height: "85vh" }}>
                                <h1 style={{ fontFamily: "cursive", paddingLeft: "37px", paddingBottom: "20px" }}> Settings</h1>
                                <div className="row">
                                    <div className="col-3">
                                        <div className="text-center">
                                            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                <a onClick={() => this.handleSelect("message")} className="nav-link active" id="v-pills-chatBoxSettings-tab" data-toggle="pill" href="#v-pills-chatBoxSettings" role="tab" aria-controls="v-pills-chatBoxSettings" aria-selected="false">Chatbox</a>
                                                <a onClick={() => this.handleSelect("card")} className="nav-link" id="v-pills-cardSettings-tab" data-toggle="pill" href="#v-pills-cardSettings" role="tab" aria-controls="v-pills-cardSettings" aria-selected="false">Card</a>
                                                <a onClick={() => this.handleSelect("chip")} className="nav-link" id="v-pills-chipSettings-tab" data-toggle="pill" href="#v-pills-chipSettings" role="tab" aria-controls="v-pills-chipSettings" aria-selected="false">Chip</a>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="tab-content" id="v-pills-tabContent">

                                            <div className="tab-pane fade show active" id="v-pills-chatBoxSettings" role="tabpanel" aria-labelledby="v-pills-chatBoxSettings-tab">
                                                <div className="row mb-3">
                                                    <div className="col-6">Chatbox Color:</div>
                                                    <div className="col-6"><input onChange={this.chatboxColorChange} value={chatBoxColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">User Text BgColor:</div>
                                                    <div className="col-6"><input onChange={this.userBgChange} value={userBg} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">User Text Color:</div>
                                                    <div className="col-6"><input onChange={this.userColorChange} value={userColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">User Font:</div>

                                                    <div className="col-6">
                                                        <div className="dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span style={{ "fontFamily": userFont }}>{userFont} </span>
                                                        </div>
                                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                            {fonts.map((font, index) => (
                                                                <span style={{ "fontFamily": font }} key={index} onClick={() => this.userFontSelect(font)} className="dropdown-item" > {font} </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Assistant Text BgColor:</div>
                                                    <div className="col-6"><input onChange={this.assistantBgChange} value={assistantBg} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Assistant Text Color:</div>
                                                    <div className="col-6"><input onChange={this.assistantColorChange} value={assistantColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Assistant Font:</div>

                                                    <div className="col-6">
                                                        <div className="dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span style={{ "fontFamily": assistantFont }}>{assistantFont} </span>
                                                        </div>
                                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                            {fonts.map((font, index) => (
                                                                <span style={{ "fontFamily": font }} key={index} onClick={() => this.assistantFontSelect(font)} className="dropdown-item" > {font} </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="v-pills-cardSettings" role="tabpanel" aria-labelledby="v-pills-cardSettings-tab">
                                                <div className="row mb-3">
                                                    <div className="col-6">Card BgColor:</div>
                                                    <div className="col-6"><input onChange={this.cardBgColorChange} value={cardBgColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Card Text Color:</div>
                                                    <div className="col-6"><input onChange={this.cardTextColorChange} value={cardTextColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Card Border Color:</div>
                                                    <div className="col-6"><input onChange={this.cardBorderChange} value={cardBorder} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6"> Card Font:</div>

                                                    <div className="col-6">
                                                        <div className="dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span style={{ "fontFamily": cardFont }}>{cardFont}</span>
                                                        </div>
                                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                            {fonts.map((font, index) => (
                                                                <span style={{ "fontFamily": font }} key={index} onClick={() => this.cardFontSelect(font)} className="dropdown-item" > {font} </span>
                                                            ))}
                                                        </div></div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="v-pills-chipSettings" role="tabpanel" aria-labelledby="v-pills-chipSettings-tab">
                                                <div className="row mb-3">
                                                    <div className="col-6">Chip BgColor:</div>
                                                    <div className="col-6"><input onChange={this.chipBgColorChange} value={chipBgColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Chip Text Color:</div>
                                                    <div className="col-6"><input onChange={this.chipTextColorChange} value={chipTextColor} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Chip Border Color:</div>
                                                    <div className="col-6"><input onChange={this.chipBorderChange} value={chipBorder} type="color"></input></div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Chip Font:</div>

                                                    <div className="col-6">
                                                        <div className="dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span style={{ "fontFamily": chipFont }}> {chipFont}</span>
                                                        </div>
                                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                            {fonts.map((font, index) => (
                                                                <span style={{ "fontFamily": font }} key={index} onClick={() => this.chipFontSelect(font)} className="dropdown-item" > {font} </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-6">Chip Shape:</div>

                                                    <div className="col-6"><input onChange={this.chipShapeChange} type="range" min="0" max="100" value={chipShape} id="chipBorderSlider"></input>{chipShape}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-4" style={{ float: "right" }}> */}
                                <div>
                                    <div className="chats-box" style={{ bottom: "4px" }}>
                                        <ChatboxTop
                                            name={"Testbot"}
                                            description={"Check your theme settings here."}
                                            chatBoxColor={chatBoxColor} />
                                        <div className="chatbox-body">
                                            <div className="chat-conversion">
                                                <Message
                                                    messageObject={sampleUserMessage}
                                                    chipTheme={chipTheme}
                                                    cardTheme={cardTheme}
                                                    chatBoxTheme={chatBoxTheme} />
                                                {selectedPane === "message" ?
                                                    <Message
                                                        messageObject={sampleBotMessage}
                                                        duration={0}
                                                        chipTheme={chipTheme}
                                                        cardTheme={cardTheme}
                                                        chatBoxTheme={chatBoxTheme} /> : null}

                                                {selectedPane === "card" ?
                                                    <Message
                                                        messageObject={sampleCardMessage}
                                                        chipTheme={chipTheme}
                                                        duration={0}
                                                        cardTheme={cardTheme}
                                                        chatBoxTheme={chatBoxTheme} /> : null}
                                                {selectedPane === "chip" ?
                                                    <Message
                                                        messageObject={sampleChipMessage}
                                                        chipTheme={chipTheme}
                                                        duration={0}
                                                        cardTheme={cardTheme}
                                                        chatBoxTheme={chatBoxTheme} /> : null}
                                            </div >
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="chatbox-chat">
                                            <div className="form-group">
                                                <input
                                                    disabled
                                                    onKeyDown={this.keyPress}
                                                    type="text"
                                                    className="form-control"
                                                    id="sendMessage"
                                                    placeholder="Type your message" />
                                                <i className="fas fa-paper-plane" ></i>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ paddingTop: "12%", paddingLeft: "35%" }}> <button onClick={() => this.saveChanges()} className="btn btn-sm btn-primary my-2 my-sm-0 mr-2"> Save Changes </button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { Settings };