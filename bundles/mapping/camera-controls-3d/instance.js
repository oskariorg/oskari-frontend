/*
Oskari.app.playBundle(
{
  bundlename : 'camera-controls-3d'
});
*/
Oskari.clazz.define('Oskari.mapping.cameracontrols3d.CameraControls3dBundleInstance',
    function () {
        this._started = false;
        this.plugin = null;
        this._mapmodule = null;
        this._sandbox = null;
        this.state = undefined;
    }, {
        __name: 'camera-controls-3d',
        /**
        * @method getName
        * @return {String} the name for the component
        */
        getName: function () {
            return this.__name;
        },
        init: function () {},
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        start: function (sandbox) {
            if (this._started) {
                return;
            }
            this._started = true;
            sandbox = sandbox || Oskari.getSandbox();
            this.setSandbox(sandbox);
            this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.createPlugin();
            sandbox.register(this);
        },
        createPlugin: function () {
            if (this.plugin) {
                return;
            }
            var conf = this.conf || {};
            var plugin = Oskari.clazz.create('Oskari.mapping.cameracontrols3d.CameraControls3dPlugin', conf);
            this._mapmodule.registerPlugin(plugin);
            this._mapmodule.startPlugin(plugin);
            this.plugin = plugin;
        },
        stopPlugin: function () {
            this._mapmodule.unregisterPlugin(this.plugin);
            this._mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        },
        stop: function () {
            this.stopPlugin();
            this.sandbox = null;
            this.started = false;
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance']
    });
