const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.mapping.cameracontrols3d.instance',
    class CameraControls3dBundleInstance extends BasicBundle {
        constructor () {
            super();
            this._started = false;
            this.plugin = null;
            this._mapmodule = null;
            this._sandbox = null;
            this.state = undefined;
            this.name = 'camera-controls-3d';
        }
        getName () {
            return this.name;
        }
        start (sandbox) {
            if (this._started) {
                return;
            }
            this.sandbox = sandbox || Oskari.getSandbox();
            this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.createPlugin();
            this.sandbox.register(this);
            this._started = true;
        }
        createPlugin () {
            if (this.plugin) {
                return;
            }
            this.plugin = Oskari.clazz.create('Oskari.mapping.cameracontrols3d.CameraControls3dPlugin');
            this._mapmodule.registerPlugin(this.plugin);
            this._mapmodule.startPlugin(this.plugin);
        }
        stopPlugin () {
            this._mapmodule.unregisterPlugin(this.plugin);
            this._mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        }
        stop () {
            this.stopPlugin();
            this.sandbox = null;
            this.started = false;
        }
    }
);
