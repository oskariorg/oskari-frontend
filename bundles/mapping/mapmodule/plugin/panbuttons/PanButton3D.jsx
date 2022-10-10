import React from 'react';
import { RollbackOutlined, CaretDownOutlined, CaretUpOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledButtonContainer = styled('div')`
    margin-bottom: 20px;
`;

const StyledButton = styled('div')`
    height: 90px;
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
        left: -32.5px;
        position: absolute;
        top: 32.5px;
        width: 90px;
        border-radius: 5px;
        z-index: -1;
        box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    }
    ::after {
        background: ${(props) => props.backgroundH};
        content: "";
        height: 25px;
        left: -32.5px;
        position: absolute;
        top: 32.5px;
        width: 90px;
        border-radius: 5px;
    }
`;

const UpIcon = styled(CaretUpOutlined)`
    font-size: 12px;
    position: absolute;
    right: 6px;
    top: 3px;
    color: ${(props) => props.color};
    z-index: 1;
    &:hover {
        color: #ffd400;
    }
`;
const RightIcon = styled(CaretRightOutlined)`
    font-size: 12px;
    position: absolute;
    right: -30px;
    top: 39px;
    color: ${(props) => props.color};
    z-index: 1;
    &:hover {
        color: #ffd400;
    }
`;
const DownIcon = styled(CaretDownOutlined)`
    font-size: 12px;
    position: absolute;
    right: 6px;
    bottom: 3px;
    color: ${(props) => props.color};
    z-index: 1;
    &:hover {
        color: #ffd400;
    }
`;
const LeftIcon = styled(CaretLeftOutlined)`
    font-size: 12px;
    position: absolute;
    top: 39px;
    left: -30px;
    color: ${(props) => props.color};
    z-index: 1;
    &:hover {
        color: #ffd400;
    }
`;

const ReturnIcon = styled(RollbackOutlined)`
    font-size: 18px;
    position: absolute;
    color: ${(props) => props.color};
    z-index: 1;
    &:hover {
        color: #ffd400;
    }
`;

export const PanButton3D = ({ resetClicked, panClicked, color = 'dark' }) => {

    let backgroundV = 'linear-gradient(180deg,rgba(101,101,101,1) 0%,rgba(60,60,60,1) 35%,rgba(9,9,9,1) 100%)';
    let backgroundH = 'linear-gradient(180deg,#3c3c3c 0%,rgba(60,60,60,1) 35%,#232323 100%)';
    let iconColor = '#ffffff';

    if (color === 'light') {
        backgroundV = 'linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(240,240,240,1) 35%,rgba(221,221,221,1) 100%)';
        backgroundH = 'linear-gradient(180deg,#efefef 0%,rgba(240,240,240,1) 35%,#e6e6e6 100%)';
        iconColor = '#3c3c3c';
    }

    return (
        <StyledButton backgroundV={backgroundV} backgroundH={backgroundH} >
            <UpIcon color={iconColor} onClick={() => panClicked(0, -1)} />
            <LeftIcon color={iconColor} onClick={() => panClicked(-1, 0)} />
            <ReturnIcon title={Oskari.getMsg('MapModule', 'plugin.PanButtonsPlugin.center.tooltip')} color={iconColor} onClick={() => resetClicked()} />
            <RightIcon color={iconColor} onClick={() => panClicked(1, 0)} />
            <DownIcon color={iconColor} onClick={() => panClicked(0, 1)} />
        </StyledButton>
    );
}
