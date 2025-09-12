import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { ThemeConsumer } from '../../util';
import { getNavigationTheme } from '../../theme';
import styled from 'styled-components';

// focus and active are only so we don't get the default blue from antd on some occurances.
// Also when the button is "not active" it remains in "focus" so it stays at hover color when the tool is closed
// if we don't actively style it this way
// One option would be to trigger a blur() on the component when active changes to non-active.
// That way tab-focusing would work really nice if we don't force the button to "inactive colors"
const StyledButton = styled(Button)`
    width: ${props => props.size} !important;
    height: ${props => props.size} !important;
    > * {
        font-size: ${props => props.$iconSize};
    }
    border: none;
    opacity: ${props => props.opacity};
    ${(props) => props.rounding && `border-radius: ${props.rounding};`}
    border-radius: ${props => props.rounding};
    color: ${props => props.$active ? props.hover : props.iconcolor};
    background: ${props => props.bg};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        color: ${props => props.hover} !important;
        background: ${props => props.bg}  !important;
    }
    &:focus,
    &:active {
        color: ${props => props.$active ? props.hover : props.iconcolor} !important;
        background: ${props => props.bg} !important;
    }
`;
const FilledButton = styled(StyledButton)`
    fill: ${props => props.$active ? props.hover : props.iconcolor};
    path {
        fill: ${props => props.$active ? props.hover : props.iconcolor};
    }
    &:hover,
    &:focus,
    &:active {
        path {
            fill: ${props => props.hover} !important;
        }
    }
`;

const StrokedButton = styled(StyledButton)`
    fill: none !important;
    path {
        fill: none !important;
        stroke: ${props => props.$active ? props.hover : props.iconcolor};
    }
    line {
        stroke: ${props => props.hover};
    }
    &:focus,
    &:active,
    &:hover {
        path {
            fill: none !important;
            stroke: ${props => props.hover};
        }
    }
`


const ThemeButton = ThemeConsumer(({ theme = {}, active, highlight='fill', icon, iconSize = '18px', size = '32px', ...rest }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const iconColor = helper.getTextColor();
    const hover = helper.getButtonHoverColor();
    const rounding = helper.getButtonRoundness();
    const opacity = helper.getButtonOpacity();
    const ButtonNode = highlight === 'fill' ? FilledButton : StrokedButton;
    const style = { fontSize: iconSize };
    return <ButtonNode
        bg={bgColor}
        iconcolor={iconColor}
        hover={hover}
        rounding={rounding}
        opacity={opacity}
        $active={active}
        icon={React.cloneElement(icon, { active, style })}
        size={size}
        $iconSize={iconSize}
        { ...rest }/>
});

export const MapButton = ({ title, iconActive, position, ...rest }) => {
    let tooltipPosition = 'top';
    if (position && position.includes('right')) {
        tooltipPosition = 'left';
    } else if (position && position.includes('left')) {
        tooltipPosition = 'right';
    }

    if (title) {
        return (
            <Tooltip title={title} placement={tooltipPosition}>
                    <ThemeButton
                        active={iconActive ? 1 : 0}
                        { ...rest }
                    />
            </Tooltip>
        );
    } else {
        return (
                <ThemeButton
                    active={iconActive ? 1 : 0}
                    { ...rest }
                />
        );
    }
};

MapButton.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.any.isRequired,
    onClick: PropTypes.func
};
