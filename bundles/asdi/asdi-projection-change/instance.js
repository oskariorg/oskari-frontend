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
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.projection.change.flyout', this, {
            width: 'auto',
            cls: 'projection-change-flyout'
        });
        this.plugins['Oskari.userinterface.Flyout'].makeDraggable({
            handle : '.oskari-flyouttoolbar, .projection-data-container > .header',
            scroll : false
        });
        this.plugins['Oskari.userinterface.Flyout'].bringToTop();
        this.createPlugins();
        this.createUi();
        sandbox.register(this);

    },
    getPlugins: function () {
        return this.plugins;
    },
    getFlyout: function () {
        return this.plugins['Oskari.userinterface.Flyout'];
    },
    getViews: function () {
        return this.getAppViews();
    },
    createPlugins: function( enabled, publisher ) {
      if (typeof publisher === 'undefined') {
        publisher = false;
      }
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.projection.change.ProjectionChangerPlugin', conf, this);

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
