import React, { useState, useContext } from 'react';
import { Link, Redirect, } from 'react-router-dom';
import { AccessTokenContext } from '../../accessTokenContext.js';
import authService from '../../services/auth.service.js';
import Login from '../home/Login.jsx';
import Signup from '../home/Signup.jsx';
// import './css/navbar.css';
const Navbar = (props) => {
    const { setAccessToken } = useContext(AccessTokenContext);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const logout = async () => {
        try {
            const response = await authService.logout();
            if (response.status === 204) {
                setAccessToken(undefined);
                setRedirectToLogin(true);
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (redirectToLogin)
        return <Redirect push to="/" />
    return (
        // <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#ffffff" }}>
        //     <div className="container">
        //         <a className="navbar-brand" href="/#">
        //             {/* <img src="" width="30" height="30" className="d-inline-block align-top" alt="" loading="lazy" /> */}
        //             Companion</a>
        //         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>

        //         <div className="collapse navbar-collapse" id="navbarSupportedContent">
        //             <ul className="navbar-navitems mr-auto">
        //                 {props.isAuthenticated ?
        //                     <li className="nav-item active">
        //                         <a className="navlinks" href="/dashboard" style={{ marginRight: "50px" }}>Dashboard<span className="sr-only">(current)</span></a>
        //                     </li>
        //                     : null}
        //                 <li className="nav-item">
        //                     <a className="navlinks" href="/docs" style={{ marginRight: "50px" }}>Documentation</a>
        //                 </li>

        //                 {props.children}
        //             </ul>

        //         {!props.isAuthenticated ?
        //             <React.Fragment>
        //                 <Login />
        //                 <Signup />
        //             </React.Fragment>
        //             :
        //             <React.Fragment>
        //                 <Link to={`/profile`}>
        //                     <button href={`/profile`} className="profile-btn" >Profile</button>
        //                 </Link>
        //                 <button onClick={() => logout()} className="logout-btn" type="submit">Logout</button>
        //             </React.Fragment>
        // }
        //         </div>
        //     </div>
        // </nav>
        <nav className="navbar navbar-expand-lg navbar-lg navbar-light" style={{ fontSize: "20px" }}>

            <a className="navbar-brand" style={{ fontSize: "25px" }} href="/#">Companion</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {props.isAuthenticated ?
                        <li className="nav-item active">
                            <a className="nav-link" href="/dashboard">Dashboard<span className="sr-only">(current)</span></a>
                        </li>
                        : null}
                    <li className="nav-item">
                        <a className="nav-link" href="/docs">Documentation<span className="sr-only">(current)</span></a>
                    </li>
                    {props.children}
                </ul>

                <form className="form-inline my-2 mr-2 my-lg-0">
                    <input className="form-control mr-sm-2 shadow-none" type="search" placeholder="Search" aria-label="Search" />

                </form>
                {!props.isAuthenticated ?
                    <React.Fragment>
                        <Login />
                        <Signup />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="form-inline my-2 my-lg-0">
                            {/* <button className="btn btn-primary">Login</button> */}
                            <Link to={`/profile`}>
                                <button href={`/profile`} className="btn btn-primary mr-2" >Profile</button>
                            </Link>
                            <button onClick={() => logout()} className="btn btn-outline-danger" type="submit">Logout</button>
                        </div>

                    </React.Fragment>
                }

            </div>
        </nav>
    )
}

export default Navbar