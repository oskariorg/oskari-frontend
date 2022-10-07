import React from 'react';
import { RollbackOutlined, CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { PanButton3D } from './PanButton3D';

const StyledButtonContainer = styled('div')`
    margin-bottom: 20px;
    ${(props) => props.rounded && 'border-radius: 50%;'}
    box-shadow: 1px 1px 2px 1px rgb(0 0 0 / 60%);
`;

const StyledReturnButton = styled('div')`
    ${(props) => props.rounded && 'border-radius: 50%;'}
    width: 46px;
    height: 46px;
    background-color: ${(props) => props.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    color: ${(props) => props.iconColor};
    &:hover {
        color: #ffd400;
    }
`;

const StyledArrowsButton = styled('div')`
    ${(props) => props.rounded && 'border-radius: 50%;'}
    width: 90px;
    height: 90px;
    display: flex;
    border: 20px solid ${(props) => props.backgroundColor};
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%) inset;
`;

const UpIcon = styled(CaretUpOutlined)`
    font-size: 12px;
    position: absolute;
    right: 39px;
    top: 4px;
    color: ${(props) => props.color};
    &:hover {
        color: #ffd400;
    }
`;
const RightIcon = styled(CaretRightOutlined)`
    font-size: 12px;
    position: absolute;
    right: 4px;
    top: 39px;
    color: ${(props) => props.color};
    &:hover {
        color: #ffd400;
    }
`;
const DownIcon = styled(CaretDownOutlined)`
    font-size: 12px;
    position: absolute;
    right: 39px;
    bottom: 4px;
    color: ${(props) => props.color};
    &:hover {
        color: #ffd400;
    }
`;
const LeftIcon = styled(CaretLeftOutlined)`
    font-size: 12px;
    position: absolute;
    top: 39px;
    left: 4px;
    color: ${(props) => props.color};
    &:hover {
        color: #ffd400;
    }
`;

export const PanButton = ({ resetClicked, panClicked, styleName = 'rounded-dark' }) => {

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

    return (
        <StyledButtonContainer rounded={shape === 'rounded'}>
            <UpIcon color={iconColor} onClick={() => panClicked(0, -1)} />
            <LeftIcon color={iconColor} onClick={() => panClicked(-1, 0)} />
            <StyledArrowsButton backgroundColor={backgroundColor} rounded={shape === 'rounded'} >
                <StyledReturnButton title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} backgroundColor={backgroundColor} iconColor={iconColor} rounded={shape === 'rounded'} >
                    <RollbackOutlined onClick={() => resetClicked()} />
                </StyledReturnButton>
            </StyledArrowsButton>
            <RightIcon color={iconColor} onClick={() => panClicked(1, 0)} />
            <DownIcon color={iconColor} onClick={() => panClicked(0, 1)} />
        </StyledButtonContainer>
    );
}
