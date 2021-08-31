import React, { Component } from 'react';
import axios from 'axios';
import './css/buttonalign.css'
import { BasicCardWith3Fields } from './cardDesigns/basicCardWith3Fields';
import { BasicCardWith3Fields1Link } from './cardDesigns/basicCardWith3Fields1Link';
import URL from '../../websiteURL';

class CreateCards extends Component {
    state = {
        color: false,
        inputCard: false,
        cardDetails: {
            cardNo: undefined,
            cardName: [],
            cardValue: []
        },
    }

    componentDidMount = () => {
        let { getExistingCards } = this.props;
        getExistingCards();

    }


    insertCard = () => {
        this.setState({ inputCard: true })
    }

    setCardDetails = (cardDetails) => {
        this.setState({ cardDetails: cardDetails })
    }

    createCard = () => {
        const { cardDetails } = this.state


        // Get the necessary details ( userName, assistantName, intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));

        let { cardNo, cardName, cardValue } = cardDetails;
        let useQuery = document.getElementById('useQueryCard').checked;

        try {
            axios({
                method: 'post',
                url: 'http://' + URL + ':5000/card',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    useQuery: useQuery,
                    cardNo: cardNo,
                    cardName: cardName,
                    cardValue: cardValue,
                },

            }).then((response) => {
                const { getExistingCards, disable } = this.props
                getExistingCards();
                disable();
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        let { inputCard } = this.state;
        return (
            <React.Fragment>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createCard" disabled={this.props.disableCard}>
                    Add card
                </button>
                <div className="modal fade" id="createCard" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title " id="exampleModalLabel">Card</h5>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                <a className="nav-link active" id="v-pills-card1-tab" data-toggle="pill" href="#v-pills-card1" role="tab" aria-controls="v-pills-card1" aria-selected="true">Basic - 3 Fields</a>
                                                <a className="nav-link" id="v-pills-card2-tab" data-toggle="pill" href="#v-pills-card2" role="tab" aria-controls="v-pills-card2" aria-selected="false"> Basic - 4 Fields</a>
                                                {/* <a className="nav-link" id="v-pills-card3-tab" data-toggle="pill" href="#v-pills-card3" role="tab" aria-controls="v-pills-card3" aria-selected="false">Star Card</a> */}
                                            </div>
                                        </div>
                                        <div className="col-9 d-flex justify-content-center">
                                            {/* Start of Ternary operator */}
                                            <div onClick={() => this.insertCard()} className="tab-content" id="v-pills-tabContent">
                                                <div className="tab-pane fade" id="v-pills-card3" role="tabpanel" aria-labelledby="v-pills-card3-tab">...</div>
                                                <BasicCardWith3Fields
                                                    textColor="#000000"
                                                    cardColor="#ffffff"
                                                    inputCard={inputCard}
                                                    setCardDetails={this.setCardDetails} />
                                                <BasicCardWith3Fields1Link
                                                    textColor="#000000"
                                                    cardColor="#ffffff"
                                                    inputCard={inputCard}
                                                    setCardDetails={this.setCardDetails} />

                                            </div>
                                            {/* End of Ternary Operator */}
                                        </div>
                                    </div>
                                </div>
                                <div className="custom-control custom-switch">
                                    <input type="checkbox" className="custom-control-input" id="useQueryCard" />
                                    <label className="custom-control-label" htmlFor="useQueryCard">Use Query</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                                <button onClick={() => this.createCard()} type="button" className="btn btn-primary">Create Card</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export { CreateCards };

