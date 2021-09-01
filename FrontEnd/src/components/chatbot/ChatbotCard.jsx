import React, { useEffect, useState } from 'react';


const formatTime = (seconds, createdAt) => {
    if (seconds === 1)
        return seconds + " second ago";
    else if (seconds < 60)
        return seconds + " seconds ago";
    else {
        let minutes = Math.floor(seconds / 60);
        if (minutes === 1)
            return minutes + " minute ago";
        else if (minutes < 60)
            return minutes + " minutes ago";
        else {
            let hours = Math.floor(minutes / 60);
            if (hours === 1)
                return hours + " hour ago";
            else if (hours < 24)
                return hours + " hours ago";
            else {
                let days = Math.floor(hours / 64);
                if (days == 1)
                    return days + " day ago";
                else
                    return " on: " + new Date(createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
            }
        }
    }

}

const ChatbotCard = (props) => {
    const [seconds, setSeconds] = useState(undefined);

    useEffect(() => {
        if (seconds === undefined) return;
        const interval = setInterval(() => {
            setSeconds(seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    useEffect(() => {
        let createdAt = new Date(props.chatbot.createdAt);
        let currentDate = new Date();

        let milliseconds = Math.abs(currentDate - createdAt);
        let seconds = Math.floor(milliseconds / 1000);
        setSeconds(seconds);

    }, []);

    const selectChatbot = () => {
        sessionStorage.setItem('chatbot', props.chatbot.chatbotId)
    }

    return (
        <React.Fragment>
            <div className="card text-center">
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex justify-content-start">
                                <a href={`/dashboard/settings`}>
                                    <button onClick={() => sessionStorage.setItem('chatbot', props.chatbot.chatbotId)} type="button" data-toggle="modal" data-target="#embedscript" className="btn btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                                        </svg>
                                    </button>
                                </a>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex justify-content-end">
                                {/* <div className="btn-group" role="group" aria-label="Basic example"> */}
                                {/* Get Assistant Embed Script */}
                                <button type="button" data-toggle="modal" data-target="#embedscript" className="btn btn-sm btn-outline-info mr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                                    </svg>
                                </button>
                                {/* Update Assistant Button */}
                                <button onClick={() => props.setSelectedChatbot(props.chatbot)} type="button" data-toggle="modal" data-target="#updateChatbot" className="btn btn-sm btn-outline-success mr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                    </svg>
                                </button>
                                {/* Delete Assistant Button */}
                                <button type="button" onClick={() => props.setSelectedChatbot(props.chatbot)} className="btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#confirmDelete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                    </svg>
                                </button>

                                {/* </div> */}
                            </div>
                        </div>
                    </div>

                    <h5 className="card-title text-center">{props.chatbot.chatbotName}</h5>
                    <p className="card-text text-center">{props.chatbot.description}</p>
                    <a href={`/dashboard/intent`} onClick={() => selectChatbot()} className="btn btn-primary text-center">Build</a>
                </div>
                <div className="card-footer text-muted">
                    Created {formatTime(seconds, props.chatbot.createdAt)}
                    <br />
                </div>
            </div>
        </React.Fragment >
    );
}

export default ChatbotCard;