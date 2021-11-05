import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleFilled } from '@ant-design/icons';

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20009;
    background:white;
    min-width: 300px;
`;

const FlyoutHeader = styled.div`
    height: 57px;
    width: 100%;
    background-color: #fdf8d9;
    border-top: #fdfdfd;
    border-bottom: #fef2ba;
`;
const HeaderBand = styled.div`
    background-color: #ffd400;
    border-top: 1px solid #ffdf00;
    border-bottom: 1px solid #ebb819;
    height: 14px;
    width: 100%;
`;
const Title = styled.div`
    float: left;
    margin-left: 20px;
    margin-top: 12px;
    height: 20px;
    display: inline-block;
    font-size: 16px;
    line-height: 20px;
`;
const ToolsContainer = styled.div`
    float: right;
    margin-right: 25px;
    height: 16px;
    display: inline-block;
    margin-top: 12px;
    /* Size and color for tool icons from AntD: */
    font-size: 18px;
    color: black;
    > span:hover {
        color: #ffd400;
    }
`;

const getAvailableWidth = () => {
    // width of <body>
    return document.body.clientWidth ||
        // width of <html>
        document.documentElement.clientWidth ||
        // window's width
        window.innerWidth;
};
const getAvailableHeight = () => {
    // height of <body>
    return document.body.clientHeight ||
        // height of <html>
        document.documentElement.clientHeight ||
        // window's height
        window.innerHeight;
};

export const Flyout = ({title = '', children, onClose}) => {
    const [position, setPosition] = useState({ x: 210, y: 30 });
    const elementRef = useRef();
    
    const onMouseDown = useCallback(
        (event) => {
            const element = elementRef.current;
            let width = 50;
            let height = 30;
            if (element) {
                const bounds = element.getBoundingClientRect();
                width = bounds.width;
                height = bounds.height;
            }
            const availableWidth = getAvailableWidth();
            const availableHeight = getAvailableHeight();
            const onMouseMove = (event) => {
                // prevents text selection from other elements while dragging
                event.preventDefault();
                position.x += event.movementX;
                position.y += event.movementY;
                const outOfScreen = (position.x < 0 || position.x + width > availableWidth) || (position.y < 0 || position.y + height > availableHeight);
                const element = elementRef.current;
                if (!outOfScreen && element) {
                    // don't make the actual move if we would move off-screen or we don't get an element to move
                    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
                }
                // update state anyway so the flyout will start moving at/jump to where the mouse cursor re-enters the viewport
                setPosition(position);
            };
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [position, setPosition, elementRef]
    );
    /*
    Other tools for toolcontainer:
        <div className="oskari-flyouttool-help"></div>
        <div className="oskari-flyouttool-attach"></div>
        <div className="oskari-flyouttool-detach"></div>
        <div className="oskari-flyouttool-minimize"></div>
        <div className="oskari-flyouttool-restore"></div>
    Maybe allow passing tools from caller?
    */
    return (<Container ref={elementRef} style={{transform: `translate(${position.x}px, ${position.y}px)`}}>
        <FlyoutHeader className="oskari-flyouttoolbar" onMouseDown={onMouseDown}>
            <HeaderBand />
            <Title>{title}</Title>
            <ToolsContainer>
                <CloseCircleFilled className="oskari-flyouttool-close" onClick={onClose}/>
            </ToolsContainer>
        </FlyoutHeader>
        <div>
            {children}
        </div>
    </Container>)
};

Flyout.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired
};
