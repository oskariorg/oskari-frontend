import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { MoveMapIcon, RotateMapIcon, UpIcon, DownIcon } from './Icons';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';

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
    margin-bottom: 5px;
    margin-left: 5px;
`;

const Break = styled.div`
    flex-basis: 100%;
    height: 0;
`;

export const Desktop = LocaleConsumer(({ activeMapMoveMethod, controller, getMessage, styleName }) => {
    return (<MapControlsContainer>
        <MapControlContainer>
            <MapModuleButton
                onClick={() => controller.setActiveMapMoveMethod(mapMoveMethodMove)}
                icon={<MoveMapIcon />}
                title={getMessage('tooltip.move')}
                iconActive={activeMapMoveMethod === mapMoveMethodMove}
                styleName={styleName}
                iconSize='24px'
                noMargin
                className='t_map_move'
            />
        </MapControlContainer>
        <MapControlContainer>
            <MapModuleButton
                onClick={() => controller.setActiveMapMoveMethod(mapMoveMethodRotate)}
                icon={<RotateMapIcon />}
                title={getMessage('tooltip.rotate')}
                iconActive={activeMapMoveMethod === mapMoveMethodRotate}
                styleName={styleName}
                iconSize='24px'
                noMargin
                className='t_map_rotate'
            />
        </MapControlContainer>
        <Break/>
        <MapControlContainer>
            <MapModuleButton
                onClick={() => controller.changeCameraAltitude(true)}
                icon={<UpIcon />}
                title={getMessage('tooltip.up')}
                styleName={styleName}
                iconSize='24px'
                noMargin
                disabled={activeMapMoveMethod === mapMoveMethodRotate}
                className='t_map_up'
            />
        </MapControlContainer>
        <MapControlContainer>
            <MapModuleButton
                onClick={() => controller.changeCameraAltitude(false)}
                icon={<DownIcon />}
                title={getMessage('tooltip.down')}
                styleName={styleName}
                iconSize='24px'
                noMargin
                disabled={activeMapMoveMethod === mapMoveMethodRotate}
                className='t_map_down'
            />
        </MapControlContainer>
    </MapControlsContainer>);
});

Desktop.propTypes = {
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
