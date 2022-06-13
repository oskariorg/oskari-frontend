import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseIcon } from './CloseIcon';
import { ICON_SIZE } from './constants';
import { ThemeConsumer } from '../../util/contexts';

const Container = styled('div')`
    position: fixed;
    top: 0;
    opacity: 0.9;
    background-color: ${props => props.color};
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
    color: ${props => props.iconColor};
    > button:hover {
        color: ${props => props.hoverColor};
    }
    align-self: center;
    margin-left: 10px;
`;

export const Banner = ThemeConsumer(({ children, onClose, options, theme }) => {
    const containerProps = {
        className: `t_banner t_${options.id}`,
        color: theme.color.primary
    };
    const iconContainerProps = {
        iconColor: theme.color.icon,
        hoverColor: theme.color.accent,
    };
    return (
        <Container {...containerProps}>
            <Content>
                {children}
            </Content>
            <IconContainer {...iconContainerProps}><CloseIcon onClose={onClose} /></IconContainer>
        </Container>
    );
});

Banner.propTypes = {
    children: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.object
};
