import React from 'react';
import { CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { PanButton3D } from './PanButton3D';
import { ReturnIcon } from 'oskari-ui/components/icons';
import { MapModuleButton } from '../../MapModuleButton';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledButtonContainer = styled('div')`
    position: relative;
    margin-bottom: 20px;
    ${(props) => props.roundness && `border-radius: ${props.roundness};`}
    box-shadow: 1px 1px 2px 1px rgb(0 0 0 / 60%);
    opacity: 0.8;
`;

const StyledReturnButton = styled('div')`
    cursor: pointer;
    ${(props) => props.roundness && `border-radius: ${props.roundness};`}
    width: 40px;
    height: 40px;
    background-color: ${(props) => props.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    fill: ${(props) => props.iconColor};
    &:hover {
        fill: ${(props) => props.hovercolor};
    }
    svg {
        width: 18px;
        height: 18px;
    }
`;

const StyledArrowsButton = styled('div')`
    ${(props) => props.roundness && `border-radius: ${props.roundness};`}
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
        color: ${(props) => props.hovercolor};
    }
`;

const ArrowButton = ({ children, onClick, colors, top = 'initial', right = 'initial', bottom = 'initial', left = 'initial' }) => {
    return (
        <ArrowIcon onClick={onClick} color={colors.icon} hovercolor={colors.hover} top={top} right={right} bottom={bottom} left={left}>
            {children}
        </ArrowIcon>
    );
}

export const PanButton = ThemeConsumer(({ theme, resetClicked, panClicked, isMobile = false, showArrows = false }) => {

    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const hover = helper.getButtonHoverColor();
    const rounding = helper.getButtonRoundness();
    const colors = {
        primary: helper.getPrimary(),
        bgColor,
        icon,
        hover
    }

    if (helper.getEffect() === '3D') {
        return (<PanButton3D resetClicked={resetClicked} panClicked={panClicked} colors={colors} isMobile={isMobile} showArrows={showArrows} />);
    }

    if (isMobile || !showArrows) {
        return (
            <MapModuleButton
                onClick={resetClicked}
                title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')}
                icon={<ReturnIcon />}
                iconSize='18px'
                className='t_reset'
            />
        );
    }

    return (
        <div>
            <StyledButtonContainer roundness={rounding}>
                <ArrowButton colors={colors} onClick={() => panClicked(0, -1)} right='32px' top='0' className='t_pan_up'>
                    <CaretUpOutlined />
                </ArrowButton>
                <ArrowButton colors={colors} onClick={() => panClicked(-1, 0)} left='0' top='32px' className='t_pan_right'>
                    <CaretLeftOutlined />
                </ArrowButton>
                <StyledArrowsButton backgroundColor={bgColor} roundness={rounding}>
                    <StyledReturnButton onClick={resetClicked} title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')}
                        backgroundColor={bgColor}
                        iconColor={icon}
                        hovercolor={hover}
                        roundness={rounding}
                        className='t_reset'>
                        <ReturnIcon />
                    </StyledReturnButton>
                </StyledArrowsButton>
                <ArrowButton colors={colors} onClick={() => panClicked(0, 1)} right='32px' bottom='0' className='t_pan_down'>
                    <CaretDownOutlined />
                </ArrowButton>
                <ArrowButton colors={colors} onClick={() => panClicked(1, 0)} right='0' top='32px' className='t_pan_left'>
                    <CaretRightOutlined />
                </ArrowButton>
            </StyledButtonContainer>
        </div>
    );
});
