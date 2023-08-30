import React from 'react';
import { Button, Dropdown } from 'oskari-ui';
import { LayersIcon } from 'oskari-ui/components/icons';
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
    path {
        fill: ${props => props.$active ? props.$hoverColor : props.$iconColor};
    }
    &:hover {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
        path {
            fill: ${props => props.$hoverColor};
        }
    }
    &:active {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
        path {
            fill: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        }
    }
    &:focus {
        color: ${props => props.$hoverColor};
        background: ${props => props.$backgroundColor};
        path {
            fill: ${props => props.$hoverColor};
        }
    }
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
        font-size: 16px;
    }
`;

const ButtonsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ButtonText = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
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
    console.log()
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

const isWiderThanMap = (mapWidth, numberOfLayers) => {
    return (numberOfLayers * 133) >= mapWidth;
}

export const BackgroundLayerSelection = ({ isMobile = false, layers, current, mapWidth, ...rest }) => {
    if (isMobile || (mapWidth && isWiderThanMap(mapWidth, layers.length))) {
        return (
            <ButtonsContainer className='layerSelection'>
                <Dropdown items={getDropDownItems(layers)}>
                    <ThemedButton
                        icon={<LayersIcon />}
                        {...rest}
                    >
                        <ButtonText>{current?.getName()}</ButtonText>
                    </ThemedButton>
                </Dropdown>
            </ButtonsContainer>
        );
    }

    return (
        <ButtonsContainer className='layerSelection'>
            {layers.map(layer => (
                <ThemedButton
                    key={layer.id}
                    onClick={() => layer.onClick(layer.id)}
                    active={Number.parseInt(layer.id, 10) === current?.getId()}
                    {...rest}
                >
                    <ButtonText>{layer.title}</ButtonText>
                </ThemedButton>
            ))}
        </ButtonsContainer>
    );
};
