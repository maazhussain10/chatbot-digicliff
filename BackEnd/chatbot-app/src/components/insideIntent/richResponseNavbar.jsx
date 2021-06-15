import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class RichResponseNavBar extends Component {
    state = {}
    handleLogout = () => {
        sessionStorage.clear();
    }
    render() {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        return (
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
                            <li className="nav-item">
                                <a className="nav-link navlinks" href={`/assistant/${username}`}>Home</a>
                            </li>
                            <li className="nav-item ">
                                <a className="nav-link navlinks" data-toggle="modal" data-target="#entity" href="/intents">Entity</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navlinks" data-toggle="modal" data-target="#runquery" href="/intents">Run Queries</a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link navlinks" href={`/assistant/${username}/${assistantName}/${intentName}/rich`}>Rich response<span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                        {/* <Link to={route}> */}
                        <Link to={`/${username}/profile`}>
                            <button href={`/${username}/profile`} className="profile-btn" >Profile</button>
                        </Link>

                        {/* </Link> */}
                        <a className="train-btn" type="submit">Train</a>
                        <a href="/#" onClick={this.handleLogout} className="logout-btn" type="submit">Logout</a>
                        {/* <a href="/explore" className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit"></a> */}
                    </div>
                </div>
            </nav>
        );
    }
}

export { RichResponseNavBar };