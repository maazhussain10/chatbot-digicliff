import React, { Component } from 'react';
import { Entity } from './entity'
import { RunQuery } from './runQueries'
class Navbar extends Component {
    state = {}
    render() {
        // Get the necessary details ( username, assistantName, intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));

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
                        { }
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href={`/assistant/${username}`}>HOME<span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item ">
                                    <a className="nav-link" data-toggle="modal" data-target="#entity" href="/explore">ENTITY</a>
                                </li>
                                <li className="nav-item ">
                                    <a className="nav-link" href="/explore" data-toggle="modal" data-target="#runquery">RUN QUERIES</a>
                                </li>
                                <li className="nav-item ">
                                    <a className="nav-link" href={`/assistant/${username}/${assistantName}/${intentName}/rich`}>RICH RESPONSE</a>
                                </li>
                            </ul>
                            {/* <Link to={route}> */}
                            <button className="btn btn-sm btn-primary my-2 my-sm-0 mr-2" >PROFILE</button>
                            {/* <button id="creat" type="button" className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" data-toggle="modal" data-target="#DB">
                                CONNECT DB
                                </button> */}
                            {/* </Link> */}
                            <a href="/#" onClick={this.handleLogout} className="btn btn-sm btn-outline-success my-2 my-sm-0 mr-2" type="submit">TRAIN</a>
                            {/* <a href="/explore" className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit"></a> */}
                        </div>
                    </div>
                </nav>
                <Entity />
                <RunQuery />


            </React.Fragment>
        );
    }
}

export { Navbar };