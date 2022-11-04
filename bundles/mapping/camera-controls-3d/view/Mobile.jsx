import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { MoveMapIcon, RotateMapIcon, UpIcon, DownIcon } from './Icons';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';
import { ToolbarButtonItem } from 'oskari-ui/components/buttons';
import { VideoCameraOutlined } from '@ant-design/icons';
const mapMoveMethodMove = 'move';
const mapMoveMethodRotate = 'rotate';

const buildToolbarItems = (controller, activeMapMoveMethod) => {
    return [
        <ToolbarButtonItem
            key='t_map_move'
            className='t_map_move'
            icon={<MoveMapIcon />}
            onClick={() => controller.setActiveMapMoveMethod(mapMoveMethodMove)}
            iconActive={activeMapMoveMethod === mapMoveMethodMove}
        />,
        <ToolbarButtonItem
            key='t_map_rotate'
            className='t_map_rotate'
            icon={<RotateMapIcon />}
            onClick={() => controller.setActiveMapMoveMethod(mapMoveMethodRotate)}
            iconActive={activeMapMoveMethod === mapMoveMethodRotate}
        />,
        <ToolbarButtonItem
            key='t_map_up'
            className='t_map_up'
            icon={<UpIcon />}
            onClick={() => controller.changeCameraAltitude(true)}
            disabled={activeMapMoveMethod === mapMoveMethodRotate}
        />,
        <ToolbarButtonItem
            key='t_map_down'
            className='t_map_down'
            icon={<DownIcon />}
            onClick={() => controller.changeCameraAltitude(false)}
            disabled={activeMapMoveMethod === mapMoveMethodRotate}
        />
    ];
};

export const Mobile = ({ activeMapMoveMethod, controller, styleName, location = 'top left' }) => {
    return (
        <MapModuleButton
            icon={<VideoCameraOutlined />}
            withToolbar
            className='t_mobile_camera_tools'
            toolbarDirection={location.includes('right') ? 'left' : 'right'}
            styleName={styleName}
        >
            {buildToolbarItems(controller, activeMapMoveMethod)}
        </MapModuleButton>
    );
};

Mobile.propTypes = {
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
