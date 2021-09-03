import React, { useState } from 'react';

const Chip = (props) => {
  const handleHover = (e) => {
    let hover = JSON.parse(e.target.dataset.hover);
    if (hover) {
      e.target.style.backgroundColor = chipBgColor;
    } else {
      e.target.style.backgroundColor = chipBorder;
    }
    e.target.dataset.hover = !hover;
  };


  const getClass = (active) => {
    let className = 's-box ';
    if (active) className += 'active';
    return className;
  };
  let { theme, chips, sendMessage } = props;
  let { chipTextColor, chipBorder, chipShape, chipFont, chipBgColor } = theme;

  return (
    <React.Fragment>
      {chips.map((chip, index) => (
        <button
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          onClick={sendMessage}
          data-hover={false}
          name={chip}
          style={{
            backgroundColor: chipBgColor,
            color: chipTextColor,
            border: `2px solid ${chipBorder}`,
            fontFamily: chipFont,
            borderRadius: `${chipShape}px`,
          }}
          className={getClass(chip.active)}
        > {chip}</button>
      ))}
    </React.Fragment>
  );
};

export default Chip;
