import React, { Component } from 'react';

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
                    <a className="navbar-brand" href="/#">
                        {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" /> */}
                             ANYBOT</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href={`/assistant/${username}`}>HOME</a>
                            </li>
                            <li className="nav-item ">
                                <a className="nav-link" data-toggle="modal" data-target="#entity" href="/intents">ENTITY</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="modal" data-target="#runquery" href="/intents">RUN QUERIES</a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href={`/assistant/${username}/${assistantName}/${intentName}/rich`}>RICH RESPONSE<span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                        {/* <Link to={route}> */}
                        <button className="btn btn-sm btn-primary my-2 my-sm-0 mr-2" >PROFILE</button>

                        {/* </Link> */}
                        <a href="/#" onClick={this.handleLogout} className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" type="submit">TRAIN</a>
                        <a href="/#" onClick={this.handleLogout} className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" type="submit">LOGOUT</a>
                        {/* <a href="/explore" className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit"></a> */}
                    </div>
                </div>
            </nav>
        );
    }
}

export { RichResponseNavBar };