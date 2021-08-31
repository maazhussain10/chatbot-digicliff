import React, { Component } from 'react';

class UpdateModal extends Component {
    state = {}
    render() {
        return (
            <div className="modal fade" id="updateCard" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updatecard">Edit Card</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            <div className="card mb-3" >
                                <div className="card-header">
                                    <input
                                        style={{ color: 'black' }}

                                        className="input-card"
                                        defaultValue="Header"
                                        type="text" /></div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <input
                                            style={{ color: 'black' }}

                                            className="input-card"
                                            defaultValue="Dark Card Title"
                                            type="text" />
                                    </h5>
                                    <textarea
                                        style={{ color: 'black' }}

                                        className="card-text input-card cardTextArea"
                                        defaultValue="Some quick example text to build on the card title and make up the bulk of the card's content." />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { UpdateModal };