import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from "jquery";
import axios from 'axios';
class Login extends Component {
    state = {
        password: "",
        usernameEmail: "",
        modal: "",
        isCorrectValue: false,
        userId: undefined,
        username: undefined,
        isAuthenticated: false
    };

    componentWillUnmount() {
        this._isMounted = false;
    }


    componentDidMount() {
        this._isMounted = true;
        this.setState({ userId: undefined, username: undefined });
        $(".field__input").on('keydown', (e) => {
            if (e.key === "Enter") {
                var index = $(".field__input").index(this) + 1;
                $(".field__input").eq(index).focus();
            }
        });
    }

    userNameEmailkeyPress = (e) => {

        if (this.handleUsernameEmail) {
            this.handleUsernameEmail(e.target.value);

        }
    }
    passwordKeyPress = (e) => {

        if (this.handlePassword)
            this.handlePassword(e.target.value);
    }
    doLogin = async () => {
        if (!this.state.usernameEmail && !this.state.password) {
            return;
        }
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/loggingIn',
                params: {
                    usernameEmail: this.state.usernameEmail,
                    password: this.state.password
                },

            }).then(async (response) => {
                if (response.data.responseStatus === true) {
                    const { username, userId, emailId, firstName, lastName } = response.data;
                    if (this._isMounted) {
                        let userDetails = { userId: userId, username: username, email: emailId, firstName: firstName, lastName: lastName };
                        sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
                        await this.setState({ isAuthenticated: true, username: username, userId: userId, modal: "modal" });
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    handleUsernameEmail = async (text) => {
        await this.setState({ usernameEmail: text });
    };

    handlePassword = async (text) => {
        await this.setState({ password: text });
    };

    render() {
        if (this.state.isAuthenticated) {
            $('#login').modal('hide')
            return (
                <Redirect to={`/assistant/${this.state.username}`} />
            );
        }
        return (
            <React.Fragment>
                <button className="btn btn-sm btn-primary my-2 my-sm-0 mr-2" data-toggle="modal" data-target="#login">LOGIN</button>
                <div className="modal fade" id="login" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Login into your Account</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="containe">
                                    <form className="containe">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Email address or Username</label>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-at" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd"
                                                            d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                                                    </svg>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Username"
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                    onChange={this.userNameEmailkeyPress}
                                                />
                                            </div>
                                            <small id="emailHelp" className="form-text text-muted">We'll never share your information with anyone else.</small>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Password</label>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-shield-lock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M5.443 1.991a60.17 60.17 0 0 0-2.725.802.454.454 0 0 0-.315.366C1.87 7.056 3.1 9.9 4.567 11.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0 0 8 14.5c.007-.001.038-.005.097-.023.072-.022.166-.058.282-.111.23-.106.525-.272.857-.5a10.197 10.197 0 0 0 2.197-2.093C12.9 9.9 14.13 7.056 13.597 3.159a.454.454 0 0 0-.315-.366c-.626-.2-1.682-.526-2.725-.802C9.491 1.71 8.51 1.5 8 1.5c-.51 0-1.49.21-2.557.491zm-.256-.966C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815z" />
                                                            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Password"
                                                    aria-label="Password"
                                                    aria-describedby="basic-addon1"
                                                    onChange={this.passwordKeyPress}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss={this.state.modal} onClick={this.doLogin}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { Login };