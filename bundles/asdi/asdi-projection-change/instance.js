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
    this.sandbox = null;
    this.loc = null;
}, {
    __name: 'projection-change',
    getName: function () {
        return this.__name;
    },
    start: function () {
        this.sandbox = Oskari.getSandbox();
        this.loc = Oskari.getLocalization('projection-change');
        this._mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

        this.createPlugin();
        this.createUi();

        this.sandbox.addRequestHandler('ShowProjectionChangerRequest', this);
    },
    getViews: function () {
        return this.getAppViews();
    },
    handleRequest: function (core, request) {
        this.plugin.getFlyout().show();
    },
    createPlugin: function() {
      var params = {
        views: this.getAppViews(),
        loc: this.loc,
        sb: this.sandbox  
      }
      var plugin = Oskari.clazz.create('Oskari.projection.change.ProjectionChangerPlugin', params, this.loc );

      this._mapmodule.registerPlugin(plugin);
      this._mapmodule.startPlugin(plugin);
      this.plugin = plugin;
    },
    stopPlugin: function() {
      this._mapmodule.unregisterPlugin(this.plugin);
      this._mapmodule.stopPlugin(this.plugin);
      this.sandbox.removeRequestHandler('ShowProjectionChangerRequest', this);
      this.plugin = null;
    },
    createUi: function () {
        if ( Oskari.util.isMobile() ) {
            this.plugin.createMobileUi();
        } else {
            this.plugin.createUi();
        }
    },
    getAppViews: function () {
        return Oskari.app.getSystemDefaultViews();
    }
});
