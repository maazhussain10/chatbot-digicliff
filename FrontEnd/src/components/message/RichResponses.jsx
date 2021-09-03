import React, { useContext, useState, useEffect } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cardService from '../../services/card.service.js';
import chipService from '../../services/chip.service.js';
import Navbar from '../common/Navbar';
import CreateCard from './CreateCard';
import CreateChip from './CreateChip';
import ChatBox from '../chatbox/Chatbox';

const RichResponses = (props) => {
  const [cards, setCards] = useState([]);
  const [chips, setChips] = useState([]);
  const [disableCard, setDisableCard] = useState(false);
  const [disableChip, setDisableChip] = useState(false);
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const intentId = sessionStorage.getItem('intent');

  useEffect(() => {
    getCards();
    getChips();
  }, []);

  useEffect(() => {
    if (cards.length === 0 && chips.length !== 0) setDisableCard(true);
    else if (cards.length !== 0 && chips.length === 0) setDisableChip(true);
    else {
      setDisableCard(false);
      setDisableChip(false);
    }
    console.log(disableChip)
  }, [cards, chips]);



  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    let items = [...chips];
    let [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    chipService.update(intentId, undefined, accessToken, setAccessToken, items);
    setChips(items);
  };

  const getActiveClass = (classes, index) => {
    if (index === 0) return classes + "active"
    else return classes
  }

  // GET/UPDATE/DELETE CARDS
  const getCards = async () => {
    try {
      let cardResponse = await cardService.get(intentId, accessToken, setAccessToken);
      console.log(cardResponse.data);
      setCards(cardResponse.data);
    }
    catch (e) {
      console.log(e);
    }
  }

  const updateCard = async () => {
    try {
      await cardService.put(intentId, accessToken, setAccessToken);
      getCards();
    }
    catch (e) {
      console.log(e);
    }
  }

  const deleteCard = async (cardValues) => {
    try {
      await cardService.delete(intentId, cardValues, accessToken, setAccessToken);
      getCards();
    }
    catch (e) {
      console.log(e);
    }
  }

  // GET/UPDATE/DELETE CHIPS
  const getChips = async () => {
    try {
      let chipResponse = await chipService.get(intentId, accessToken, setAccessToken);
      setChips(chipResponse.data);
    }
    catch (e) {
      console.log(e);
    }
  }

  const updateChipValueKeyPress = (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
        updateChip(e.target);
        e.preventDefault();
      }

    }
  }

  const updateChip = async (htmlElement) => {
    try {
      let chipValue = htmlElement.text
      await chipService.put(intentId, chipValue, accessToken, setAccessToken);
      getChips();
    }
    catch (e) {
      console.log(e);
    }
  }

  const deleteChip = async (chipValue) => {
    try {
      console.log(intentId)
      await chipService.delete(intentId, chipValue, accessToken, setAccessToken);
      getChips();
    }
    catch (e) {
      console.log(e);
    }
  }
  return (
    <React.Fragment>
      <Navbar isAuthenticated={props.isAuthenticated} />
      <div className="container">
        <div className="row text-center">
          <div className="col-md-6">
            <CreateCard
              cards={cards}
              setCards={setCards}
              disableCard={disableCard}
            />
          </div>
          <div className="col-md-6">
            <CreateChip
              chips={chips}
              setChips={setChips}
              disableChip={disableChip}
            />
          </div>
        </div>
        <br />
        {/* DISPLAY EXISTING CARDS */}
        <div className="row text-center">
          <div className="col-md-6">
            <div
              id="displayCards"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                {cards.map((card, index) => (
                  <li
                    data-target="#displayCards"
                    data-slide-to={index}
                    className={getActiveClass('', index)}
                  ></li>
                ))}
              </ol>
              <div className="carousel-inner">
                {/* Displays all the cards in the list using map function */}
                {cards.map((card, index) => (
                  <div
                    className={getActiveClass('carousel-item ', index)}
                    id={'card-' + index}
                    data-interval="2000"
                    key={index}
                  >
                    <div
                      className="card text-center"
                      style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
                    >
                      <div
                        className="card-header"
                        style={{ position: 'relative' }}
                      >
                        {card.cardValues.split('|||')[0]}
                        {/* Edit and Delete Buttons for each card*/}
                        <div
                          className="d-flex justify-content-end"
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '3px',
                          }}
                        >
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            {/* Edit */}
                            <button
                              style={{ zIndex: "10" }}
                              type="button"
                              data-toggle="modal"
                              data-target="#updateCard"
                              className="btn btn-sm btn-outline-success"
                            >
                              <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className="bi bi-pencil-square"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                />
                              </svg>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              style={{ zIndex: "10" }}
                              onClick={() => deleteCard(card.cardValues)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className="bi bi-trash-fill"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{card.cardValues.split('|||')[1]}</h5>
                        <p className="card-text">{card.cardValues.split('|||')[2]}</p>
                        <a href={card.cardValues.split('|||')[3]}>{card.cardValues.split('|||')[4]}</a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* buttons shouldnt be removed */}
                <a
                  className="carousel-control-prev carousel-control"
                  href="#displayCards"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next carousel-control"
                  href="#displayCards"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </a>
                {/* end of buttons */}
              </div>
            </div>
          </div>
          {/* DISPLAY EXISTING CHIPS */}
          <div className="col-md-6">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="drag-n-drop">
                {(provided) => (

                  <ul
                    className="list-group drag-n-drop"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* map func for chip starts here */}
                    {chips.map((chip, index) => (
                      <Draggable
                        key={chip.chipValue}
                        draggableId={chip.chipValue}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="list-group-item"
                            key={chip.richresponse_id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 16 16"
                                    className="bi bi-list-ul"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                                    />
                                  </svg>
                                </span>
                              </div>
                              <pre
                                id={chip.chipValue}
                                onKeyDown={updateChipValueKeyPress}
                                style={{ textAlign: 'left' }}
                                contentEditable
                                suppressContentEditableWarning
                                type="text"
                                className="form-control"
                                aria-label="Chip"
                                aria-describedby="basic-addon1"
                              >
                                {' '}
                                {chip.chipValue}
                              </pre>
                              <div className="input-group-prepend">
                                <button
                                  onClick={() =>
                                    deleteChip(chip.chipValue)
                                  }
                                  style={{ zIndex: '0' }}
                                  className="btn btn-outline-danger"
                                  type="button"
                                  id="button-addon1"
                                >
                                  <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 16 16"
                                    className="bi bi-trash-fill"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {/* <button key={index} onClick={() => handleClick(index)} className={getClass(chip.active)}>{chip.chipValue}</button> */}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* ends here */}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
      <ChatBox />
    </React.Fragment>
  );
};

export default RichResponses;
