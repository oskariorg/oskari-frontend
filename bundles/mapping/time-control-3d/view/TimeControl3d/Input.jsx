import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyledIcon, StyledInput } from './styled';

export const Input = ({ timeValue, changeHandler }) => {
    const inputChangeTime = event => {
        const val = event.target.value;
        changeHandler(val);
    };

    return (
        <Fragment>
            <StyledIcon type="clock-circle"/>
            <StyledInput value={timeValue} onChange={inputChangeTime} />
        </Fragment>
    );
};

Input.propTypes = {
    timeValue: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired
};
