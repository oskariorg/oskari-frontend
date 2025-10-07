import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseIcon } from './CloseIcon';
import { createDraggable } from './util';
import { ICON_SIZE } from './constants';
import { ThemeConsumer } from '../../util/contexts';
import { getHeaderTheme } from '../../theme/ThemeHelper';

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20009;
    background: #fafafa;
    min-width: 300px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    max-width: 100vw;
    max-height: 100vh;

    @media only screen and (max-width: 950px) {
        min-width: 0;
        width: 100vw;
        height: 100vh;
        transform: none !important;
    }

    &.outofviewport {
        border: 1px solid rgba(255, 0, 0, 0.5);
        h3.flyout-title {
            animation:vibrate 0.5s linear;
            @keyframes vibrate {
                25%, 75% {
                    transform:rotate(2deg);
                }
                50% {
                    transform:rotate(-2deg);
                }
                100% {
                    transform:rotate(0deg);
                }
            }
        }
    }

    ${props => props.resizable && (
        `
            resize: both;
            overflow: auto;
        `
    )}
`;
const FlyoutContent = styled.div`
    overflow: auto;
    max-height: calc(100vh - 57px);

    @media only screen and (max-width: 950px) {
        max-height: calc(100% - 57px);
    }
`;
const FlyoutHeader = styled.div`
    height: 57px;
    width: 100%;
    background-color: ${props => props.theme.getBgColor()};
    border-top: #fdfdfd;
    border-bottom: #fef2ba;
    cursor: grab;
`;

// border-top: 1px solid #ffdf00;
// border-bottom: 5px solid #ebb819;
const HeaderBand = styled.div`
    background-color: ${props => props.theme.getAccentColor()};
    border-top: 1px solid ${props => props.theme.getBgBorderColor()};
    border-bottom: 1px solid ${props => props.theme.getBgBorderBottomColor()};
    height: 14px;
    width: 100%;
`;
const Title = styled.h3`
    float: left;
    margin-left: 20px;
    margin-top: 12px;
    height: 20px;
    display: inline-block;
    font-size: 16px;
    line-height: 20px;
    color: ${props => props.theme.getTextColor()};
`;
const ToolsContainer = styled.div`
    float: right;
    margin-right: 15px;
    height: 16px;
    display: inline-block;
    margin-top: 6px;
    /* Size and color for tool icons from AntD: */
    font-size: ${ICON_SIZE}px;
    > button {
        margin-top: -5px;
        color: ${props => props.iconColor};
    }
    > button:hover {
        color: ${props => props.hoverColor};
    }
`;


export const Flyout = ThemeConsumer(({title = '', children, onClose, bringToTop, options, theme}) => {
    const [position, setPosition] = useState({ x: 210, y: 30 });
    const elementRef = useRef();
    const containerClass = `t_flyout t_${options.id}`
    const onMouseDown = useCallback(() => {
        if (typeof bringToTop === 'function') {
            bringToTop();
        }
        createDraggable(position, setPosition, elementRef)
    }, [position, setPosition, elementRef]);
    /*
    Other tools for toolcontainer:
        <div className="oskari-flyouttool-help"></div>
        <div className="oskari-flyouttool-attach"></div>
        <div className="oskari-flyouttool-detach"></div>
        <div className="oskari-flyouttool-minimize"></div>
        <div className="oskari-flyouttool-restore"></div>
    Maybe allow passing tools from caller?
    */
    const headerTheme = getHeaderTheme(theme);
    return (
        <Container
            className={containerClass}
            ref={elementRef}
            style={{transform: `translate(${position.x}px, ${position.y}px)`}}
            resizable={options.resizable}
        >
            <FlyoutHeader theme={headerTheme} className="oskari-flyouttoolbar" onMouseDown={onMouseDown} onTouchStart={onMouseDown}>
                <HeaderBand theme={headerTheme}/>
                <Title className='flyout-title' theme={headerTheme}>{title}</Title>
                <ToolsContainer iconColor={headerTheme.getToolColor()} hoverColor={headerTheme.getToolHoverColor()}>
                    <CloseIcon onClose={onClose}/>
                </ToolsContainer>
            </FlyoutHeader>
                <FlyoutContent>
                    {children}
                </FlyoutContent>
        </Container>
    );
});

Flyout.propTypes = {
    children: PropTypes.any,
    title: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    bringToTop: PropTypes.func,
    options: PropTypes.object
};
