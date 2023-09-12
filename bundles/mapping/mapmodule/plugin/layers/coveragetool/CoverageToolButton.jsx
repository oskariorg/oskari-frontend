import React from 'react';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';
import { Button } from 'oskari-ui';
import PropTypes from 'prop-types';
import styled from 'styled-components';
const StyledButton = styled(Button)`
    height: 32px;
    font-size: 14px;
    border: none;
    opacity: ${props => props.$opacity};
    border-radius: calc(${props => props.$rounding ? props.$rounding / 100 : 0} * 32px);
    color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
    background: ${props => props.$backgroundColor};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    &:hover {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
    }
    &:active {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
    }
    &:focus {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
    }
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${props => props.$marginRight};
    margin-left: ${props => props.$marginLeft};
    margin-top: 10px;
`;

const ThemedButton = ThemeConsumer(({ theme = {}, active, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const rounding = helper.getButtonRoundness();
    const icon = helper.getTextColor();
    const background = helper.getButtonColor();
    const hover = helper.getButtonHoverColor();
    const opacity = helper.getButtonOpacity();
    return (
        <StyledButton
            $rounding={rounding}
            $iconColor={icon}
            $backgroundColor={background}
            $hoverColor={hover}
            $active={active}
            $opacity={opacity}
            {...rest}
        />
    );
});

export const CoverageToolButton = (props) => {
    const { visible, onClick, icon, active, position } = props;
    if (!visible) {
        return null;
    };

    return <ThemedButton
        onClick={onClick}
        active={active}
        position={position}
    >
        {icon}
    </ThemedButton>;
};

CoverageToolButton.propTypes = {
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.any,
    active: PropTypes.bool,
    position: PropTypes.string
};
