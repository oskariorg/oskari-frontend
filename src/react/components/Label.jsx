import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Label = styled.div`
    display: ${({inline = false}) => inline ? "inline-block" : undefined};
    padding-bottom: 5px;
`;

Label.propTypes = {
    // render as inline-block or not
    inline: PropTypes.bool
};