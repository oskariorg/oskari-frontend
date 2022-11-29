import React from 'react';
import { CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ReturnIcon } from 'oskari-ui/components/icons';
import { MapModuleButton } from '../../MapModuleButton';

const StyledButtonContainer = styled('div')`
    position: relative;
    margin: 0 25px 20px 25px;
`;

const StyledButton = styled('div')`
    height: 84px;
    position: relative;
    width: 25px;
    background: ${(props) => props.backgroundV};
    border-radius: 5px;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    display: flex;
    justify-content: center;
    align-items: center;
    ::before {
        content: "";
        height: 25px;
        left: -29.5px;
        position: absolute;
        top: 29.5px;
        width: 84px;
        border-radius: 5px;
        z-index: -1;
        box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    }
    ::after {
        background: ${(props) => props.backgroundH};
        content: "";
        height: 25px;
        left: -29.5px;
        position: absolute;
        top: 29.5px;
        width: 84px;
        border-radius: 5px;
    }
`;

const MobileIcon = styled(ReturnIcon)`
    max-width: 16px;
    max-height: 16px;
`;

const StyledReturnButton = styled('div')`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    fill: ${(props) => props.color};
    z-index: 1;
    &:hover {
        fill: #ffd400;
    }
    svg {
        width: 18px;
        height: 18px;
    }
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
    z-index: 2;
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

export const PanButton3D = ({ resetClicked, panClicked, color = 'dark', isMobile = false, showArrows = false }) => {

    let backgroundV = 'linear-gradient(180deg,rgba(101,101,101,1) 0%,rgba(60,60,60,1) 35%,rgba(9,9,9,1) 100%)';
    let backgroundH = 'linear-gradient(180deg,#3c3c3c 0%,rgba(60,60,60,1) 35%,#232323 100%)';
    let iconColor = '#ffffff';

    if (color === 'light') {
        backgroundV = 'linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(240,240,240,1) 35%,rgba(221,221,221,1) 100%)';
        backgroundH = 'linear-gradient(180deg,#efefef 0%,rgba(240,240,240,1) 35%,#e6e6e6 100%)';
        iconColor = '#3c3c3c';
    }

    if (isMobile || !showArrows) {
        return (
            <MapModuleButton
                icon={<MobileIcon />}
                title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')}
                styleName={`3d-${color}`}
                onClick={() => resetClicked}
                iconSize='18px'
                className='t_reset'
            />
        );
    }

    return (
        <StyledButtonContainer>
            <StyledButton backgroundV={backgroundV} backgroundH={backgroundH} >
                <ArrowButton color={iconColor} onClick={() => panClicked(0, -1)} right='2.5px' top='0' className='t_pan_up'>
                    <CaretUpOutlined />
                </ArrowButton>
                <ArrowButton color={iconColor} onClick={() => panClicked(-1, 0)} left='-29.5px' top='32px' className='t_pan_right'>
                    <CaretLeftOutlined />
                </ArrowButton>
                <StyledReturnButton title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} color={iconColor} onClick={() => resetClicked()} className='t_reset'>
                    <ReturnIcon />
                </StyledReturnButton>
                <ArrowButton color={iconColor} onClick={() => panClicked(0, 1)} right='2.5px' bottom='0' className='t_pan_right'>
                    <CaretDownOutlined />
                </ArrowButton>
                <ArrowButton color={iconColor} onClick={() => panClicked(1, 0)} right='-29.5px' top='32px' className='t_pan_left'>
                    <CaretRightOutlined />
                </ArrowButton>
            </StyledButton>
        </StyledButtonContainer>
    );
}
