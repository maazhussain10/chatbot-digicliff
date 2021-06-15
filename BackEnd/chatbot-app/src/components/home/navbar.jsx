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

            <nav className="navbar navbar-expand-lg navbar-light px-0 ">
                <div className="container-xl">
                    <a className="brandname" style={{ marginRight: "100px" }} href="/#">
                        {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" />  */}
                        AnyBot</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-navitems mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link home navlinks" href="/#" style={{ marginRight: "50px" }}>Home<span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link navlinks" href="/docs" style={{ marginRight: "50px" }}>Documentation</a>
                            </li>
                            <li className="nav-item">
                                <a href="/explore" className="nav-link navlinks" style={{ marginRight: "50px" }}>Explore</a>
                            </li>
                        </ul>
                        <Login />
                        <Signup />

                    </div>
                </div>
            </nav>

        );
    }
}

export { NavBar };