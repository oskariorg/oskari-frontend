/**
 * @class Oskari.projection.change.instance
 * 
 *      var obj = {
            "bundlename":"asdi-projection-change" ,
            "metadata": {
                "Import-Bundle": { "asdi-projection-change": { "bundlePath": "/Oskari/packages/asdi/bundle/" } }
            }
        }
        appSetup.startupSequence.push(obj);
 */
Oskari.clazz.define("Oskari.projection.change.instance",
function () {

}, {
    __name: 'projection-change',
    getName: function () {
        return this.__name;
    },
    afterStart: function () {
        var sandbox = this.getSandbox();
        this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.createPlugin();
        this.createUi();
        sandbox.register(this);

    },
    getPlugins: function () {
        return this.plugins;
    },
    getViews: function () {
        return this.getAppViews();
    },
    createPlugin: function() {
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.projection.change.ProjectionChangerPlugin', conf, this.getLocalization());

      this._mapmodule.registerPlugin(plugin);
      this._mapmodule.startPlugin(plugin);
      this.plugin = plugin;
    },
    stopPlugin: function() {
      this._mapmodule.unregisterPlugin(this.plugin);
      this._mapmodule.stopPlugin(this.plugin);
      this.plugin = null;
    },
    createUi: function () {
        this.plugin.createUi();
    },
    getAppViews: function () {
        return Oskari.app.getSystemDefaultViews();
    }
}, {
        extend : ["Oskari.userinterface.extension.DefaultExtension"]
});
