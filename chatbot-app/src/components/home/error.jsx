import React, { Component } from 'react';

class Error extends Component {
    state = {}
    render() {
        return (
            <div style={{ fontFamily: 'Tinos' }}>
                <div className=" shadow-lg container styl text-center " style={{ marginTop: "150px" }}>
                    <div className="styl">
                        <div className="pb-5">
                            <h1 style={{ marginBottom: "none", paddingBottom: "none", color: "red" }} className="display-1 ">404</h1>
                            <h4 className="">OOPS!</h4>
                            <h6 className="pb-1">looks like you're lost!</h6>
                            <a href="/#" className="btn btn-sm btn-outline-primary">Go to home</a>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export { Error };