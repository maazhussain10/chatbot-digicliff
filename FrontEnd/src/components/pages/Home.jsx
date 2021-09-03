import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../common/Navbar';

// Images
import robotCheckingData from '../../assets/images/robotCheckingData.gif'
import barChart from '../../assets/images/barChart.gif'
import rocket from '../../assets/images/rocket.gif'
import wavingRobot from '../../assets/images/wavingRobot.gif'
import hoveringRobot from '../../assets/images/hoveringRobot.gif'
import flyingRobot from '../../assets/images/flyingRobot.gif'
import tent from '../../assets/images/tent.jpg'
import tent2 from '../../assets/images/tent2.jpg'
import camp from '../../assets/images/camp.jpg'

// css
import './css/home.css';
import authService from '../../services/auth.service.js';
import { AccessTokenContext } from '../../accessTokenContext';

const Card = (props) => {
    return (
        <div className="col-lg-4 bm-2">
            <div className="card shadow p-3 mb-5 bg-white rounded">
                <img className="card-img-top" src={props.img} alt="..."></img>
                <div className="card-body" >
                    <h5 className="card-title" style={{ fontFamily: 'Tinos' }}>{props.title}</h5>
                    <p className="card-text" style={{ fontFamily: 'Tinos' }}>{props.text}</p>
                </div>
            </div>
        </div>
    )
}

const Carousel = (props) => {
    return (
        <div className="container">
            <div id={props.id} className="carousel slide shadow p-3 mb-5 bg-white rounded" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target={'#' + props.id} data-slide-to="0" className="active"></li>
                    <li data-target={'#' + props.id} data-slide-to="1"></li>
                    <li data-target={'#' + props.id} data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active" data-interval="3000">
                        <img src={tent} className="d-block w-100" alt="..." />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </div>
                    </div>
                    <div className="carousel-item" data-interval="3000">
                        <img src={tent2} className="d-block w-100" alt="..." />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <div className="carousel-item" data-interval="3000">
                        <img src={camp} className="d-block w-100" alt="..." />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Third slide label</h5>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href={'#' + props.id} role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href={'#' + props.id} role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>
    )
}

const Home = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(async () => {
        if (isAuthenticated === false) {
            const response = await authService.verifyAccessToken(accessToken, setAccessToken);
            if (response.status === 200)
                setIsAuthenticated(true);
        }
    }, []);
    return (
        <React.Fragment>
            <Navbar isAuthenticated={isAuthenticated} {...props}>
                <li className="nav-item">
                    <a href="/explore" className="nav-link" style={{ marginRight: "50px" }}>Explore</a>
                </li>
            </Navbar >
            {/* Welcome Section */}
            <div className="bg">
                <section className="container px-0">
                    <div className="row align-items-center content">
                        <div className="col-lg-6"><img className="img-fluid" src={robotCheckingData} alt="" /></div>
                        <div className="col-lg-6">

                            <div className="text-center text-black d-lg-block" id="heading">
                                <h1 style={{ fontFamily: 'Tinos' }}>Welcome to Companion</h1>
                                <p className="font-weight-light">Don't miss any of your clients</p>
                                <a style={{ fontFamily: 'Tinos' }} className="btn btn-lg btn-primary my-2 my-sm-0 mr-2" href='/login'>Get started!</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {/* Business Section */}
            <div style={{ paddingBottom: "20px" }}>
                <div className="bg" style={{ backgroundColor: "#f8f8f8" }}>
                    <section className="container px-0">
                        <div className="row align-items-center content">

                            <div className="col-lg-6">

                                <div className="text-center text-black d-lg-block" style={{ fontFamily: 'Tinos' }} id="heading">
                                    <h1 style={{ fontFamily: 'Tinos' }}>Grow your business exponentially</h1>
                                    <p className="font-weight-bold">Handle your clients with zero human contact!</p>
                                    <a style={{ fontFamily: 'Tinos' }} className="btn btn-lg btn-primary my-2 my-sm-0 mr-2" href='/login'>Explore how</a>
                                </div>
                            </div>
                            <div className="col-lg-6"><img className="img-fluid" src={barChart} id="mg" alt="" /></div>
                        </div>
                    </section>
                </div>
            </div>
            {/* NLP Section */}
            <div className="bg" style={{ paddingBottom: "50px" }}>
                <section className="container px-0">
                    <div className="row align-items-center content">
                        <div className="col-lg-6"><img className="img-fluid" src={rocket} alt="" /></div>
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
            {/* Technical Section */}
            <section id="gallery" style={{ backgroundColor: "#f8f8f8" }}>
                <div className="container">
                    <h1 className="text-center" style={{ fontFamily: 'Tinos' }}>Why you should choose anybot?</h1>
                    <hr />
                    <div className="row">
                        <Card
                            img={wavingRobot}
                            title="Dialogues"
                            text="Teach your bot to speak and to interact, By going into Dialogues and adding User Messages and Bot replies."
                        />
                        <Card
                            img={flyingRobot}
                            title="Database connection"
                            text="You can connect to your own database and obtain data from it whenever needed by running queries."
                        />
                        <Card
                            img={hoveringRobot}
                            title="Integrations"
                            text="Deploy your Bot across various social platforms easily without
                                        any difficulties with our Anybot."
                        />
                    </div>
                </div>
            </section>

            {/* Slider */}
            <div style={{ paddingTop: "20px" }}>
                <div className="bg" >
                    <h1 className="text-center" style={{ fontFamily: 'Tinos' }}>Know live stats</h1>
                    <hr />
                    <section className="container px-0">
                        <div className="row align-items-center content">
                            <div className="col-lg-6">
                                <Carousel id="firstSlider" />
                            </div>
                            <div className="col-lg-6">
                                <Carousel id="secondSlider" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {/* Footer */}
            <div style={{ backgroundColor: "#f8f8f8" }}>
                <div className="container">
                    <div className="row pad" style={{ fontFamily: 'Tinos' }}>
                        <div className="col-lg-6 bm-2 " >
                            <h5 className="text-center">Products</h5>
                            <hr />
                            <h6 className="text-center" >Companion</h6>
                        </div>
                        <div className="col-lg-6 bm-2">
                            <h5 className="text-center">Partners</h5>
                            <hr />
                            <h6 className="text-center" >Digicliff</h6>
                        </div>
                        <div className="social_links">
                            <a href="#">
                                <span className="fa-stack fa-lg fb combo">
                                    <i className="fas fa-circle fa-stack-2x fb  circle"></i>
                                    <i className="fab fa-facebook-f fa-stack-1x icon"></i>
                                </span>
                            </a>
                            <a href="#">
                                <span className="fa-stack fa-lg ig combo">
                                    <i className="fas fa-circle fa-stack-2x ig circle"></i>
                                    <i className="fab fa-stack-1x fa-instagram icon"></i>
                                </span>
                            </a>
                            <a href="#">
                                <span className="fa-stack fa-lg tw combo">
                                    <i className="fas fa-circle fa-stack-2x tw circle"></i>
                                    <i className="fab fa-stack-1x fa-twitter icon"></i>
                                </span>
                            </a>

                        </div>
                        <p className="copyright">© 2020 Copyright: Companion.com</p>
                    </div>

                </div>

            </div>
        </React.Fragment>
    )
}

export default Home;