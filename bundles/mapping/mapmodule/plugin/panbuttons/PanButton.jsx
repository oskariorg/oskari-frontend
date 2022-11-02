import React from 'react';
import { CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { PanButton3D } from './PanButton3D';
import { ReturnIcon } from 'oskari-ui/components/icons';

const StyledButtonContainer = styled('div')`
    width: 84px;
    height: 84px;
    position: relative;
    margin-bottom: 20px;
    ${(props) => props.rounded && 'border-radius: 50%;'}
    box-shadow: 1px 1px 2px 1px rgb(0 0 0 / 60%);
`;

const StyledReturnButton = styled('div')`
    cursor: pointer;
    ${(props) => props.rounded && 'border-radius: 50%;'}
    width: 40px;
    height: 40px;
    background-color: ${(props) => props.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    fill: ${(props) => props.iconColor};
    &:hover {
        fill: #ffd400;
    }
    svg {
        width: 18px;
        height: 18px;
    }
`;

const MobileButtonContainer = styled('div')`
    margin: 0 30px;
`;

const StyledArrowsButton = styled('div')`
    ${(props) => props.rounded && 'border-radius: 50%;'}
    width: 84px;
    height: 84px;
    display: flex;
    border: 20px solid ${(props) => props.backgroundColor};
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%) inset;
`;

const ArrowIcon = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    top: ${props => props.top};
    right: ${props => props.right};
    bottom: ${props => props.bottom};
    left: ${props => props.left};
    color: ${(props) => props.color};
    &:hover {
        color: #ffd400;
    }
`;

const ArrowButton = ({ children, onClick, color, top = 'initial', right = 'initial', bottom = 'initial', left = 'initial' }) => {
    return (
        <ArrowIcon onClick={onClick} color={color} top={top} right={right} bottom={bottom} left={left}>
            {children}
        </ArrowIcon>
    );
}

export const PanButton = ({ resetClicked, panClicked, styleName = 'rounded-dark', isMobile = false }) => {

    const [shape, color] = styleName.split('-');
    let iconColor = '#ffffff';
    let backgroundColor = "#3c3c3c";

    if (color === 'light') {
        iconColor = "#3c3c3c";
        backgroundColor = "#ffffff";
    }

    if (shape === '3d') {
        return <PanButton3D resetClicked={resetClicked} panClicked={panClicked} color={color} />
    }

    if (isMobile) {
        return (
            <MobileButtonContainer>
                <StyledReturnButton onClick={() => resetClicked()} title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} backgroundColor={backgroundColor} iconColor={iconColor} rounded={shape === 'rounded'} >
                    <ReturnIcon />
                </StyledReturnButton>
            </MobileButtonContainer>
        );
    }

    return (
        <StyledButtonContainer rounded={shape === 'rounded'}>
            <ArrowButton color={iconColor} onClick={() => panClicked(0, -1)} right='32px' top='0'>
                <CaretUpOutlined />
            </ArrowButton>
            <ArrowButton color={iconColor} onClick={() => panClicked(-1, 0)} left='0' top='32px'>
                <CaretLeftOutlined />
            </ArrowButton>
            <StyledArrowsButton backgroundColor={backgroundColor} rounded={shape === 'rounded'}>
                <StyledReturnButton onClick={() => resetClicked()} title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} backgroundColor={backgroundColor} iconColor={iconColor} rounded={shape === 'rounded'} >
                    <ReturnIcon />
                </StyledReturnButton>
            </StyledArrowsButton>
            <ArrowButton color={iconColor} onClick={() => panClicked(0, 1)} right='32px' bottom='0'>
                <CaretDownOutlined />
            </ArrowButton>
            <ArrowButton color={iconColor} onClick={() => panClicked(1, 0)} right='0' top='32px'>
                <CaretRightOutlined />
            </ArrowButton>
        </StyledButtonContainer>
    );
}
