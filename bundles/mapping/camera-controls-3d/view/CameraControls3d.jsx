import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { CameraControls3dDesktop } from './CameraControls3d/CameraControls3dDesktop';
import { CameraControls3dMobile } from './CameraControls3d/CameraControls3dMobile';

export const CameraControls3d = ({ mapInMobileMode, activeMapMoveMethod, controller }) => {
    if (mapInMobileMode) {
        return (<CameraControls3dMobile activeMapMoveMethod={activeMapMoveMethod}
            controller={controller}/>);
    }
    return (<CameraControls3dDesktop activeMapMoveMethod={activeMapMoveMethod}
        controller={controller} />);
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
