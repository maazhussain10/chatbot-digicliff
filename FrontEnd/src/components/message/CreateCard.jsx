import React, { useContext, useEffect, useState } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import cardService from '../../services/card.service';

function CardCreation(props) {
  let { setCardDetails, option, inputCard } = props;
  const [cardValues, setCard] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { header: '', subHeader: '', details: '', link: '', linkButton: '' }
  );
  const cardName = ['header', 'subHeader', 'details', 'link', 'linkButton'];

  const setCardValue = (e) => {
      setCard({ [e.target.name]: [e.target.value] });
      setCardDetails(option, cardName, cardValues);
  };

  return (
    <React.Fragment>
      {inputCard ? (
        <div
          className="tab-pane fade show active"
          id="v-pills-card1"
          role="tabpanel"
          aria-labelledby="v-pills-card1-tab"
        >
          <div
            className="card mb-3"
            style={{ maxWidth: '18rem', backgroundColor: '#FFFFFF' }}
          >
            <div className="card-header">
              <input
                style={{ color: '#000000' }}
                onChange={setCardValue}
                name="header"
                value={cardValues.header}
                className="input-card"
                defaultValue="Header"
                type="text"
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">
                <input
                  style={{ color: '#000000' }}
                  onChange={setCardValue}
                  name="subHeader"
                  value={cardValues.subHeader}
                  className="input-card"
                  defaultValue="Dark Card Title"
                  type="text"
                />
              </h5>
              <textarea
                style={{ color: '#000000' }}
                onChange={setCardValue}
                name="details"
                value={cardValues.details}
                className="card-text input-card cardTextArea"
                defaultValue="Some quick example text to build on the card title and make up the bulk of the card's content."
              />
              {option === '4' ? (
                <div>
                  <h5 className="card-title">
                    <input
                      style={{ color: '#000000' }}
                      onChange={setCardValue}
                      name="link"
                      value={cardValues.link}
                      className="input-card"
                      defaultValue="Add Link Here"
                      type="text"
                    />
                  </h5>
                  <h5 className="card-title">
                    <input
                      style={{ color: '#000000' }}
                      onChange={setCardValue}
                      name="linkButton"
                      value={cardValues.linkButton}
                      className="input-card"
                      defaultValue="Give the Link Button"
                      type="text"
                    />
                  </h5>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="tab-pane fade show active"
          id="v-pills-card1"
          role="tabpanel"
          aria-labelledby="v-pills-card1-tab"
        >
          <div
            className="card mb-3"
            style={{
              maxWidth: '18rem',
              backgroundColor: '#FFFFFF',
              color: '#000000',
            }}
          >
            <div className="card-header">Header</div>
            <div className="card-body">
              <h5 className="card-title">Dark card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              {option === '4' ? <a href="/">This is a Link</a> : null}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

const CreateCard = (props) => {
  const [inputCard, setInputCard] = useState(false);
  const [cardDetails, setCard] = useState([]);
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);

  useEffect(() => {
    props.getExistingCards;
  }, [input]);

  const insertCard = () => {
    setInputCard(true);
  };

  const setCardDetails = (cardDetails) => {
    setCard(cardDetails);
  };

  const createCard = async () => {
    let intentId = sessionStorage.getItem('intent');
    let { cardType, cardFields, cardValues } = cardDetails;
    let useQuery = document.getElementById('useQueryCard').checked;

    try {
      await cardService.create(
        intentId,
        cardDetails,
        useQuery,
        accessToken,
        setAccessToken
      );
      props.getExistingCards;
      props.disable;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#createCard"
        disabled={props.disableCard}
      >
        Add card
      </button>
      <div
        className="modal fade"
        id="createCard"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title " id="exampleModalLabel">
                Card
              </h5>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col-3">
                    <div
                      className="nav flex-column nav-pills"
                      id="v-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <a
                        className="nav-link active"
                        id="v-pills-card1-tab"
                        data-toggle="pill"
                        href="#v-pills-card1"
                        role="tab"
                        aria-controls="v-pills-card1"
                        aria-selected="true"
                      >
                        Basic - 3 Fields
                      </a>
                      <a
                        className="nav-link"
                        id="v-pills-card2-tab"
                        data-toggle="pill"
                        href="#v-pills-card2"
                        role="tab"
                        aria-controls="v-pills-card2"
                        aria-selected="false"
                      >
                        {' '}
                        Basic - 4 Fields
                      </a>
                      {/* <a className="nav-link" id="v-pills-card3-tab" data-toggle="pill" href="#v-pills-card3" role="tab" aria-controls="v-pills-card3" aria-selected="false">Star Card</a> */}
                    </div>
                  </div>
                  <div className="col-9 d-flex justify-content-center">
                    {/* Start of Ternary operator */}
                    <div
                      onClick={() => insertCard()}
                      className="tab-content"
                      id="v-pills-tabContent"
                    >
                      <div
                        className="tab-pane fade"
                        id="v-pills-card3"
                        role="tabpanel"
                        aria-labelledby="v-pills-card3-tab"
                      >
                        ...
                      </div>
                      <CardCreation
                        option="3"
                        inputCard={inputCard}
                        setCardDetails={setCardDetails}
                      />
                      <CardCreation
                        option="4"
                        inputCard={inputCard}
                        setCardDetails={setCardDetails}
                      />
                    </div>
                    {/* End of Ternary Operator */}
                  </div>
                </div>
              </div>
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="useQueryCard"
                />
                <label className="custom-control-label" htmlFor="useQueryCard">
                  Use Query
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={() => createCard()}
                type="button"
                className="btn btn-primary"
              >
                Create Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateCard;
