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
function () {

}, {
    __name: 'map-projection',
    getName: function () {
        return this.__name;
    },
    afterStart: function () {
        var sandbox = this.getSandbox();
        this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.map.projection.flyout', this, {
            width: 'auto',
            cls: 'projection-changer-flyout'
        });
        this.plugins['Oskari.userinterface.Flyout'].makeDraggable({
            handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
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
        return this.hardcodedViews();
    },
    createPlugins: function( enabled, publisher ) {
      if(typeof publisher === 'undefined'){
        publisher = false;
      }
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.mapping.projection.ProjectionChangerPlugin', conf, this);

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
    
    eventHandlers: {
        // 'userinterface.ExtensionUpdatedEvent': function (event) {
        //     if( event.getExtension().getName() !== me.getName() ) {
        //         return;
        //     }
        //     var wasClosed = event.getViewState() === 'close';
        //     if ( wasClosed ) {
        //         debugger;
        //     } else {
        //         debugger;
        //     }
        // }
    },
    hardcodedViews: function () {
        var views = [
            {
                "uuid":"379e1ac2-f3d4-437a-8bca-e8755516e1e6",
                "name":"Paikkatietoikkuna.fi",
                "srsName":"EPSG:3067",
                "imgCls": 'alaska'
            },
            {
                "uuid":"0364d4a4-97d0-4823-89d8-9532a8869ddb",
                "name":"Paikkatietoikkuna.fi",
                "srsName":"EPSG:3067",
                "imgCls": 'bering'
            },
            {
                "uuid":"90246d84-3958-fd8c-cb2c-2510cccca1d3",
                "name":"Paikkatietoikkuna",
                "srsName":"EPSG:3067",
                "imgCls": 'bering'
            },
            {
                imgCls: 'bering',
                name: 'Atlantic'
            },
            {
                imgCls: 'bering',
                name: 'Europe'
            },
            {
                imgCls: 'bering',
                name: 'Russia'
            }
        ];
        return views;
    }
}, {
        extend : ["Oskari.userinterface.extension.DefaultExtension"]
});
