import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Cards extends Component {
    state = {}

    getActiveClass = (classes, index) => {
        if (index === 0) return classes + "active"
        else return classes
    }

    render() {
        const { cards, cardTheme } = this.props;
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
                                <div className="card-header">{card[0].card_value}</div>
                                <div className="card-body">
                                    <h5 className="card-title">{card[1].card_value}</h5>
                                    <p className="card-text">{card[2].card_value}</p>
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

