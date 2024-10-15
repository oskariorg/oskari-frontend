import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = styled.h1`
    margin-bottom: 8px;
`;

export const Title = ({ content = '' }) => {
    if (!content.length) {
        return null;
    }
    return <Styled>{content}</Styled>;
};

Title.propTypes = {
    content: PropTypes.string
};
