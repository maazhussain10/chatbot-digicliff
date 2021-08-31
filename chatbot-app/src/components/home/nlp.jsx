import React, { Component } from 'react';
import assistant from '../../assets/images/img10.gif'
class Nlp extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className="bg" style={{ paddingBottom: "50px" }}>
                    <section className="container px-0">
                        <div className="row align-items-center content">
                            <div className="col-lg-6"><img className="img-fluid" src={assistant} alt="" /></div>

                            <div className="col-lg-6">
                                <div className="text-center text-black d-lg-block" style={{ fontFamily: 'Tinos' }} id="heading">
                                    <p className="font-weight-bold">Best AI</p>
                                    <p className="font-weight-bolder">Best NLP</p>
                                    <p className="font-weight-normal">Quick Creation</p>
                                    <p className="font-weight-light">Handle Bots</p>
                                    <p className="font-weight-lighter">Integrate Bots</p>
                                    <p className="font-italic">See Statistics</p>
                                    <a className="btn btn-lg btn-primary my-2 my-sm-0 mr-2" href='/login'>Try it out!</a>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

            </React.Fragment>
        );
    }
}

export { Nlp };