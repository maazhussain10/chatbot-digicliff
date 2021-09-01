import React from 'react';
import chatboxLogo from '../../assets/images/chatbots-logo-white.png';

const MessageIcon = () => {
  const visibility = () => {
    let className = 'circle';
    if (this.props.invisible) {
      className += 'invisible';
    }
    return className;
  };

  return (
    <div className="media-left">
      <div className={visibility}>
        <img
          src={chatboxLogo}
          alt="Logo"
          className="img-responsive center-block"
        />
      </div>
    </div>
  );
};

export default MessageIcon;
