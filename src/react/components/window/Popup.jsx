import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseIcon } from './CloseIcon';
import { createDraggable, getPositionForCentering, OUTOFSCREEN_CLASSNAME } from './util';
import { monitorResize, unmonitorResize } from './WindowWatcher';
import { ICON_SIZE } from './constants';
import { ThemeConsumer } from '../../util/contexts';
import { getHeaderTheme } from '../../theme/ThemeHelper';

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    max-width: 800px;
    min-width: 200px;
    background-color: white;
    background-clip: border-box;
    background-clip: padding-box;
    background-clip: content-box;
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    z-index: 30000;

    &.outofviewport {
        border: 5px solid rgba(100, 0, 0, 0.5);

        h3 {
            animation:vibrate 0.5s linear;
            @keyframes vibrate {
                25%, 75% {
                    transform:rotate(1deg);
                }
                50% {
                    transform:rotate(-1deg);
                }
                100% {
                    transform:rotate(0deg);
                }
            }
        }
    }
`;

const PopupHeader = styled.h3`
    background-color: ${props => props.theme.getBgColor()};
    color:  ${props => props.theme.getTextColor()};
    padding: 8px 10px;
    display: flex;
    cursor: ${props => props.isDraggable ? 'grab' : undefined}
`;
const PopupTitle = styled.span`
    margin-right: auto;
    width: 100%;
`;
// Note! max-height isn't recalculated when window size changes :(
const PopupBody = styled.div`
    max-height: ${window.innerHeight - 100}px;
    overflow: auto;
`;
const ToolsContainer = styled.div`
    margin-left: 10px;
    height: 16px;
    display: inline-block;
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


export const Popup = ThemeConsumer(( {title = '', children, onClose, bringToTop, options, theme={}}) => {
    // hide before we can calculate centering coordinates
    const [position, setPosition] = useState({ x: -10000, y: 0, centered: false });
    const containerProps = {
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`
        },
        className: `t_popup t_${options.id}`
    };
    const elementRef = useRef();
    const headerProps = {
        isDraggable: !!options.isDraggable
    };
    const headerFuncs = [];
    if (typeof bringToTop === 'function') {
        headerFuncs.push(bringToTop);
    }
    if (options.isDraggable === true) {
        containerProps.ref = elementRef;
        headerFuncs.push(useCallback(() => createDraggable(position, setPosition, elementRef), [position, setPosition, elementRef]));
    }
    if (headerFuncs.length) {
        headerProps.onMouseDown = () => headerFuncs.forEach(fn => fn());
        headerProps.onTouchStart = () => headerFuncs.forEach(fn => fn());
    }
    const bodyResizeHandler = (newSize, prevSize) => {
        const windowIsNowBigger = prevSize.width < newSize.width || prevSize.height < newSize.height;
        const popupNoLongerOnScreen = position.x > newSize.width || position.y > newSize.height;
        if (elementRef.current && (windowIsNowBigger || popupNoLongerOnScreen)) {
            // Note! The class is added in createDraggable()
            // but we might not be able to remove it there after recentering on window size change
            // remove it if window is now bigger
            elementRef.current.classList.remove(OUTOFSCREEN_CLASSNAME);
        }
        if (popupNoLongerOnScreen) {
            // console.log('Popup relocating! Window size changed from', prevSize, 'to', newSize);
            setPosition({
                ...position,
                centered: false
            });
        }
    };
    const handleUnmounting = () => unmonitorResize(bodyResizeHandler);
    useEffect(() => {
        monitorResize(document.body, bodyResizeHandler);
        if (position.centered) {
            return handleUnmounting;
        }
        // center after content has been rendered
        setPosition({
            ...getPositionForCentering(elementRef, options.placement),
            centered: true
        });
        return handleUnmounting;
    });
    /*
    Previously:
    <div class="divmanazerpopup arrow top">
        <h3 class="popupHeader">title</h3>
        <div class="popup-body">content</div>
    </div>
    */

    const headerTheme = getHeaderTheme(theme);
    return (<Container {...containerProps}>
        <PopupHeader theme={headerTheme} {...headerProps}>
            <PopupTitle>{title}</PopupTitle>
            <ToolsContainer iconColor={headerTheme.getToolColor()} hoverColor={headerTheme.getToolHoverColor()}>
                <CloseIcon onClose={onClose}/>
            </ToolsContainer>
        </PopupHeader>
        <PopupBody className="t_body">
            {children}
        </PopupBody>
    </Container>)
});

Popup.propTypes = {
    children: PropTypes.any,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onClose: PropTypes.func.isRequired,
    bringToTop: PropTypes.func,
    options: PropTypes.object
};
