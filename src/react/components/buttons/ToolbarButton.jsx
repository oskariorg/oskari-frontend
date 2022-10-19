import React from 'react';
import { Tooltip } from '../Tooltip';
import styled from 'styled-components';

const StyledToolbar = styled('div')`
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    padding-left: ${props => props.height};
    padding-right: 5px;
    height: ${props => props.height};
    border-radius: ${props => props.rounding};
    background: #707070;
    display: flex;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    ${props => props.open ? `
        max-width: 500px;
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
    margin: 0 10px 0 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%
`;

const Icon = styled('div')`
    width: 14px;
    height: 14px;
    svg {
        path {
            fill: ${props => props.$active ? '#ffd400': '#ffffff'};
        }
    }
`;

export const ToolbarButtonItem = ({ icon, onClick, iconActive = false, title }) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <ToolbarItem onClick={onClick}>
                    <Icon $active={iconActive}>
                        {icon}
                    </Icon>
                </ToolbarItem>
            </Tooltip>
        );
    } else {
        return (
            <ToolbarItem onClick={onClick}>
                <Icon $active={iconActive}>
                    {icon}
                </Icon>
            </ToolbarItem>
        );
    }
}

export const Toolbar = ({ height, children, open = false, shape = 'rounded' }) => {
    let rounding = '25px';
    if (shape === 'sharp') rounding = '0px';
    else if (shape === '3d') rounding = '5px';
    return (
        <StyledToolbar open={open} height={height} rounding={rounding}>
            {children}
        </StyledToolbar>
    );
}
