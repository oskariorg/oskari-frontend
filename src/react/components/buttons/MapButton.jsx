import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { ThemeConsumer } from '../../util';
import styled from 'styled-components';
import { ThemeProvider } from '../../util/contexts';

const StyledButton = styled(Button)`
    border: none;
    border-radius: ${props => props.rounding};
    color: ${props => props.accent};
    background: ${props => props.primary};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    &:hover {
        color: ${props => props.accent};
        background: ${props => props.primary};
    }
    &:active {
        color: ${props => props.accent};
        background: ${props => props.primary};
    }
    &:focus {
        color: ${props => props.accent};
        background: ${props => props.primary};
    }
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ThemeButton = ThemeConsumer(({ theme = {}, ...rest }) => {
    const primary = theme?.color?.primary || '#3c3c3c';
    const accent = theme?.color?.accent || '#ffffff';
    const rounding = `${theme.roundingPercent || 0}%`;
    return <StyledButton primary={primary} accent={accent} rounding={rounding} { ...rest }/>
});

export const MapButton = ({ title, icon, onClick, theme, ...rest }) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <ThemeProvider value={theme}>
                    <ThemeButton
                        icon={icon}
                        onClick={onClick}
                        { ...rest }
                    />
                </ThemeProvider>
            </Tooltip>
        );
    } else {
        return (
            <ThemeProvider value={theme}>
                <ThemeButton
                    icon={icon}
                    onClick={onClick}
                    { ...rest }
                />
            </ThemeProvider>
        );
    }
};

MapButton.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func
};
