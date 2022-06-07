import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseIcon } from './CloseIcon';
import { ICON_SIZE, ICON_COLOR, ICON_COLOR_HOVER } from './constants';
// HEADER_COLOR in constants should but we should enable transparency for banner
const COLOR = 'rgba(253, 248, 217, 0.9)' // #fdf8d9

const Container = styled('div')`
    position: fixed;
    top: 0;
    background-color: ${COLOR};
    box-shadow: 0 5px 10px 0 #888888;
    height: auto;
    padding: 10px 15px 10px 15px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 950px;
    @media only screen and (max-width: 1025px) {
        min-width: 0;
        width: 100%
    }
    z-index: 999999;
    display: flex;
    flex-direction: row;
`;

const Content = styled('div')`
    margin-right: auto;
    width: 100%;
    display: flex;
    @media only screen and (max-width: 1025px) {
        flex-direction: column;
    }
`;

const IconContainer = styled.span`
    font-size: ${ICON_SIZE}px;
    color: ${ICON_COLOR};
    :hover {
        color: ${ICON_COLOR_HOVER};
    }
    align-self: center;
    margin-left: 10px;
`;

export const Banner = ({ children, onClose, options }) => {
    const containerProps = {
        className: `t_banner t_${options.id}`
    };
    return (
        <Container {...containerProps}>
            <Content>
                {children}
            </Content>
            <IconContainer><CloseIcon onClose={onClose} /></IconContainer>
        </Container>
    );
};

Banner.propTypes = {
    children: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.object
};
