import React, { Component } from 'react';
import './css/footer.css'
class Footer extends Component {
    state = {}
    render() {
        return (
            <div style={{ backgroundColor: "#f8f8f8" }}>
                <div className="container">
                    <div className="row pad" style={{ fontFamily: 'Tinos' }}>
                        <div className="col-lg-6 bm-2 " >
                            <h5 className="text-center">Products</h5>
                            <hr />
                            <h6 className="text-center" >Anybot</h6>
                        </div>
                        <div className="col-lg-6 bm-2">
                            <h5 className="text-center">Partners</h5>
                            <hr />
                            <h6 className="text-center" >Digicliff</h6>
                        </div>
                        <div class="social_links">

                            <a href="#">
                                <span class="fa-stack fa-lg fb combo">
                                    <i class="fas fa-circle fa-stack-2x fb  circle"></i>
                                    <i class="fab fa-facebook-f fa-stack-1x icon"></i>
                                </span>
                            </a>
                            <a href="#">
                                <span class="fa-stack fa-lg ig combo">
                                    <i class="fas fa-circle fa-stack-2x ig circle"></i>
                                    <i class="fab fa-stack-1x fa-instagram icon"></i>
                                </span>
                            </a>
                            <a href="#">
                                <span class="fa-stack fa-lg tw combo">
                                    <i class="fas fa-circle fa-stack-2x tw circle"></i>
                                    <i class="fab fa-stack-1x fa-twitter icon"></i>
                                </span>
                            </a>

                        </div>
                        <p class="copyright">© 2020 Copyright: Anybot.com</p>
                    </div>

                </div>

            </div>
        );
    }
}

export { Footer };