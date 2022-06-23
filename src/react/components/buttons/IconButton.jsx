import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { ThemeConsumer } from '../../util';
import { getColorEffect } from '../../theme/ThemeHelper';
import styled from 'styled-components';

// Note! AntD buttons default at 32x32px
//  If the font-size of the icon is > 32px it will be clipped by at least Safari
//  Let the user of this component define the size of the button instead of doing it here.
const StyledButton = styled(Button)`
    border: none;
    background: none;
    &:hover {
        color: ${props => props.color};
        background: none;
    }
`;

const ThemeButton = ThemeConsumer(({ theme, ...rest }) => {
    let color = theme?.color?.accent;
    if (color && Oskari.util.isDarkColor(color)) {
        color = theme?.color?.primary;
    }
    if (!color) {
        color = '#ffd400';
    } else if (Oskari.util.isDarkColor(color)) {
        color = getColorEffect(color);
    }
    return <StyledButton color={color} { ...rest }/>
});

export const IconButton = ({ title, icon, onClick, ...rest }) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <ThemeButton icon={icon} onClick={onClick} { ...rest }/>
            </Tooltip>
        );
    } else {
        return (
            <ThemeButton
                icon={icon}
                onClick={onClick}
                { ...rest }
            />
        );
    }
};

IconButton.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func
};
