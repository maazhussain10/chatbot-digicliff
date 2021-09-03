import React, { useContext, useEffect, useState, useReducer } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import cardService from '../../services/card.service.js';
import './css/card.css';

function CardCreation(props) {
  let { inputCard, card } = props;

  const handleChange = (e) => {
    props.setCardValues({ [e.target.name]: [e.target.value] });
  };

  return (
    <React.Fragment>
      {inputCard ? (
        <div
          className={"tab-pane fade " + (props.active ? "show active" : "")}
          id={card}
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
                onChange={handleChange}
                name="header"
                value={props.cardValues.header}
                className="input-card"
                type="text"
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">
                <input
                  style={{ color: '#000000' }}
                  onChange={handleChange}
                  name="subHeader"
                  value={props.cardValues.subHeader}
                  className="input-card"
                  type="text"
                />
              </h5>
              <textarea
                style={{ color: '#000000' }}
                onChange={handleChange}
                name="details"
                value={props.cardValues.details}
                className="card-text input-card cardTextArea"
              />
              {props.option === '5' ? (
                <div>
                  <h5 className="card-title">
                    <input
                      style={{ color: '#000000' }}
                      onChange={handleChange}
                      name="link"
                      value={props.cardValues.link}
                      className="input-card"
                      type="text"
                    />
                  </h5>
                  <h5 className="card-title">
                    <input
                      style={{ color: '#000000' }}
                      onChange={handleChange}
                      name="linkButton"
                      value={props.cardValues.linkButton}
                      className="input-card"
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
              {props.option === '5' ? <a href="/">This is a Link</a> : null}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

const CreateCard = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [inputCard, setInputCard] = useState(false);
  const [option, setOption] = useState("3");


  const [cardValues, setCardValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { header: '', subHeader: '', details: '', link: '', linkButton: '' }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let intentId = sessionStorage.getItem('intent');
    let useQuery = document.getElementById('useQueryCard').checked;

    try {
      let response = await cardService.create(
        intentId,
        { option, cardValues },
        useQuery,
        accessToken,
        setAccessToken
      );
      if (response.status === 201) {
        props.setCards([...props.cards, response.data])
        setCardValues({ header: '', subHeader: '', details: '', link: '', linkButton: '' })
        setInputCard(false);
      }


    } catch (e) {
      console.log(e);
    }

  }
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
          <form onSubmit={handleSubmit} className="modal-content">
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
                        onClick={() => setOption("3")}
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
                        onClick={() => setOption("5")}

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
                      onClick={() => setInputCard(true)}
                      className="tab-content"
                      id="v-pills-tabContent"
                    >

                      <CardCreation
                        active={true}
                        inputCard={inputCard}
                        card="v-pills-card1"
                        option={option}
                        cardValues={cardValues}
                        setCardValues={setCardValues}
                        handleSubmit={handleSubmit}
                      />
                      <div
                        className="tab-pane fade s"
                        id="v-pills-card3"
                        role="tabpanel"
                        aria-labelledby="v-pills-card3-tab"
                      >
                        ...
                      </div>
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
                type="submit"
                className="btn btn-primary"
              >
                Create Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateCard;
