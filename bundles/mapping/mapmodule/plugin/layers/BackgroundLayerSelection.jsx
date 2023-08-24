import React from 'react';
import { Button, Dropdown } from 'oskari-ui';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledButton = styled(Button)`
    height: 28px;
    width: 133px;
    font-size: 14px;
    margin: 0 2px;
    border: none;
    opacity: ${props => props.$opacity};
    border-radius: calc(${props => props.$rounding ? props.$rounding / 100 : 0} * 32px);
    color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
    background: ${props => props.$backgroundColor};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    &:hover {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    &:active {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    &:focus {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ButtonsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    height: 48px;
    align-items: center;
`;

const getDropDownItems = (layers = []) => {
    return layers.map(layer => ({
        title: layer.title,
        action: () => layer.onClick(layer.id)
    }));
};

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

export const BackgroundLayerSelection = ({ isMobile = false, layers, current, ...rest }) => {
    if (isMobile) {
        return (
            <ButtonsContainer>
                <Dropdown items={getDropDownItems(layers)}>
                    <ThemedButton
                        icon={<MenuOutlined />}
                        {...rest}
                    >
                        {current?.getName()}
                    </ThemedButton>
                </Dropdown>
            </ButtonsContainer>
        );
    }

    return (
        <ButtonsContainer>
            {layers.map(layer => (
                <ThemedButton
                    key={layer.id}
                    onClick={() => layer.onClick(layer.id)}
                    {...rest}
                >
                    {layer.title}
                </ThemedButton>
            ))}
        </ButtonsContainer>
    );
};
