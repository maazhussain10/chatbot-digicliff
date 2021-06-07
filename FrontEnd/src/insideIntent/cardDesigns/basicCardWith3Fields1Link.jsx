import React, { Component } from 'react';

class BasicCardWith3Fields1Link extends Component {
    state = {
        cardDetails: {
            cardNo: "2",
            cardName: ['header', 'subHeader', 'details', 'link', 'linkButton'],
            cardValue: {}
        }
    }

    headerChange = (e) => {
        let { cardDetails } = this.state;
        cardDetails.cardValue.header = e.target.value;
        this.setState({ cardDetails: cardDetails });

        let { setCardDetails } = this.props;
        setCardDetails(cardDetails);
    }

    subHeaderChange = (e) => {
        let { cardDetails } = this.state;
        cardDetails.cardValue.subHeader = e.target.value;
        this.setState({ cardDetails: cardDetails });

        let { setCardDetails } = this.props;
        setCardDetails(cardDetails);
    }

    detailsChange = (e) => {
        let { cardDetails } = this.state;
        cardDetails.cardValue.details = e.target.value;
        this.setState({ cardDetails: cardDetails });

        let { setCardDetails } = this.props;
        setCardDetails(cardDetails);
    }

    linkChange = (e) => {
        let { cardDetails } = this.state;
        cardDetails.cardValue.link = e.target.value;
        this.setState({ cardDetails: cardDetails });

        let { setCardDetails } = this.props;
        setCardDetails(cardDetails);
    }

    linkButtonChange = (e) => {
        let { cardDetails } = this.state;
        cardDetails.cardValue.linkButton = e.target.value;
        this.setState({ cardDetails: cardDetails });

        let { setCardDetails } = this.props;
        setCardDetails(cardDetails);
    }
    render() {
        let { inputCard, cardColor, textColor } = this.props;
        return (
            <React.Fragment>
                {inputCard ?
                    <div className="tab-pane fade show" id="v-pills-card2" role="tabpanel" aria-labelledby="v-pills-card2-tab">
                        <div className="card mb-3" style={{ maxWidth: "18rem", backgroundColor: cardColor }}>
                            <div className="card-header">
                                <input
                                    style={{ color: textColor }}
                                    onChange={this.headerChange}
                                    className="input-card"
                                    defaultValue="Header"
                                    type="text" /></div>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <input
                                        style={{ color: textColor }}
                                        onChange={this.subHeaderChange}
                                        className="input-card"
                                        defaultValue="Card SubHeader"
                                        type="text" />
                                </h5>
                                <textarea
                                    style={{ color: textColor }}
                                    onChange={this.detailsChange}
                                    className="card-text input-card cardTextArea"
                                    defaultValue="Some quick example text to build on the Link card title and make up the bulk of the card's content." />
                                <h5 className="card-title">
                                    <input
                                        style={{ color: textColor }}
                                        onChange={this.linkChange}
                                        className="input-card"
                                        defaultValue="Add Link Here"
                                        type="text" />
                                </h5>
                                <h5 className="card-title">
                                    <input
                                        style={{ color: textColor }}
                                        onChange={this.linkButtonChange}
                                        className="input-card"
                                        defaultValue="Give the Link Button"
                                        type="text" />
                                </h5>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="tab-pane fade show" id="v-pills-card2" role="tabpanel" aria-labelledby="v-pills-card2-tab">
                        <div className="card mb-3" style={{ maxWidth: "18rem", backgroundColor: cardColor, color: textColor }}>
                            <div className="card-header">Header</div>
                            <div className="card-body">
                                <h5 className="card-title">Link card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="https://localhost:3000" >This is a Link</a>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>

        );
    }
}

export { BasicCardWith3Fields1Link };