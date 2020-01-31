import React from 'react';
import { Message } from 'oskari-ui';
import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';

const mapMoveMethodMove = 'move';
const upDownChangePercent = 10;
const bundleKey = 'CameraControls3d';

class UIService extends StateHandler {
    constructor (consumer) {
        super();
        this.mapmodule = Oskari.getSandbox().getStatefulComponents().mapfull.getMapModule();
        // Initially in default move mode
        this.setState({
            activeMapMoveMethod: mapMoveMethodMove
        });
        this.addStateListener(consumer);
    }

    setActiveMapMoveMethod (activeMapMoveMethod) {
        if (this.activeMapMoveMethod === activeMapMoveMethod) {
            return;
        }
        var operationFailed;
        if (activeMapMoveMethod === mapMoveMethodMove) {
            operationFailed = this.mapmodule.setCameraToMoveMode();
        } else {
            operationFailed = this.mapmodule.setCameraToRotateMode();
        }
        if (operationFailed) {
            Messaging.warn({
                title: <Message messageKey='rotateModeFailure.message' bundleKey={bundleKey} />,
                content: <Message messageKey='rotateModeFailure.description' bundleKey={bundleKey} />
            });
            return;
        }
        this.updateState({ activeMapMoveMethod });
    }

    changeCameraAltitude (directionUp) {
        const cam = this.mapmodule.getCamera();
        if (directionUp) {
            cam.location.altitude = cam.location.altitude * ((100 + upDownChangePercent) / 100);
        } else {
            cam.location.altitude = cam.location.altitude * ((100 - upDownChangePercent) / 100);
        }
        this.mapmodule.setCamera(cam);
        Oskari.getSandbox().postRequestByName('MapMoveRequest');
    }

    getActiveMapMoveMethod () {
        return this.state.activeMapMoveMethod;
    }

    resetToInitialState () {
        this.updateState({ 'activeMapMoveMethod': mapMoveMethodMove });
    }
}

export const CameraControls3dHandler = controllerMixin(UIService, [
    'setActiveMapMoveMethod',
    'changeCameraAltitude'
]);
