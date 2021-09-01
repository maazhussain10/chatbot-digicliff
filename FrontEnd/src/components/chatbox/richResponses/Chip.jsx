import React, { useState } from 'react';

const Chip = (props) => {
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    let { chip } = props;
    if (!chip.clickable) props.sendMessage(chip.chipValue);
  };

  const handleHover = () => {
    setHover(!hover);
  };

  const backgroundColor = () => {
    let { chipBorder, chipBgColor } = props.theme;
    let chipBg;
    if (hover) {
      chipBg = chipBorder;
    } else {
      chipBg = chipBgColor;
    }

    return chipBg;
  };

  const getClass = (active) => {
    let className = 's-box ';
    if (active) className += 'active';
    return className;
  };

  let { theme, chip } = props;
  let { chipTextColor, chipBorder, chipShape, chipFont } = theme;

  return (
    <button
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={() => handleClick()}
      style={{
        backgroundColor: backgroundColor(),
        color: chipTextColor,
        border: `2px solid ${chipBorder}`,
        fontFamily: chipFont,
        borderRadius: `${chipShape}px`,
      }}
      className={getClass(chip.active)}
    >
      {chip.chipValue}
    </button>
  );
};

export default Chip;
