import React, { Component } from 'react';
import './css/home.css'

import { NavBar } from './navbar.jsx';
import { Info } from './info';
import { Business } from './business'
import { Nlp } from './nlp'
import { Technical } from './technicalinfo'
import { Slider } from './slider.jsx'
import { Footer } from './footer'
class Home extends Component {
    state = {}
    render() {
        return (
            <React.Fragment >
                <NavBar />
                <Info />
                <Business />
                <Nlp />
                <Technical />
                <Slider />
                <Footer />
            </React.Fragment>

        );
    }
}

export { Home };