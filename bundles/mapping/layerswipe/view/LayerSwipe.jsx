import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';

export const SPLITTER_WIDTH = 5;
export const MARGIN = {
    desktop: 2,
    mobile: 5
};
const Mask = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
`;

const DragWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${props => props.$width}px;
    cursor: grab;
`;

const Splitter = styled.div`
    width: ${SPLITTER_WIDTH}px;
    background-color: ${props => props.$color};
    height: 100%;
    margin-left: ${props => props.isMobile ? MARGIN.mobile : MARGIN.desktop}px;
`;

const createDraggable = (elementRef, position, limits, setPosition, setDragging) => {
    const element = elementRef.current;
    // previousTouch is assigned in onTouchMove to track change and onMouseUp for reset
    let previousTouch;
    const { min, max } = limits;
    const onTouchMove = (event) => {
        // prevents text selection from other elements while dragging
        event.preventDefault();
        event.stopPropagation();
        if (!element) {
            return;
        }
        const touch = event.touches[0];
        if (previousTouch) {
            onGenericMove(touch.pageX - previousTouch.pageX);
        };
        previousTouch = touch;
    };
    const onMouseMove = (event) => {
        // prevents text selection from other elements while dragging
        setDragging(true);
        event.preventDefault();
        event.stopPropagation();
        if (!element) {
            return;
        }
        onGenericMove(event.movementX);
    };
    const onGenericMove = (deltaX) => {
        position += deltaX;
        const outFromLeft = position < min;
        const outFromRight = position > max;
        const outOfScreen = outFromLeft || outFromRight;
        if (!outOfScreen) {
            setPosition(position);
        } else if (outFromLeft) {
            setPosition(min);
        } else if (outFromRight) {
            setPosition(max);
        }
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onMouseUp);
        document.removeEventListener('touchcancel', onMouseUp);
        previousTouch = null;
        setDragging(false);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('touchcancel', onMouseUp);
};

export const LayerSwipe = ThemeConsumer(({ theme, position, mapSize, isMobile, controller }) => {
    const [dragging, setDragging] = useState(false);
    const elementRef = useRef();
    const helper = getHeaderTheme(theme);

    const margin = isMobile ? MARGIN.mobile : MARGIN.desktop;
    const width = SPLITTER_WIDTH + 2 * margin;
    const limits = { min: -margin, max: mapSize.width - SPLITTER_WIDTH };
    const style = { transform: `translate(${position - margin}px` };

    const onEvent = useCallback(() => createDraggable(elementRef, position, limits, controller.setPosition, setDragging), [position, limits]);
    const swipe = (
        <DragWrapper
            ref={elementRef}
            style={style}
            $width={width}
            onMouseDown={() => onEvent()}
            onTouchStart={() => onEvent()} >
            <Splitter $color={helper.getAccentColor()} isMobile={isMobile}/>
        </DragWrapper>
    );
    if (dragging) {
        return (
            <Mask onMouseMove={event => event.preventDefault()}>
                {swipe}
            </Mask>
        );
    }
    return swipe;
});

LayerSwipe.propTypes = {
    position: PropTypes.number,
    mapWidth: PropTypes.number,
    controller: PropTypes.object
};
