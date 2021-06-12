import React, { Component } from 'react';
import chatboxLogo from '../images/chatbots-logo-white.png'

class MessageIcon extends Component {
    state = {}
    render() {
        return (
            <div className="media-left">
                <div className={this.visibility()}>
                    <img src={chatboxLogo} alt="Logo" className="img-responsive center-block" />
                </div>
            </div>
        );
    }

    visibility() {
        let className = "circle";
        if (this.props.invisible) {
            className += "invisible";
        }
        return className;
    }
}

export { MessageIcon };