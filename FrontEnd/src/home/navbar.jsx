import React, { Component } from 'react';
// import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/navbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
//import { logo } from '../images/logo2.png'
import { Signup } from './signup'
import { Login } from './login'
class NavBar extends Component {
    state = {}
    render() {
        return (

            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#ffffff" }}>
                <div className="container">
                    <a className="navbar-brand" href="/#">
                        {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" />  */}
                        ANYBOT</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/#">HOME<span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/docs">DOCUMENTATION</a>
                            </li>
                        </ul>
                        <Login />
                        <Signup />
                        <a href="/explore" className="btn btn-sm btn-outline-secondary my-2 my-sm-0 mr-2" type="submit">EXPLORE</a>
                    </div>
                </div>
            </nav>

        );
    }
}

export { NavBar };