import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Navbar extends Component {
    state = {}

    handleLogout = () => {
        sessionStorage.clear();
    }
    //------------------------------------------------------------------RENDER----------------------------------------------------------------------
    render() {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { updateDisplayComponent, displayComponent } = this.props;
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light shadow p-3 mb-5 bg-white rounded" style={{ backgroundColor: "#ffffff" }}>
                    <div className="container">
                        <a className="navbar-brand" href="/#">
                            {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" /> */}
                             ANYBOT</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href={`/assistant/${username}`}>HOME<span className="sr-only">(current)</span></a>
                                </li>
                            </ul>
                            <Link to={`/${username}/profile`}>
                                <button href={`/${username}/profile`} className="btn btn-sm btn-primary my-2 my-sm-0 mr-2" >PROFILE</button>
                            </Link>
                            <button id="creat" type="button" className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" data-toggle="modal" data-target="#databaseModal">
                                CONNECT DB
                                </button>

                            <span onClick={() => updateDisplayComponent()} className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit">
                                {displayComponent === "intents" ? "SETTINGS" : "INTENTS"}
                            </span>
                            <a href="/#" onClick={this.handleLogout} className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" type="submit">LOGOUT</a>
                            {/* <a href="/explore" className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit"></a> */}
                        </div>
                    </div>
                </nav>

            </React.Fragment>
        );
    }
}

export { Navbar };