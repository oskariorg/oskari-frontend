import React from 'react';
import PropTypes from 'prop-types';
import { StyledIcon, StyledInput } from './ShadowToolStyled';

export const Input = ({ timeValue, changeHandler }) => {
    const inputChangeTime = event => {
        const val = event.target.value;
        changeHandler(val);
    };

    return (
        <React.Fragment>
            <StyledIcon type="clock-circle"/>
            <StyledInput value={timeValue} onChange={inputChangeTime} />
        </React.Fragment>
    );
};

Input.propTypes = {
    timeValue: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired
};
