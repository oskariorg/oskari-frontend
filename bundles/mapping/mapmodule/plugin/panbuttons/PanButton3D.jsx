import React from 'react';
import { CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ReturnIcon } from 'oskari-ui/components/icons';
import { MapModuleButton } from '../../MapModuleButton';
import { EFFECT } from '../../../../../src/constants';

const StyledButtonContainer = styled('div')`
    position: relative;
    margin: 0 25px 20px 25px;
    opacity: 0.8;
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
        fill: ${(props) => props.hovercolor};
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

export const PanButton3D = ({ colors, resetClicked, panClicked, isMobile = false, showArrows = false }) => {
    const { bgColor, icon, hover, primary } = colors;
    let backgroundV = bgColor;
    let backgroundH = `linear-gradient(180deg, ${primary} 0%, ${primary} 35%, ${Oskari.util.getColorEffect(primary, EFFECT.LIGHTEN_MINOR)} 100%)`;
    if (isMobile || !showArrows) {
        return (
            <MapModuleButton
                icon={<MobileIcon />}
                title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')}
                onClick={resetClicked}
                iconSize='18px'
                className='t_reset'
            />
        );
    }

    return (
        <StyledButtonContainer>
            <StyledButton backgroundV={backgroundV} backgroundH={backgroundH} >
                <ArrowButton colors={colors} onClick={() => panClicked(0, -1)} right='2.5px' top='0' className='t_pan_up'>
                    <CaretUpOutlined />
                </ArrowButton>
                <ArrowButton colors={colors} onClick={() => panClicked(-1, 0)} left='-29.5px' top='32px' className='t_pan_right'>
                    <CaretLeftOutlined />
                </ArrowButton>
                <StyledReturnButton title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} color={icon} hovercolor={hover}  onClick={resetClicked} className='t_reset'>
                    <ReturnIcon />
                </StyledReturnButton>
                <ArrowButton colors={colors} onClick={() => panClicked(0, 1)} right='2.5px' bottom='0' className='t_pan_right'>
                    <CaretDownOutlined />
                </ArrowButton>
                <ArrowButton colors={colors} onClick={() => panClicked(1, 0)} right='-29.5px' top='32px' className='t_pan_left'>
                    <CaretRightOutlined />
                </ArrowButton>
            </StyledButton>
        </StyledButtonContainer>
    );
};
