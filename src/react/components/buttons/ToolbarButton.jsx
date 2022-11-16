import React from 'react';
import { Tooltip } from '../Tooltip';
import styled from 'styled-components';

const StyledToolbar = styled('div')`
    position: absolute;
    ${props => props.direction}: 0;
    top: 0;
    padding-${props => props.direction}: ${props => props.height};
    height: ${props => props.height};
    border-radius: ${props => props.rounding};
    background: #707070;
    display: flex;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    ${props => props.open ? `
        max-width: ${props => props.maxWidth};
        -moz-transition: max-width .3s linear;
        -ms-transition: max-width .3s linear;
        -o-transition: max-width .3s linear;
        -webkit-transition: max-width .3s linear;
        transition: max-width .3s linear;
        overflow: hidden;
    ` : `
        max-width: 0;
        -moz-transition: max-width .3s linear;
        -ms-transition: max-width .3s linear;
        -o-transition: max-width .3s linear;
        -webkit-transition: max-width .3s linear;
        transition: max-width .3s linear;
        visibility: hidden;
    `}
`;

const ToolbarItem = styled('div')`
    color: #ffffff;
    fill: #ffffff;
    margin: 0 10px 0 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%
`;

const Icon = styled('div')`
    width: 18px;
    height: 18px;
    svg {
        fill: ${props => props.$active ? '#ffd400': '#ffffff'};
        path {
            fill: ${props => props.$active ? '#ffd400': '#ffffff'};
        }
    }
`;

export const ToolbarButtonItem = ({ icon, onClick, iconActive = false, title, disabled = false }) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <ToolbarItem onClick={disabled ? null : onClick}>
                    <Icon $active={iconActive}>
                        {icon}
                    </Icon>
                </ToolbarItem>
            </Tooltip>
        );
    } else {
        return (
            <ToolbarItem onClick={disabled ? null : onClick}>
                <Icon $active={iconActive}>
                    {icon}
                </Icon>
            </ToolbarItem>
        );
    }
}

export const Toolbar = ({ height, children, open = false, shape = 'rounded', direction, maxWidth }) => {
    let rounding = '25px';
    if (shape === 'sharp') rounding = '0px';
    else if (shape === '3d') rounding = '5px';

    let toolbarMaxWidth = `${maxWidth}px`;
    let directionControl = 'left';
    if (direction === 'left') {
        directionControl = 'right';
    }

    return (
        <StyledToolbar open={open} height={height} rounding={rounding} direction={directionControl} maxWidth={toolbarMaxWidth}>
            {children}
        </StyledToolbar>
    );
}
