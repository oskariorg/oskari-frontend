import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withLocale } from 'oskari-ui/util';
import { MoveMapIcon, RotateMapIcon, UpIcon, DownIcon } from './CameraControls3d/CameraControl3dIcons';

const upDownChangePercent = 10;
const iconShadow = '1px 1px 2px rgba(0,0,0,0.6)';
const darkBgColor = 'rgba(20,20,20,0.8)';
// TODO: Change secondary color reference later when global way available
const secondaryColor = '#006ce8';
const mapMoveMethodMove = 'move';
const mapMoveMethodRotate = 'rotate';

const MapControlsContainer = styled.div`
    margin-top: 10px;
    margin-left: 5px;
    display: flex;
    flex-wrap: wrap;
    width: 80px;
    align-items: center;
`;

const MapControlContainer = styled.div`
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 15000;
    margin-bottom: 5px;
    margin-left: 5px;
    box-shadow: ${iconShadow};
    background-color: ${props => props.controlIsActive && !props.isMobile ? secondaryColor : darkBgColor};
    opacity: ${props => props.disabled ? 0.3 : 1.0};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const MapControl = styled.div`
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    margin: 0;
    padding-top:3px;
    text-align: center;
`;
const MobileContainer = styled.div`
    margin-top: 5px;
    margin-right: 5px;
`;

const Break = styled.div`
    flex-basis: 100%;
    height: 0;
`;

const getMapModule = () => {
    return Oskari.getSandbox().getStatefulComponents().mapfull.getMapModule();
};

const upDownClickHandler = (directionUp) => {
    const mapmodule = getMapModule();
    const cam = mapmodule.getCamera();
    if (directionUp) {
        cam.location.altitude = cam.location.altitude * ((100 + upDownChangePercent) / 100);
    } else {
        cam.location.altitude = cam.location.altitude * ((100 - upDownChangePercent) / 100);
    }
    mapmodule.setCamera(cam);
    Oskari.getSandbox().postRequestByName('MapMoveRequest');
};

const setCameraToMoveMode = (activeMapMoveMethod) => {
    if (activeMapMoveMethod === mapMoveMethodMove) {
        return;
    }
    getMapModule().setCameraToMoveMode();
};
const setCameraToRotateMode = (activeMapMoveMethod) => {
    if (activeMapMoveMethod === mapMoveMethodRotate) {
        return;
    }
    getMapModule().setCameraToRotateMode();
};

const CameraControls3d = ({ mapInMobileMode, getMessage }) => {
    const [activeMapMoveMethod, setActiveMapMoveMethod] = useState(mapMoveMethodMove);

    const moveMapControl = <MoveMapIcon mapInMobileMode={mapInMobileMode} clickHandler={() => {
        setActiveMapMoveMethod(mapMoveMethodMove);
        setCameraToMoveMode(activeMapMoveMethod);
    }} title={mapInMobileMode ? '' : getMessage('tooltip.move')} controlIsActive = {activeMapMoveMethod === mapMoveMethodMove}/>;

    const rotateMapControl = <RotateMapIcon mapInMobileMode={mapInMobileMode} clickHandler={() => {
        setActiveMapMoveMethod(mapMoveMethodRotate);
        setCameraToRotateMode(activeMapMoveMethod);
    }} title={ mapInMobileMode ? '' : getMessage('tooltip.rotate')} controlIsActive = {activeMapMoveMethod === mapMoveMethodRotate}/>;

    const upControl = <UpIcon mapInMobileMode={mapInMobileMode}
        clickHandler={() => upDownClickHandler(true)} title={mapInMobileMode ? '' : getMessage('tooltip.up')}/>;
    const downControl = <DownIcon mapInMobileMode={mapInMobileMode}
        clickHandler={() => upDownClickHandler(false)} title={mapInMobileMode ? '' : getMessage('tooltip.down')}/>;

    if (mapInMobileMode) {
        return (<MobileContainer>
            {moveMapControl}
            {rotateMapControl}
            {upControl}
            {downControl}
        </MobileContainer>);
    }
    return (<MapControlsContainer>
        <MapControlContainer isMobile={mapInMobileMode} controlIsActive = {activeMapMoveMethod === mapMoveMethodMove}>
            <MapControl>{moveMapControl}</MapControl>
        </MapControlContainer>
        <MapControlContainer isMobile={mapInMobileMode} controlIsActive = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>{rotateMapControl}</MapControl>
        </MapControlContainer>
        <Break/>
        <MapControlContainer disabled = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>{upControl}</MapControl>
        </MapControlContainer>
        <MapControlContainer disabled = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>{downControl}</MapControl>
        </MapControlContainer>
    </MapControlsContainer>);
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(CameraControls3d);
export { contextWrap as CameraControls3d };
