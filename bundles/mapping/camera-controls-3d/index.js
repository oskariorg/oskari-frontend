import './instance';
import './plugin/CameraControls3dPlugin';
import './tool/CameraControls3dTool';

// register create function for bundleid
Oskari.bundle('camera-controls-3d', () => Oskari.clazz.create('Oskari.mapping.cameracontrols3d.instance'));
