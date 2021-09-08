import React, { useState, useEffect, useContext } from 'react';
import './css/intentCard.css';

const IntentCard = (props) => {
    const [time, setTime] = useState(undefined);

    const selectIntent = () => {
        sessionStorage.setItem('intent', props.intent.intentId)
    }
    return (
        <React.Fragment>
            <div className="card text-center style m-4">
                <a className="intentCard" onClick={() => selectIntent()} href={`/dashboard/intent/messages`}>
                    <div className={"card-body " + (props.intent.previousIntent ? "follow" : "")}>
                        <div className="row">
                            <div className={"col-md-" + (props.intent.intentId.length - 36) / 4}></div>
                            <h5 className="card-title col-md-3">{props.intent.intentName}</h5>
                            <p className={"card-text col-md-" + (7 - ((props.intent.intentId.length) - 36) / 4)}>{props.intent.description} </p>
                            <div className="col-md-2 d-flex justify-content-end">
                                <div className="button-group" role="group" aria-label="Basic example">
                                    <button onClick={() => props.setPreviousIntent(props.intent.intentId)} type="button" data-toggle="modal" data-target="#createIntent" className="btn btn-sm btn-outline-primary mr-1">
                                        <i className="fas fa-plus"></i>
                                    </button>
                                    <button onClick={() => props.setSelectedIntent(props.intent)} type="button" data-toggle="modal" data-target="#updateIntent" className="btn btn-sm mr-1 btn-outline-success">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => props.onDelete(props.intent)} type="button" className="btn btn-sm btn-outline-danger">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </React.Fragment >
    );
}

export default IntentCard;