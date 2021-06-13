import React, { Component } from 'react';
import './css/business.css'
import { Carousel } from './carousel.jsx'
class Slider extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div style={{ paddingTop: "20px" }}>
                    <div className="bg" >
                        <h1 className="text-center" style={{ fontFamily: 'Tinos' }}>Know live stats</h1>
                        <hr />
                        <section className="container px-0">
                            <div className="row align-items-center content">

                                <div className="col-lg-6">
                                    <Carousel
                                        id="ss"
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <Carousel id="xx" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export { Slider };