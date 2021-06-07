import React, { Component } from 'react';

class Chips extends Component {
    state = {
        hover: false,
    }

    componentDidMount() {

    }

    handleClick = () => {
        let { chip } = this.props;
        if (!chip.clickable)
            this.props.sendMessage(chip.chip_value);
    }


    handleHover = () => {
        this.setState({ hover: !this.state.hover })
    }

    backgroundColor = () => {
        let { chipBorder, chipBgColor } = this.props.chipTheme;
        let chipBg;
        if (this.state.hover) {
            chipBg = chipBorder;
        } else {
            chipBg = chipBgColor;
        }

        return chipBg;
    }

    render() {
        let { chipTheme, chip } = this.props;
        let {
            chipTextColor,
            chipBorder,
            chipShape,
            chipFont } = chipTheme;
        return (

            <button
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}
                onClick={() => this.handleClick()}
                style={{
                    backgroundColor: this.backgroundColor(),
                    color: chipTextColor,
                    border: `2px solid ${chipBorder}`,
                    fontFamily: chipFont,
                    borderRadius: `${chipShape}px`,
                }}
                className={this.getClass(chip.active)}
            >
                {chip.chip_value}
            </button>

        )
    }

    getClass = (active) => {
        let className = "s-box ";
        if (active)
            className += "active";
        return className
    }
}

export { Chips };