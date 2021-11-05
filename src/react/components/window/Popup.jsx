import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleFilled } from '@ant-design/icons';
import { createDraggable } from './util';

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


export const Popup = ({title = '', children, onClose}) => {
    const [position, setPosition] = useState({ x: 210, y: 30 });
    const elementRef = useRef();
    const onMouseDown = useCallback((event) => createDraggable(position, setPosition, elementRef), [position, setPosition, elementRef]);
    /*

    <div class="divmanazerpopup draggablestack oskari-measurement arrow top" style="opacity: 1; margin-left: 0px; margin-top: 0px; left: 0px; top: 350.641px;">
        <h3 class="popupHeader">Mittaustulokset</h3>
        <div class="popup-body">
            <div class="content">Piirrä mitattava etäisyys klikkaamalla viivan taitepisteitä.</div>
            <div class="actions">
                <input class="oskari-formcomponent oskari-button" type="button" value="Poista kaikki mittaukset">
                <input class="oskari-formcomponent oskari-button" type="button" value="Lopeta">
            </div>
        </div>
    </div>
    */
    return (<Container ref={elementRef} style={{transform: `translate(${position.x}px, ${position.y}px)`}}>
        <PopupHeader onMouseDown={onMouseDown}>
            {title}
            <ToolsContainer>
                <CloseCircleFilled className="oskari-flyouttool-close" onClick={onClose}/>
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
