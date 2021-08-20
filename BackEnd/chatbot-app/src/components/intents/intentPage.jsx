import React, { Component } from 'react';
import { Navbar } from './intentNavbar'
import { DatabaseConnection } from './databaseConnection';
import { Intents } from './intents';
import { Settings } from './settings';
import './css/intent.css';




class IntentPage extends Component {
    state = {
        displayComponent: "intents",
    }

    componentDidMount = () => {
        let displayComponent = sessionStorage.getItem('intentPageComponent');
        if (displayComponent)
            this.setState({ displayComponent: displayComponent });
    }

    updateDisplayComponent = () => {
        let { displayComponent } = this.state;
        if (displayComponent === "intents") {
            sessionStorage.setItem('intentPageComponent', "settings")
            this.setState({ displayComponent: "settings" });
        }
        else if (displayComponent === "settings") {
            sessionStorage.setItem('intentPageComponent', "intents")
            this.setState({ displayComponent: "intents" });
        }
    }
    //------------------------------------------------------------------RENDER----------------------------------------------------------------------
    render() {
        let { displayComponent } = this.state;

        return (
            <React.Fragment>
                <Navbar
                    displayComponent={displayComponent}
                    updateDisplayComponent={this.updateDisplayComponent} />
                <DatabaseConnection />
                {displayComponent === "intents" ?
                    <Intents />
                    :
                    <Settings />
                }



            </React.Fragment>

        );
    }
}

export { IntentPage };