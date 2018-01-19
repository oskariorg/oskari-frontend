/**
 * @class Oskari.map.projection.instance
 * 
 *      var obj = {
            "bundlename":"asdi-map-projection" ,
            "metadata": {
                "Import-Bundle": { "asdi-map-projection": { "bundlePath": "/Oskari/packages/asdi/bundle/" } }
            }
        }
        appSetup.startupSequence.push(obj);
 */
Oskari.clazz.define("Oskari.map.projection.instance",
function() {

    }, {
    __name: 'map-projection',
    getName: function () {
        return this.__name;
    },
    afterStart: function () {
        var sandbox = this.getSandbox();
        this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var locale = this.getLocalization();
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.map.projection.flyout', this);
        this.createPlugins();
        this.createUi();
        sandbox.register(this);
    },
    getPlugins: function() {
        return this.plugins;
    },
    getFlyout: function () {
        return this.plugins['Oskari.userinterface.Flyout'];
    },
    createPlugins: function( enabled, publisher ) {
      if(typeof publisher === 'undefined'){
        publisher = false;
      }
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.mapping.projection.ProjectionChangerPlugin', this);

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
    }
}, {
        extend : ["Oskari.userinterface.extension.DefaultExtension"],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
