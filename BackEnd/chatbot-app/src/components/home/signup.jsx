import React, { Component } from 'react';
import $ from "jquery";
import axios from 'axios';
import validate from './js/validation.js';
import './css/signup.css';

class Signup extends Component {
  state = {
    usernameValidation: {
      message: "",
      isCorrect: null,
    },
    emailValidation: {
      message: "",
      isCorrect: null,
    },
    passwordValidation: {
      message: "",
      isCorrect: null,
    },
    confirmPasswordValidation: {
      message: "",
      isCorrect: null,
    },
    firstNameValidation: {
      message: "",
      isCorrect: null,
    },
    lastNameValidation: {
      message: "",
      isCorrect: null,
    },
    password: undefined,
    confirmPassword: undefined,
    username: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    isAccountCreated: undefined,
  };



  componentDidMount() {
    this._isMounted = true;

    $(".move-input").keydown(function (e) {
      if (e.which === 13) {
        var index = $(".move-input").index(this) + 1;
        $(".move-input").eq(index).focus();
      }
    });

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async createAccount() {
    const { password, firstName, lastName, email, username, confirmPassword } = this.state;
    if (!(password && firstName && lastName && email && username && confirmPassword)) {
      // Display error if password field doesn't have a value
      if (!password) {
        await this.setState({
          passwordValidation: {
            message: "Password cannot be empty.",
            isCorrect: false,
          }
        })
        document.getElementById('passwordField').style.borderColor = "#ff0000";
        document.getElementById('password').style.borderColor = "#ff0000";
      }
      // Display error if first name field doesn't have a value
      if (!firstName) {
        await this.setState({
          firstNameValidation: {
            message: "First name cannot be empty.",
            isCorrect: false,
          }
        })
        document.getElementById('firstNameField').style.borderColor = "#ff0000";
        document.getElementById('firstName').style.borderColor = "#ff0000";
      }
      // Display error if last name field doesn't have a value
      if (!lastName) {
        await this.setState({
          lastNameValidation: {
            message: "Last name cannot be empty.",
            isCorrect: false,
          }
        })
        document.getElementById('lastNameField').style.borderColor = "#ff0000";
        document.getElementById('lastName').style.borderColor = "#ff0000";
      }
      // Display error if confirm password field doesn't have a value
      if (!confirmPassword) {
        await this.setState({
          confirmPasswordValidation: {
            message: "Confirm Password field should not be empty.",
            isCorrect: false,
          }
        })
        document.getElementById('confirmPasswordField').style.borderColor = "#ff0000";
        document.getElementById('confirmPassword').style.borderColor = "#ff0000";
      }
      // Display error if email address field doesn't have a value
      if (!email) {
        await this.setState({
          emailValidation: {
            message: "E-mail address field should not be empty.",
            isCorrect: false,
          },
        })
        document.getElementById('emailIdField').style.borderColor = "#ff0000";
        document.getElementById('emailId').style.borderColor = "#ff0000";
      }
      // Display error if username field doesn't have a value
      if (!username) {
        await this.setState({
          usernameValidation: {
            message: "Username field should not be empty.",
            isCorrect: false,
          },
        })
        document.getElementById('usernameField').style.borderColor = "#ff0000";
        document.getElementById('username').style.borderColor = "#ff0000";
      }
      return;
    }
    try {
      axios({
        method: 'post',
        url: 'http://localhost:5000/signingUp',
        params: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: password
        },

      }).then(async (response) => {
        let { responseStatus, existenceData } = response.data;

        // If account has not been created, set State to display an success alert message.
        if (this._isMounted && responseStatus) {
          this.setState({ isAccountCreated: true });
        }
        // If account has not been created, set State to display an error alert message.
        if (this._isMounted && !responseStatus) {
          this.setState({ isAccountCreated: false });
        }

        let { usernameExists, emailExists } = existenceData;
        // Displays Error message if username already exists
        if (usernameExists) {
          await this.setState({
            usernameValidation: {
              message: "Username already exists",
              isCorrect: false,
            }
          })
          document.getElementById('usernameField').style.borderColor = "#ff0000";
          document.getElementById('username').style.borderColor = "#ff0000";
        }
        // Displays Error message is email address already exists.
        if (emailExists) {
          await this.setState({
            emailValidation: {
              message: "E-mail address already exists",
              isCorrect: false,
            }
          })
          document.getElementById('emailIdField').style.borderColor = "#ff0000";
          document.getElementById('emailId').style.borderColor = "#ff0000";
        }
      });
    }
    catch (e) {
      console.log(e);
    }
  }


