import React from 'react';

const Card = (props) => {
  const { cards, theme } = props;
  const { cardBgColor, cardTextColor, cardBorder, cardFont } = theme;
  const getActiveClass = (classes, index) => {
    if (index === 0) return classes + 'active';
    else return classes;
  };
  return (
    <div id="chatboxCards" className="carousel slide" data-ride="carousel">
      {/* <ol className="carousel-indicators">
                {cards.map((card, index) => (
                    <li data-target="#chatboxCards" data-slide-to={index} className={getActiveClass("", index)}></li>
                ))}
            </ol> */}
      <div className="carousel-inner">
        {/* map func starts here */}
        {cards.map((card, index) => (
          <div className={getActiveClass('carousel-item ', index)} key={index}>
            <div
              className="card text-center"
              style={{
                fontFamily: cardFont,
                border: `2px solid ${cardBorder}`,
                backgroundColor: cardBgColor,
                color: cardTextColor,
                width: '15rem',
              }}
            >
              <div className="card-header">{card.split('|||')[0]}</div>
              <div className="card-body">
                <h5 className="card-title">{card.split('|||')[1]}</h5>
                <p className="card-text">{card.split('|||')[2]}</p>
                <a href={card.split('|||')[3]}>{card.split('|||')[4]}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* buttons shouldnt be removed */}
      <a
        className="carousel-control-prev"
        href="#chatboxCards"
        role="button"
        data-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#chatboxCards"
        role="button"
        data-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
      {/* end of buttons */}
    </div>
  );
};

export default Card;
