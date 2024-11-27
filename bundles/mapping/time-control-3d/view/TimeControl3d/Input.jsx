import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyledInput } from './styled';

export const Input = ({ value, changeHandler, children }) => (
    <Fragment>
        { children }
        <StyledInput value={value} onChange={(event) => changeHandler(event.target.value)} />
    </Fragment>
);

Input.propTypes = {
    value: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    // Element like <CalendarOutlined />
    children: PropTypes.any
};
