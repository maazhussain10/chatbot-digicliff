import React, { Component } from 'react';
import img1 from '../../assets/images/img14.jpg'
import img2 from '../../assets/images/img13.jpg'
import img3 from '../../assets/images/img16.jpg'

class Carousel extends Component {
    state = {
        id: "#" + this.props.id,
        normal: "carouselExampleFade"
    }
    render() {

        return (
            <React.Fragment >
                <div>
                    <div className="container">

                        <div id={this.props.id} className="carousel slide shadow p-3 mb-5 bg-white rounded" data-ride="carousel">
                            <ol className="carousel-indicators">
                                <li data-target={this.state.id} data-slide-to="0" className="active"></li>
                                <li data-target={this.state.id} data-slide-to="1"></li>
                                <li data-target={this.state.id} data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active" data-interval="2000">
                                    <img src={img1} className="d-block w-100" alt="..." />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>First slide label</h5>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                    </div>
                                </div>
                                <div className="carousel-item" data-interval="1000">
                                    <img src={img2} className="d-block w-100" alt="..." />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>Second slide label</h5>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    </div>
                                </div>
                                <div className="carousel-item" data-interval="2000">
                                    <img src={img3} className="d-block w-100" alt="..." />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>Third slide label</h5>
                                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                    </div>
                                </div>
                            </div>
                            <a className="carousel-control-prev" href={this.state.id} role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href={this.state.id} role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>

                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export { Carousel };