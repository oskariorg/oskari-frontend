import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import styled, { css, keyframes } from 'styled-components';

const animation = keyframes`
    0% {opacity: 1;}
    50% {opacity: 0.25;}
    100% {opacity: 1;}
`;
const BLINK_DURATION_IN_SECONDS = 1;
const BLINK_COUNT = 2;
const TOTAL_DURATION_IN_MS = BLINK_DURATION_IN_SECONDS * BLINK_COUNT * 1000;

const StyledBadge = styled.div`
    opacity: 1;
    min-width: 20px;
    height: 20px;
    color: #000;
    background: #ffd400;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    display: inline;
    line-height: 20px;
    margin-right: 10px;
    font-weight: 700;
    ${props => props.blink && css`
        animation: ${animation} ${BLINK_DURATION_IN_SECONDS}s;
        animation-iteration-count: ${BLINK_COUNT};`}
`;

export const SelectedTab = LocaleConsumer(({ num, messageKey }) => {
    const [isBlinking, setBlinking] = useState(true);
    // Prevents blinking when flyout is hidden and shown again.
    useEffect(() => {
        const timeout = setTimeout(() => setBlinking(false), TOTAL_DURATION_IN_MS);
        const cleanUp = () => clearTimeout(timeout);
        return cleanUp;
    });
    return (
        <React.Fragment>
            <Message messageKey={messageKey} />
            <StyledBadge blink={isBlinking}>
                {num}
            </StyledBadge>
        </React.Fragment>
    );
});

SelectedTab.propTypes = {
    num: PropTypes.number.isRequired,
    messageKey: PropTypes.string.isRequired
};
