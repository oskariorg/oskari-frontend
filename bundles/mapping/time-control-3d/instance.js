const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.mapping.time-control-3d.instance',
    class TimeControl3d extends BasicBundle {
        constructor () {
            super();
            this._started = false;
            this.plugin = null;
            this._mapmodule = null;
            this._sandbox = null;
            this.state = undefined;
            this.__name = 'time-control-3d';
            this._log = Oskari.log(this.__name);
        }

        getName () {
            return this.__name;
        }

        getSandbox () {
            return this._sandbox;
        }

        start (sandbox) {
            if (this._started) {
                return;
            }
            this._sandbox = sandbox || Oskari.getSandbox();
            this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            if (!this._mapmodule.getSupports3D()) {
                this._log.warn('TimeControl3d is only supported in 3d mode');
                return;
            }
            this.createPlugin();
            this._sandbox.register(this);
            this._started = true;
        }

        createPlugin () {
            if (this.plugin) {
                return;
            }
            const conf = this.conf || {};
            const plugin = Oskari.clazz.create('Oskari.mapping.time-control-3d.TimeControl3dPlugin', conf);
            this._mapmodule.registerPlugin(plugin);
            this._mapmodule.startPlugin(plugin);
            this.plugin = plugin;
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
