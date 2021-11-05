import React, { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleFilled } from '@ant-design/icons';
import { createDraggable, getPositionForCentering } from './util';

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
    z-index: 50000;
`;

const PopupHeader = styled.h3`
    background-color: #FDF8D9;
    padding: 8px 10px;
`;
const ToolsContainer = styled.div`
    float: right;
    height: 16px;
    display: inline-block;
    /* Size and color for tool icons from AntD: */
    font-size: 18px;
    color: black;
    > span:hover {
        color: #ffd400;
    }
`;


export const Popup = ({title = '', children, onClose, opts = {}}) => {
    // hide before we can calculate centering coordinates
    const [position, setPosition] = useState({ x: -10000, y: 0, centered: false });
    const containerProps = {
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`
        }
    };
    const elementRef = useRef();
    const headerProps = {};
    if (opts.isDraggable === true) {
        containerProps.ref = elementRef;
        headerProps.onMouseDown = useCallback(() => createDraggable(position, setPosition, elementRef), [position, setPosition, elementRef]);
    }
    useEffect(() => {
        if (position.centered) {
            return;
        }
        // center after content has been rendered
        setPosition({
            ...getPositionForCentering(elementRef),
            centered: true
        });
    });
    /*
    Previously:
    <div class="divmanazerpopup arrow top">
        <h3 class="popupHeader">title</h3>
        <div class="popup-body">content</div>
    </div>
    */
    return (<Container {...containerProps}>
        <PopupHeader {...headerProps}>
            {title}
            <ToolsContainer>
                <CloseCircleFilled className="t_popup-close" onClick={onClose}/>
            </ToolsContainer>
        </PopupHeader>
        <div className="t_popup-body">
            {children}
        </div>
    </Container>)
};

Popup.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired
};
