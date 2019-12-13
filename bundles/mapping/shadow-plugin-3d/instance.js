/*
Oskari.app.playBundle(
{
  bundlename : 'shadow-plugin-3d'
});
*/

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.mapping.bundle.shadowplugin3d.instance',
    class ShadowingPluginBundleInstance extends BasicBundle {
        constructor () {
            super();
            this._started = false;
            this.plugin = null;
            this._mapmodule = null;
            this._sandbox = null;
            this.state = undefined;
            this._log = Oskari.log('Oskari.mapping.bundle.shadowplugin3d.ShadowingPluginBundleInstance');
            this.__name = 'shadow-plugin-3d';
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
                this._log.warn('Shadowing plugin only supported in 3d mode');
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
            const plugin = Oskari.clazz.create('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin', this);
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
