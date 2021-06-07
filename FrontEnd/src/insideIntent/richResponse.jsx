import React, { Component } from 'react';
import { Entity } from './entity'
import { RunQuery } from './runQueries'
import { CreateCards } from './createCards'
import { CreateChip } from './createChip'
import axios from 'axios';
import { ChatBox } from '../chatbox/chatbox';
import { RichResponseNavBar } from './richResponseNavbar';
import $ from 'jquery';
import './css/buttonalign.css'


class Rich extends Component {
    state = {
        chips: [],
        cards: [],
        cardColor: "#000000",
        textColor: "#ffffff",
    }


    getExistingChips = () => {
        let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/getchips',
                params: {
                    intentId: intentId
                },

            }).then((response) => {
                this.setState({ chips: response.data });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    deleteChip = (richResponseId) => {
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/chip-delete',
                params: {
                    richResponseId: richResponseId
                },

            }).then((response) => {
                this.getExistingChips();
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    updateChipValueKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                this.updateChip(e.target);
                e.preventDefault();
            }

        }
    }

    updateChip = (htmlElement) => {
        let chipValue = htmlElement.textContent;
        let richResponseId = htmlElement.id;
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/chip-update',
                params: {
                    chipResponse: chipValue,
                    richResponseId: richResponseId
                },

            }).then((response) => {
                this.getExistingChips();
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    getExistingCards = () => {
        try {
            let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));
            axios({
                method: 'get',
                url: 'http://localhost:5000/getcards',
                params: {
                    intentId: intentId
                },

            }).then((response) => {
                let { allCards, cardColor, textColor } = response.data;
                console.log("Cards:", allCards)
                this.setState({ cards: allCards, cardColor: cardColor, textColor: textColor });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    // Called when the delete button is clicked in Card.
    deleteCard = (richResponseId, index) => {

        try {
            // Sends a request to the express server ( richresponses.js) to delete card in database. 
            axios({
                method: 'get',
                url: 'http://localhost:5000/card-delete',
                params: {
                    richResponseId: richResponseId
                },

            }).then((response) => {
                // Calls getExistingCards function to update the cards in the intent after deletion.
                console.log("From Delete Card");
                this.getExistingCards();
                let { cards } = this.state;
                if (index === cards.length - 1) {
                    $('#card-' + (index - 1)).addClass('active');
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    getActiveClass = (classes, index) => {
        if (index === 0) return classes + "active"
        else return classes
    }

    getCardTheme = () => {
        let { cardColor, textColor } = this.state;
        console.log(cardColor, textColor);
        return { cardColor: cardColor, textColor: textColor };
    }

    render() {
        // Get the necessary details ( userName, assistantName, intentName )
        let { assistantId, assistantName, description } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { chips, cards, cardColor, textColor } = this.state;
        return (
            <React.Fragment>
                <RichResponseNavBar />
                <Entity />
                <RunQuery />
                <br />
                <br />
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-6">
                            <CreateCards
                                cardColor={cardColor}
                                textColor={textColor}
                                getExistingCards={this.getExistingCards}
                                getCardTheme={this.getCardTheme} />
                        </div>
                        <div className="col-md-6">
                            <CreateChip
                                getExistingChips={this.getExistingChips} />
                        </div>
                    </div>
                    <br />
                    <div className="row text-center">
                        <div className="col-md-6">
                            <div id="displayCards" className="carousel slide" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    {cards.map((card, index) => (
                                        <li data-target="#displayCards" data-slide-to={index} className={this.getActiveClass("", index)}></li>
                                    ))}
                                </ol>
                                <div className="carousel-inner">
                                    {/* Displays all the cards in the list using map function */}
                                    {cards.map((card, index) => (
                                        <div className={this.getActiveClass("carousel-item ", index)} id={"card-" + index} data-interval="2000" key={index} >
                                            <div className="card text-center" style={{ backgroundColor: cardColor, color: textColor }}>
                                                <div className="card-header" style={{ position: "relative" }}>
                                                    {card[0].card_value}
                                                    {/* Edit and Delete Buttons for each card*/}
                                                    <div className="d-flex justify-content-end" style={{ position: "absolute", top: "8px", right: "3px" }}>
                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                            {/* Edit */}
                                                            <button type="button" data-toggle="modal" data-target="#updateCard" className="btn btn-sm btn-outline-success">
                                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                                </svg>
                                                            </button>

                                                            {/* Delete */}
                                                            <button type="button" onClick={() => this.deleteCard(card[0].richresponse_id, index)} className="btn btn-sm btn-outline-danger">
                                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{card[1].card_value}</h5>
                                                    <p className="card-text">{card[2].card_value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* buttons shouldnt be removed */}
                                    <a className="carousel-control-prev carousel-control" href="#displayCards" role="button" data-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                    <a className="carousel-control-next carousel-control" href="#displayCards" role="button" data-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                    {/* end of buttons */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <ul className="list-group">
                                {/* map func for chip sarts here */}
                                {chips.map((chip) => (
                                    <li className="list-group-item" key={chip.richresponse_id}>
                                        {/* <div className="m-option" style={{ float: "right" }}>
                                        <button className="s-box">Chip</button>
                                    </div> */}
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-list-ul" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <pre
                                                id={chip.richresponse_id}
                                                onKeyDown={this.updateChipValueKeyPress}
                                                style={{ textAlign: "left" }}
                                                contentEditable
                                                suppressContentEditableWarning
                                                type="text"
                                                className="form-control"
                                                aria-label="Chip"
                                                aria-describedby="basic-addon1" > {chip.chip_value}</pre>
                                            <div className="input-group-prepend">
                                                <button onClick={() => this.deleteChip(chip.richresponse_id)} style={{ zIndex: "0" }} className="btn btn-outline-danger" type="button" id="button-addon1"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                                </svg></button>
                                            </div>
                                        </div>
                                        {/* <button key={index} onClick={() => this.handleClick(index)} className={this.getClass(chip.active)}>{chip.chip_value}</button> */}
                                    </li>
                                ))}

                                {/* ends here */}
                            </ul>
                        </div>
                    </div>

                </div>

                <ChatBox
                    assistantId={assistantId}
                    assistantName={assistantName}
                    description={description} />

            </React.Fragment >
        );
    }
}

export { Rich };