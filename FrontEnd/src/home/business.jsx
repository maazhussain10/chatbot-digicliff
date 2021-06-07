import React, { Component } from 'react';
import assitant from '../images/img7.gif'
import './css/business.css'
class Business extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div style={{ paddingBottom: "20px" }}>
                    <div className="bg" style={{ backgroundColor: "#f8f8f8" }}>
                        <section className="container px-0">
                            <div className="row align-items-center content">

                                <div className="col-lg-6">

                                    <div className="text-center text-black d-lg-block" style={{ fontFamily: 'Tinos' }} id="heading">
                                        <h1 style={{ fontFamily: 'Tinos' }}>Grow your business exponentially</h1>
                                        <p className="font-weight-bold">Handle your clients totally with the bots</p>
                                        <a style={{ fontFamily: 'Tinos' }} className="btn btn-lg btn-primary my-2 my-sm-0 mr-2" href='/login'>explore how</a>
                                    </div>
                                </div>
                                <div className="col-lg-6"><img className="img-fluid" src={assitant} id="mg" alt="" /></div>
                            </div>
                        </section>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export { Business };