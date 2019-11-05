import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBadge = styled.div`
    min-width: 20px;
    height: 20px;
    color: #000;
    background: #ffd400;
    border-radius: 4px;
    text-align: center;
    padding: 2px 10px;
    font-size: 12px;
    display: inline;
    line-height: 20px;
    margin-left: 8px;
    font-weight: 700;
`;

export const SelectedTab = ({ num, text }) => {
    return (
        <span>
            {text}
            <StyledBadge>
                {num}
            </StyledBadge>
        </span>
    );
};

SelectedTab.propTypes = {
    num: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
};
