import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Cards extends Component {
    state = {}

    getActiveClass = (classes, index) => {
        if (index === 0) return classes + "active"
        else return classes
    }

    render() {
        let cards = [];
        const { cardsMessage, cardTheme } = this.props;
        console.log(cardsMessage);
        if (!cardsMessage) {
            let temp={
                  username: 'Zaam',
                  assistant: 'Hello',
                  intent: 'Welcome',
                  useQuery: 'false',
                  cardNo: 1,
                  cardName: [ 'header', 'subHeader', 'details' ],
                  cardValue: [ 'Header', 'SubHeader', 'Details' ],
                  lastModifed: '2021-06-12T12:27:33.000Z'
                }
            cards.push(temp)
        }
        else {
            cards = cardsMessage;
        }
        console.log(cards);
        const {
            cardBgColor,
            cardTextColor,
            cardBorder,
            cardFont, } = cardTheme;
        return (
            <div id="chatboxCards" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    {cards.map((card, index) => (
                        <li data-target="#chatboxCards" data-slide-to={index} className={this.getActiveClass("", index)}></li>
                    ))}
                </ol>
                <div className="carousel-inner">
                    {/* map func starts here */}
                    {cards.map((card, index) => (
                        <div className={this.getActiveClass("carousel-item ", index)} key={index} >
                            <div
                                className="card text-center"
                                style={{ fontFamily: cardFont, border: `2px solid ${cardBorder}`, backgroundColor: cardBgColor, color: cardTextColor, width: "18rem" }}
                            >
                                <div className="card-header">{card.cardValue[0]}</div>
                                <div className="card-body">
                                    <h5 className="card-title">{card.cardValue[1]}</h5>
                                    <p className="card-text">{card.cardValue[2]}</p>
                                    <a href={card.cardValue[3]} >{card.cardValue[4]}</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* buttons shouldnt be removed */}
                <a className="carousel-control-prev" href="#chatboxCards" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#chatboxCards" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
                {/* end of buttons */}
            </div>
        )
    }
}
export { Cards };