  handlePassword = async (e) => {
    let text = e.target.value;
    let { isNotEmpty, hasMinimumCharacters } = validate(text, "password", 8);
    if (!isNotEmpty) {
      await this.setState({
        passwordValidation: {
          message: "Password cannot be empty.",
          isCorrect: false,
        }
      })
      document.getElementById('passwordField').style.borderColor = "#ff0000";
      document.getElementById('password').style.borderColor = "#ff0000";
    } else if (!hasMinimumCharacters) {
      await this.setState({
        passwordValidation: {
          message: "Password must have a minimum of 8 characters.",
          isCorrect: false,
        }
      })
      document.getElementById('passwordField').style.borderColor = "#ff0000";
      document.getElementById('password').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        passwordValidation: {
          message: "Success",
          isCorrect: true,
        },
        password: text,
      });
      document.getElementById('passwordField').style.borderColor = "#32cd32";
      document.getElementById('password').style.borderColor = "#32cd32";
    }
  };

  handleConfirmPassword = async (e) => {
    let text = e.target.value;
    const { password } = this.state;
    let { isNotEmpty } = validate(text, "password", 8);
    const doesMatch = password === text;
    if (!isNotEmpty) {
      await this.setState({
        confirmPasswordValidation: {
          message: "Confirm Password field should not be empty.",
          isCorrect: false,
        }
      })
      document.getElementById('confirmPasswordField').style.borderColor = "#ff0000";
      document.getElementById('confirmPassword').style.borderColor = "#ff0000";
    }
    else if (!doesMatch) {
      await this.setState({
        confirmPasswordValidation: {
          message: "Password and Confirm Password do not match",
          isCorrect: false,
        }
      })
      document.getElementById('confirmPasswordField').style.borderColor = "#ff0000";
      document.getElementById('confirmPassword').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        confirmPasswordValidation: {
          message: "Success",
          isCorrect: true,
        },
        confirmPassword: text
      })
      document.getElementById('confirmPasswordField').style.borderColor = "#32cd32";
      document.getElementById('confirmPassword').style.borderColor = "#32cd32";
    }
  };

  handleUsername = async (e) => {
    let text = e.target.value;
    let { isNotEmpty, hasCorrectCharacters, hasMinimumCharacters } = validate(text, "username", 3);
    if (!isNotEmpty) {
      await this.setState({
        usernameValidation: {
          message: "Username cannot be empty.",
          isCorrect: false,
        }
      })
      document.getElementById('usernameField').style.borderColor = "#ff0000";
      document.getElementById('username').style.borderColor = "#ff0000";
    } else if (!hasMinimumCharacters) {
      await this.setState({
        usernameValidation: {
          message: "Username must have a minimum of 3 characters",
          isCorrect: false,
        }
      })
      document.getElementById('usernameField').style.borderColor = "#ff0000";
      document.getElementById('username').style.borderColor = "#ff0000";
    }
    else if (!hasCorrectCharacters) {
      await this.setState({
        usernameValidation: {
          message: "Username must only contain alphanumerical characters.",
          isCorrect: false,
        }
      })
      document.getElementById('usernameField').style.borderColor = "#ff0000";
      document.getElementById('username').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        usernameValidation: {
          message: "Success",
          isCorrect: true,
        },
        username: text,
      });
      document.getElementById('usernameField').style.borderColor = "#32cd32";
      document.getElementById('username').style.borderColor = "#32cd32";
    }
  };



  handleFirstName = async (e) => {
    let text = e.target.value;
    let { isNotEmpty, hasCorrectCharacters } = validate(text, "name", 3);
    if (!isNotEmpty) {
      await this.setState({
        firstNameValidation: {
          message: "First name cannot be empty.",
          isCorrect: false,
        }
      })
      document.getElementById('firstNameField').style.borderColor = "#ff0000";
      document.getElementById('firstName').style.borderColor = "#ff0000";
    }
    else if (!hasCorrectCharacters) {
      await this.setState({
        firstNameValidation: {
          message: "First name must only contain alphabets.",
          isCorrect: false,
        }
      })
      document.getElementById('firstNameField').style.borderColor = "#ff0000";
      document.getElementById('firstName').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        firstNameValidation: {
          message: "Success",
          isCorrect: true,
        },
        firstName: text,
      });
      document.getElementById('firstNameField').style.borderColor = "#32cd32";
      document.getElementById('firstName').style.borderColor = "#32cd32";
    }
  };

  handleLastName = async (e) => {
    let text = e.target.value;
    let { isNotEmpty, hasCorrectCharacters } = validate(text, "name", 3);
    if (!isNotEmpty) {
      await this.setState({
        lastNameValidation: {
          message: "Last name cannot be empty.",
          isCorrect: false,
        },
      })
      document.getElementById('lastNameField').style.borderColor = "#ff0000";
      document.getElementById('lastName').style.borderColor = "#ff0000";
    }
    else if (!hasCorrectCharacters) {
      await this.setState({
        lastNameValidation: {
          message: "Last name must only contain alphabets.",
          isCorrect: false,
        },
      })
      document.getElementById('lastNameField').style.borderColor = "#ff0000";
      document.getElementById('lastName').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        lastNameValidation: {
          message: "Success",
          isCorrect: true,
        },
        lastName: text,
      });
      document.getElementById('lastNameField').style.borderColor = "#32cd32";
      document.getElementById('lastName').style.borderColor = "#32cd32";
    }
  };

  handleEmail = async (e) => {
    let text = e.target.value;
    let { isNotEmpty, hasCorrectCharacters } = validate(text, "email", 3);
    if (!isNotEmpty) {
      await this.setState({
        emailValidation: {
          message: "E-mail address field should not be empty.",
          isCorrect: false,
        },
      })
      document.getElementById('emailIdField').style.borderColor = "#ff0000";
      document.getElementById('emailId').style.borderColor = "#ff0000";
    }
    else if (!hasCorrectCharacters) {
      await this.setState({
        emailValidation: {
          message: "E-mail address must be valid.",
          isCorrect: false,
        },
      })
      document.getElementById('emailIdField').style.borderColor = "#ff0000";
      document.getElementById('emailId').style.borderColor = "#ff0000";
    }
    else {
      await this.setState({
        emailValidation: {
          message: "Success",
          isCorrect: true,
        },
        email: text,
      });
      document.getElementById('emailIdField').style.borderColor = "#32cd32";
      document.getElementById('emailId').style.borderColor = "#32cd32";
    }
  };
  render() {
    const {
      firstNameValidation,
      lastNameValidation,
      emailValidation,
      usernameValidation,
      passwordValidation,
      confirmPasswordValidation,
      isAccountCreated } = this.state;
    return (
      <React.Fragment>
        <button className="signup-button" data-toggle="modal" data-target="#signup">Sign up</button>
        <div className="modal fade" id="signup" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="signup">Create a new account</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" id="bootstrap-override">
                {isAccountCreated === true ?
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Account has been created Successfully!
                  </div>
                  : null}
                {isAccountCreated === false ?
                  <div class="alert alert-danger" role="alert">
                    Account Creation Failure!
                  </div>
                  : null}

                <form>
                  <div className="row">
                    <div className="col">
                      {/* First Name */}
                      <div className="input-group mb-3" >
                        <div className="input-group-prepend" >
                          <span className="input-group-text input-icon" id="firstNameField">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                              <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                              <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                            </svg>
                          </span>
                        </div>
                        <input
                          onChange={this.handleFirstName}
                          type="text"
                          id="firstName"
                          className="form-control input-field"
                          placeholder="First name"
                          aria-label="First name"
                          aria-describedby="basic-addon1" />
                        {firstNameValidation.isCorrect ?
                          null
                          :
                          <small id="firstName" className="form-text">{firstNameValidation.message}</small>
                        }
                      </div>
                    </div>
                    <div className="col">
                      {/* Last name */}
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text input-icon" id="lastNameField">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                          </span>
                        </div>
                        <input
                          onChange={this.handleLastName}
                          type="text"
                          className="form-control input-field"
                          id="lastName"
                          placeholder="Last name"
                          aria-label="Last name"
                          aria-describedby="LastName" />
                        {lastNameValidation.isCorrect ?
                          null
                          :
                          <small id="lastName" className="form-text">{lastNameValidation.message}</small>
                        }
                      </div>

                    </div>
                  </div>
                  <div className="form-group">
                    {/* Email Address */}
                    <label htmlFor="exampleInputEmail2">Email address</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-icon" id="emailIdField">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-envelope-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        id="emailId"
                        onChange={this.handleEmail}
                        type="email"
                        className="form-control input-field long-field"
                        placeholder="Email"
                        aria-label="Username"
                        aria-describedby="emailId" />
                      {emailValidation.isCorrect ?
                        null
                        :
                        <small id="emailId" className="form-text">{emailValidation.message}</small>
                      }
                    </div>
                  </div>
                  <div className="form-group">
                    {/* Username */}
                    <label htmlFor="exampleInputEmail3">Username</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-icon" id="usernameField">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-at" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        onChange={this.handleUsername}
                        id="username"
                        type="text"
                        autoComplete="chrome-off"
                        className="form-control input-field long-field"
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="usernameField" />
                      {usernameValidation.isCorrect ?
                        null
                        :
                        <small id="username" className="form-text">{usernameValidation.message}</small>
                      }
                    </div>

                    {/* Password */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-icon" id="passwordField">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-shield-lock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.443 1.991a60.17 60.17 0 0 0-2.725.802.454.454 0 0 0-.315.366C1.87 7.056 3.1 9.9 4.567 11.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0 0 8 14.5c.007-.001.038-.005.097-.023.072-.022.166-.058.282-.111.23-.106.525-.272.857-.5a10.197 10.197 0 0 0 2.197-2.093C12.9 9.9 14.13 7.056 13.597 3.159a.454.454 0 0 0-.315-.366c-.626-.2-1.682-.526-2.725-.802C9.491 1.71 8.51 1.5 8 1.5c-.51 0-1.49.21-2.557.491zm-.256-.966C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815z" />
                            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        onChange={this.handlePassword}
                        id="password"
                        type="password"
                        autoComplete="chrome-off"
                        className="form-control input-field long-field"
                        placeholder="Password"
                        aria-label="password"
                        aria-describedby="passwordField" />
                      {passwordValidation.isCorrect ?
                        null
                        :
                        <small id="password" className="form-text">{passwordValidation.message}</small>
                      }
                    </div>

                  </div>
                  <div className="form-group">
                    {/* Confirm Password */}
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-icon" id="confirmPasswordField">
                          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-shield-lock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.443 1.991a60.17 60.17 0 0 0-2.725.802.454.454 0 0 0-.315.366C1.87 7.056 3.1 9.9 4.567 11.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0 0 8 14.5c.007-.001.038-.005.097-.023.072-.022.166-.058.282-.111.23-.106.525-.272.857-.5a10.197 10.197 0 0 0 2.197-2.093C12.9 9.9 14.13 7.056 13.597 3.159a.454.454 0 0 0-.315-.366c-.626-.2-1.682-.526-2.725-.802C9.491 1.71 8.51 1.5 8 1.5c-.51 0-1.49.21-2.557.491zm-.256-.966C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815z" />
                            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z" />
                          </svg>
                        </span>
                      </div>
                      <input
                        onChange={this.handleConfirmPassword}
                        id="confirmPassword"
                        type="password"
                        autoComplete="chrome-off"
                        className="form-control input-field long-field"
                        placeholder="Confirm Password"
                        aria-label="confirm password"
                        aria-describedby="confirmPasswordField" />
                      {confirmPasswordValidation.isCorrect ?
                        null
                        :
                        <small id="confirmPassword" className="form-text">{confirmPasswordValidation.message}</small>
                      }
                    </div>

                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                <button onClick={() => this.createAccount()} type="button" className="btn btn-primary">Create Account</button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export { Signup };