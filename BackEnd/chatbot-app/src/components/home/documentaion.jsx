import React, { Component } from 'react';
class Documentation extends Component {
    state = {
        isVisible: false
    }


    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ fontFamily: 'Tinos' }}>
                    <nav id="docs" className="navbar navbar-light bg-light container sticky-top shadow-sm p-3 rounded">
                        <a className="navbar-brand" href="/#">AnyBot</a>
                        <ul className="nav nav-pills">

                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">AI</span>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#ai">AI</a>
                                    <a className="dropdown-item" href="#nlp">NLP</a>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#three">three</a>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Assistant</span>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#Assistant">Assistant</a>
                                    <a className="dropdown-item" href="#dialogue">Dialogues</a>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#rich">Rich Response</a>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#entity">Entity</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#dbconnection">Database</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#statistics">Stats</a>
                            </li>
                        </ul>
                    </nav>
                    <div style={{ marginBottom: "none", paddingBottom: "none" }} className="container shadow pl-5 pr-5 " data-spy="scroll" data-target="#docs" data-offset="0">
                        <br />
                        <br />
                        <h4 id="ai">AI</h4>
                        <p className="pl-2 pr-2">Machine learning technology focuses on problem solving and allows virtual assistants to improve the types of responses and interactions they have.</p>

                        <hr />
                        <br />
                        <h4 id="nlp">NATURAL LANGUAGE PROCESSING</h4>
                        <p className="pl-2 pr-2">Natural language processing focuses on language analysis, which can help assistants <strong>better interpret</strong> what users are looking for and identify the right knowledge to deliver</p>
                        <hr />
                        <br />
                        <h4 id="Assistant">ASSISTANT</h4>
                        <p className="pl-2 pr-2"> Assistants can be created with the API and can be deployed. </p>
                        <div className="pl-4 pr-4">
                            <h6 className="pt-2">CREATING AN ASSISTANT</h6>
                            <ol>
                                <li>Enter your Assistant's name and enter description which illustrates the best about your Assistant.</li>
                                <li>Click the <strong>CREATE</strong> button.</li>

                            </ol>
                            <p className="pl-2 pr-2"> After following the above mentioned steps, you should be seeing your Assistant along with it's illustration below.</p>
                        </div>
                        <div className="pl-4 pr-4">
                            <h6 className="pt-2">INTENT </h6>
                            <p className="pl-2 pr-2">An intent is the user’s intention. For example, if a user types "<strong>show me yesterday’s financial news</strong>", the user’s intent is to retrieve a list of financial headlines. Intents are given a name, often a verb and a noun, such as “<strong>show-news</strong>”. Creating intent is very much similiar like creating Assistant. Once you have created intents for your assistant start building your assistant with user and assistant replies</p>
                        </div>
                        <hr />
                        <br />
                        <h4 id="dialogue">DIALOGUES</h4>
                        <p className="pl-2 pr-2">Click on the <strong>Add training phrase/response</strong> button and enter the response and click add. Following this, you will be able to see the responses, below.</p>
                        <div className="pl-4 pr-4">
                            <h6 className="pt-2">USER RESPONSE</h6>
                            <p className="pl-2 pr-2">User responses teaches our assistant to learn what users might say to match the intent. The more examples you provide, the higher likelihood the intent will be matched correctly.  </p>
                            <h6 className="pt-2">ASSISTANT RESPONSE</h6>
                            <p className="pl-2 pr-2">Anything the assistant says in response to user input. If you have to specific data to encrypt in the assistants response, click on <a className="" href="#dbconnection"><strong>Database</strong></a> and refer the following</p>

                        </div>
                        <p className="pl-2 pr-2">Once you have built your assistant with user replies and assistant replies, click the <strong>TRAIN</strong> button at the top of the page to train your Assistant using NLP </p>

                        <hr />
                        <br />
                        <h4 id='rich'>RICH RESPONSE</h4>
                        <p className="pl-2 pr-2">If you wish to visually please your customer with your assistant's response, then you might find this section coming in handy.</p>
                        <div className="pl-4 pr-4">
                            <h6 className="pt-2">CHIPS</h6>
                            <p className="pl-2 pr-2">Chips are the options that you provide for the users to select with your assistant, let's say if you want to provide different branches of the institution your work or you own, chips can be used to provide the branches as options. For creating a chip inside an intent, click on the <strong>Add chips</strong> button and enter your option and click on the <strong>Add chip</strong> in the pop-up.</p>
                            <h6 className="pt-2">CARDS</h6>
                            <p className="pl-2 pr-2">Card can be used if you want to decorate the information you provide to the user with your Assistant's reply. For creating cards inside an intent, click on <strong>Add card</strong> button, you will be able to see different design of cards, customize it with colors you wish and click <strong>Create card</strong>. the card will be displayed when a user gives relative messages</p>

                        </div>
                        <hr />
                        <br />
                        <h4 id="entity">ENTITY</h4>
                        <p className="pl-2 pr-2">Entity can basically be referred as extracting information from the user using your assistant.</p>
                        <div className="pl-4 pr-4">
                            <h6 className="pt-2">CREATING AN ENTITY</h6>
                            <ol>
                                <li>Click on <strong>ENTITY</strong> at the top of the intent page, you will be able to see a pop-up with different types of information.</li>
                                <li>After opening entity, click on the types of information you wish to retrieve from the user and enter the format in the input box and then click on the <strong>Save</strong> button, enitites will be created and saved.</li>

                            </ol>
                        </div>
                        <hr />
                        <br />
                        <h4 id="dbconnection">DATABASE</h4>
                        <p className="pl-2 pr-2"> If the Assistant is supposed to provide any particular data from your own database, connect your hosted database by clicking on <strong>CONNECT DB</strong> at the top of the Assistant page. Once it is connected, start using the data where ever required using <strong>Run Queries</strong>. Use run queries properly only if you have prior knowledge on <strong>SQL Database</strong> or this section might get troublesome and infuriating which can result in disfiguring other replies of the assistant.</p>
                        <hr />
                        <br />
                        <h4 id="statistics">STATS</h4>
                        <p className="pl-2 pr-2 pb-5">...Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>

                    </div>




                </div>
            </React.Fragment>

        );
    }
}

export { Documentation };