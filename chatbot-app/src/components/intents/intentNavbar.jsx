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
                <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#ffffff" }}>
                    <div className="container">
                        <a className="brandname" href="/#">
                            {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" /> */}
                            AnyBot</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-navitems mr-auto">
                                <li className="nav-item active">
                                    <a className="navlinks" href={`/assistant/${username}`} style={{ marginRight: "50px" }}>Home<span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a id="creat" type="button" className=" navlinks" data-toggle="modal" data-target="#databaseModal">
                                        Connect DB
                                    </a>
                                </li>
                            </ul>
                            <Link to={`/${username}/profile`}>
                                <button href={`/${username}/profile`} className="profile-btn" >Profile</button>
                            </Link>
                            {/*<button id="creat" type="button" className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" data-toggle="modal" data-target="#databaseModal">
                                Connect DB
                                </button>*/}

                            <span onClick={() => updateDisplayComponent()} className="settings-btn" type="submit">
                                {displayComponent === "intents" ? "Settings" : "INTENTS"}
                            </span>

                            <a href="/#" onClick={this.handleLogout} className="logout-btn" type="submit">Logout</a>
                        </div>
                    </div>
                </nav>

            </React.Fragment>
        );
    }
}

export { Navbar };