import React, { Component } from 'react';
import './css/footer.css'
class Footer extends Component {
    state = {}
    render() {
        return (
            <div style={{ backgroundColor: "#f8f8f8" }}>
                <div className="container">
                    <div className="row pad">
                        <div className="col-lg-4 bm-2 " style={{ fontFamily: 'Tinos' }}>
                            <h5 className="text-center">Products</h5>
                            <hr />
                            <h6 className="text-center" >Anybot</h6>
                        </div>
                        <div className="col-lg-4 bm-2" style={{ fontFamily: 'Tinos' }}>
                            <h5 className="text-center">Partners</h5>
                            <hr />
                            <h6 className="text-center" >Digicliff</h6>
                        </div>
                        <div className="col-lg-4 bm-2 text-center" style={{ fontFamily: 'Tinos' }}>
                            <h5 className="text-center">Developers</h5>
                            <hr />
                            <h6>Prajeshwar Varadharajan</h6>
                            <h6>(Professional FrontEnd Developer)</h6>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export { Footer };