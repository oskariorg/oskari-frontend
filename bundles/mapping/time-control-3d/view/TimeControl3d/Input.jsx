import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyledInput } from './styled';

export const Input = ({ value, changeHandler, children }) => {
    const onChange = event => {
        const val = event.target.value;
        changeHandler(val);
    };

    return (
        <Fragment>
            { children }
            <StyledInput value={value} onChange={onChange} />
        </Fragment>
    );
};

Input.propTypes = {
    value: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    // Element like <CalendarOutlined />
    children: PropTypes.any
};
