import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled('a')`
    cursor: pointer;
`;
export const VisibilityInfo = ({ action, text }) => {
    if (action) {
        return <StyledLink onClick={action}>{text}</StyledLink>;
    }
    return text;
};
VisibilityInfo.propTypes = {
    action: PropTypes.func,
    text: PropTypes.string.isRequired
};
