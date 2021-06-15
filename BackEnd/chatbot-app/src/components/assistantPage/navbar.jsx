import React, { Component } from 'react';
import { Link } from "react-router-dom";
class Navbar extends Component {
    state = {}
    handleLogout = () => {
        sessionStorage.clear();
    }
    render() {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        return (
            <React.Fragment>

                <nav className="navbar navbar-expand-lg navbar-light px-0 " style={{ backgroundColor: "#ffffff" }}>
                    <div className="container-xl">
                        <a className="brandname" style={{ marginRight: "50px" }} href="/#">
                            {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" /> */}
                            AnyBot</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-navitems mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link home navlinks" href={`/assistant/${username}`}>Home<span className="sr-only">(current)</span></a>
                                </li>
                            </ul>
                            <Link to={`/${username}/profile`}>
                                <button className="profile-btn" href={`/${username}/profile`}>Profile</button>
                            </Link>
                            <button href="/#" onClick={this.handleLogout} className="logout-btn" type="submit">Logout</button>
                        </div>
                    </div>
                </nav>

            </React.Fragment>
        );
    }
}

export { Navbar };