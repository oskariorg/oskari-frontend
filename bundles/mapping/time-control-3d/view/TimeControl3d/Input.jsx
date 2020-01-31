import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyledIcon, StyledInput } from './styled';

export const Input = ({ value, changeHandler, iconType }) => {
    const onChange = event => {
        const val = event.target.value;
        changeHandler(val);
    };

    return (
        <Fragment>
            <StyledIcon type={iconType}/>
            <StyledInput value={value} onChange={onChange} />
        </Fragment>
    );
};

Input.propTypes = {
    value: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    iconType: PropTypes.string.isRequired
};
