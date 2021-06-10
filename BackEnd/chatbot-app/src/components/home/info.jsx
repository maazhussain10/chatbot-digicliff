import React, { Component } from 'react';
import './css/info.css';
import assitant from '../../assets/images/img5.gif'

class Info extends Component {
    state = {}
    render() {
        return (
            <div className="bg">
                <section className="container px-0">
                    <div className="row align-items-center content">
                        <div className="col-lg-6"><img className="img-fluid" src={assitant} alt="" /></div>
                        <div className="col-lg-6">

                            <div className="text-center text-black d-lg-block" id="heading">
                                <h1 style={{ fontFamily: 'Tinos' }}>Welcome to anybot</h1>
                                <p className="font-weight-light">Don't miss any of your clients</p>
                                <a style={{ fontFamily: 'Tinos' }} className="btn btn-lg btn-primary my-2 my-sm-0 mr-2" href='/login'>get started</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        );
    }
}

export { Info };
