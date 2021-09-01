import React, { useState } from 'react';


const AssistantCard = (props) => {
    const [time, setTime] = useState(undefined);

    const selectChatbot = () => {
        sessionStorage.setItem('chatbot', props.chatbot.chatbotId)
    }

    return (
        <React.Fragment>
            <div className="card text-center">
                <div className="card-body">
                    <div className="d-flex justify-content-end">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            {/* Get Assistant Settings Icon */}
                            <a href={`/dashboard/settings`}>
                                <button type="button" data-toggle="modal" data-target="#embedscript" className="btn btn-sm btn-outline-dark">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                    </svg>
                                </button>
                            </a>
                            {/* Get Assistant Embed Script */}
                            <button type="button" data-toggle="modal" data-target="#embedscript" className="btn btn-sm btn-outline-dark">
                                &lt; &gt;
                            </button>
                            {/* Update Assistant Button */}
                            <button onClick={() => props.setSelectedChatbot(props.chatbot)} type="button" data-toggle="modal" data-target="#updateChatbot" className="btn btn-sm btn-outline-success">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            </button>
                            {/* Delete Assistant Button */}
                            <button type="button" onClick={() => props.setSelectedChatbot(props.chatbot)} className="btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#confirmDelete">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-dash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5-.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                                </svg>
                            </button>

                        </div>
                    </div>
                    <h5 className="card-title text-center">{props.chatbot.chatbotName}</h5>
                    <p className="card-text text-center">{props.chatbot.description}</p>
                    <a href={`/dashboard/intent`} onClick={() => selectChatbot()} className="btn btn-primary text-center">Build</a>
                </div>
                <div className="card-footer text-muted">
                    Created: {time}
                    <br />
                </div>
            </div>
        </React.Fragment >
    );
}

export default AssistantCard;