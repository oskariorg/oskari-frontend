import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createDraggable, getPositionForCentering, createDocumentSizeHandler, createDraggableSizeHandler } from './util';
import { monitorResize, unmonitorResize } from './WindowWatcher';
import { ThemeConsumer } from '../../util/contexts';
import { getFontClass } from '../../theme/ThemeHelper';
import { Header } from './Header';
import { PLACEMENTS } from './';

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
// Note! use vh with max-height so it can handle window size changes
const PopupBody = styled.div`
    max-height: 90vh;
    overflow: auto;
`;


export const Popup = ThemeConsumer(( {title = '', children, onClose, bringToTop, options, theme={}}) => {
    // hide before we can calculate centering coordinates
    const [position, setPosition] = useState({ x: -10000, y: 0, centered: false });
    const containerProps = {
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`
        },
        className: `t_popup t_${options.id} ${getFontClass(theme)}`
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

    const bodyResizeHandler = createDocumentSizeHandler(elementRef, position, setPosition);
    const popupResizeHandler = createDraggableSizeHandler(elementRef, position, setPosition);
    const handleUnmounting = () => {
        unmonitorResize(popupResizeHandler);
        unmonitorResize(bodyResizeHandler);
    }
    useEffect(() => {
        monitorResize(document.body, bodyResizeHandler);
        monitorResize(elementRef.current, popupResizeHandler);
        if (position.centered) {
            return handleUnmounting;
        }
        // center after content has been rendered
        let placement = options.placement;
        // Open on bottom/top on mobile to prevent popup overflowing the screen
        if (Oskari.util.isMobile()) {
            if (placement && placement.indexOf('bottom') > -1) {
                placement = PLACEMENTS.BOTTOM;
            } else {
                placement = PLACEMENTS.TOP;
            }
        }
        setPosition({
            ...getPositionForCentering(elementRef, placement),
            centered: true
        });
        return handleUnmounting;
    });

    return (<Container {...containerProps}>
        <Header
            title={title}
            onClose={onClose}
            isDraggable={headerProps.isDraggable}
            {...headerProps}
        />
        <PopupBody className="t_body">
            {children}
        </PopupBody>
    </Container>)
});

Popup.propTypes = {
    children: PropTypes.any,
    title: PropTypes.any,
    onClose: PropTypes.func.isRequired,
    bringToTop: PropTypes.func,
    options: PropTypes.object
};
