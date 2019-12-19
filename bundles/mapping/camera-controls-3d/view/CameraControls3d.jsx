import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { openNotification } from 'oskari-ui';
import { CameraControls3dDesktop } from './CameraControls3d/CameraControls3dDesktop';
import { CameraControls3dMobile } from './CameraControls3d/CameraControls3dMobile';

const CameraControls3d = ({ mapInMobileMode, activeMapMoveMethod, controller, operationFailed, getMessage }) => {
    useEffect(() => {
        if (operationFailed) {
            const options = {
                message: getMessage('rotateModeFailure.message'),
                description: getMessage('rotateModeFailure.description'),
                placement: 'topLeft',
                top: 50
            };
            openNotification('warning', options);
        }
    });

    if (mapInMobileMode) {
        return (
            <CameraControls3dMobile activeMapMoveMethod={activeMapMoveMethod}
                controller={controller} />
        );
    }
    return (
        <CameraControls3dDesktop activeMapMoveMethod={activeMapMoveMethod}
            controller={controller} getMessage = {getMessage}/>
    );
};

CameraControls3d.propTypes = {
    mapInMobileMode: PropTypes.bool.isRequired,
    activeMapMoveMethod: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    operationFailed: PropTypes.bool,
    getMessage: PropTypes.func.isRequired
};
const contextWrap = LocaleConsumer(CameraControls3d);
export { contextWrap as CameraControls3d };
