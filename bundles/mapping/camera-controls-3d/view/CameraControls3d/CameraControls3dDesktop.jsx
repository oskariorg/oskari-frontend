import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { MoveMapIcon, RotateMapIcon, UpIcon, DownIcon } from './CameraControl3dIcons';

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
    background-color: ${props => props.controlIsActive ? secondaryColor : darkBgColor};
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

const Break = styled.div`
    flex-basis: 100%;
    height: 0;
`;

export const CameraControls3dDesktop = ({ activeMapMoveMethod, controller, getMessage }) => {
    const mapInMobileMode = false;

    return (<MapControlsContainer>
        <MapControlContainer controlIsActive = {activeMapMoveMethod === mapMoveMethodMove}>
            <MapControl>
                <MoveMapIcon mapInMobileMode={mapInMobileMode}
                    clickHandler={() => controller.setActiveMapMoveMethod(mapMoveMethodMove)}
                    title={getMessage('tooltip.move')} controlIsActive = {activeMapMoveMethod === mapMoveMethodMove}/>
            </MapControl>
        </MapControlContainer>
        <MapControlContainer controlIsActive = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>
                <RotateMapIcon mapInMobileMode={mapInMobileMode}
                    clickHandler={() => controller.setActiveMapMoveMethod(mapMoveMethodRotate)}
                    title={ getMessage('tooltip.rotate')} controlIsActive = {activeMapMoveMethod === mapMoveMethodRotate}/>
            </MapControl>
        </MapControlContainer>
        <Break/>
        <MapControlContainer disabled = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>
                <UpIcon mapInMobileMode={mapInMobileMode}
                    clickHandler={() => controller.changeCameraAltitude(true)} title={getMessage('tooltip.up')}/>
            </MapControl>
        </MapControlContainer>
        <MapControlContainer disabled = {activeMapMoveMethod === mapMoveMethodRotate}>
            <MapControl>
                <DownIcon mapInMobileMode={mapInMobileMode}
                    clickHandler={() => controller.changeCameraAltitude(false)} title={getMessage('tooltip.down')}/>
            </MapControl>
        </MapControlContainer>
    </MapControlsContainer>);
};

CameraControls3dDesktop.propTypes = {
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};
