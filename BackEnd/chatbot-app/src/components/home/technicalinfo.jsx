import React, { Component } from 'react';
import img1 from '../../assets/images/img3.gif'
import img2 from '../../assets/images/img11.gif'
import img3 from '../../assets/images/img12.gif'
import './css/technical.css'
class Technical extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <section id="gallery" style={{ backgroundColor: "#f8f8f8" }}>
                    <div className="container">
                        <h1 className="text-center" style={{ fontFamily: 'Tinos' }}>Why you should choose anybot?</h1>
                        <hr />
                        <div className="row">
                            <div className="col-lg-4 bm-2">
                                <div className="card shadow p-3 mb-5 bg-white rounded">
                                    <img className="card-img-top" src={img1} alt="..."></img>
                                    <div className="card-body" >
                                        <h5 className="card-title" style={{ fontFamily: 'Tinos' }}>Dialogues</h5>
                                        <p className="card-text" style={{ fontFamily: 'Tinos' }}>Teach your bot to speak and to interact, By going into Dialogues
                                         and adding User Messages and Bot replies.</p>
                                        {/* <a className="btn btn-outline-success btn-sm" href="/#">Download</a>
                                        <a className="btn btn-outline-danger btn-sm" href="/#"><i className="far fa-heart"></i></a> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 bm-2">
                                <div className="card shadow p-3 mb-5 bg-white rounded">
                                    <img className="card-img-top" src={img3} alt="..."></img>
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontFamily: 'Tinos' }}>Database connection</h5>
                                        <p className="card-text" style={{ fontFamily: 'Tinos' }}>You can connect to your own database and obtain data from it whenever needed by running queries.</p>
                                        {/* <a className="btn btn-outline-success btn-sm" href="/#">Download</a>
                                        <a className="btn btn-outline-danger btn-sm" href="/#"><i className="far fa-heart"></i></a> */}
                                    </div>
                                </div>
                            </div><div className="col-lg-4 bm-2">
                                <div className="card shadow p-3 mb-5 bg-white rounded">
                                    <img className="card-img-top" src={img2} alt="..."></img>
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ fontFamily: 'Tinos' }}>Integrations</h5>
                                        <p className="card-text" style={{ fontFamily: 'Tinos' }}>Deploy your Bot across various social platforms easily without
                                         any difficulties with our Anybot.</p>
                                        {/* <a className="btn btn-outline-success btn-sm" href="/#">Download</a>
                                        <a className="btn btn-outline-danger btn-sm" href="/#"><i className="far fa-heart"></i></a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export { Technical };