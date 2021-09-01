import React from 'react';

const ModalTemplate = (props) => {
    return (
        <div className="modal fade" id={props.id} data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{props.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => props.handleCloseButton()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {props.status ?
                            <div className={"alert alert-" + props.status} role="alert">
                                {props.message}
                            </div>
                            : null}
                        {props.children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-danger" data-dismiss="modal" onClick={() => props.handleCloseButton()}>Close</button>
                        <button type="submit" className="btn btn-primary">{props.buttonName}</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ModalTemplate;