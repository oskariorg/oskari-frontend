import { StateHandler, mutatorMixin } from 'oskari-ui/util';

const mapMoveMethodMove = 'move';
const upDownChangePercent = 10;

class UIService extends StateHandler {
    constructor (consumer) {
        super();
        // Initially in default move mode
        this.state = {
            activeMapMoveMethod: mapMoveMethodMove
        };
        this.listeners = [consumer];
        this.mapmodule = Oskari.getSandbox().getStatefulComponents().mapfull.getMapModule();
    }

    setActiveMapMoveMethod (activeMapMoveMethod) {
        if (this.activeMapMoveMethod === activeMapMoveMethod) {
            return;
        }
        if (activeMapMoveMethod === mapMoveMethodMove) {
            this.mapmodule.setCameraToMoveMode();
        } else {
            this.mapmodule.setCameraToRotateMode();
        }
        this.updateState({ activeMapMoveMethod });
        this.notify();
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

    notify () {
        this.listeners.forEach(consumer => consumer());
    }
}

export const CameraControls3dHandler = mutatorMixin(UIService, [
    'setActiveMapMoveMethod',
    'changeCameraAltitude'
]);
