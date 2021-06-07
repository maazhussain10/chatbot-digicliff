import React, { Component } from 'react';
import './css/midcontent.css'


// Extra file for future plans, Isn't used anywhere at the moment.
class Mid extends Component {
    state = {}
    render() {
        return (
            <div className="container">

                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createAssistant">
                    Create a new bot
                </button>


                <div className="modal fade" id="createAssistant" tabindex="-1" aria-labelledby="createAssistantModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createAssistantModal">Create assistant</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                            </div>
                            <div className="modal-body">
                                <div className="container ">
                                    <form>
                                        <div className="form-group">
                                            <label for="input-assistantName">Bot Name</label>
                                            <input type="text" className="form-control" id="input-assistantName" aria-describedby="assistantName" />
                                            <small id="assistantName" className="form-text text-muted">type a name.</small>
                                        </div>
                                        <div className="form-group">
                                            <label for="input-assistantDesc">Assistant description</label>
                                            <textarea className="form-control" id="input-assistantDesc" rows="3"></textarea>
                                            <small id="assistantName" className="form-text text-muted">describe your best out of your bot</small>
                                        </div>
                                        <p>
                                            <a className="btn btn-info" data-toggle="collapse" href="#imageCollapse" role="button" aria-expanded="false" aria-controls="imageCollapse">
                                                Add Image (optional)
                                            </a>

                                        </p>
                                        <div className="collapse" id="imageCollapse">
                                            <div className="card card-body">
                                                <div className="form-group">
                                                    <label for="assistantImage">Choose Image</label>
                                                    <input type="file" className="form-control-file " id="assistantImage" />
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary">Create</button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        );
    }
}

export { Mid };