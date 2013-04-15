/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundleInstance
 *
 * This bundle instance starts the map view, but doesn't work anymore after the
 * new versioning scheme. See
 * Oskari.mapframework.bundle.mapfull.MapFullBundleInstance for current
 * implementation.
 *
 * @deprecated use mapfull bundle instead.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PluginMapModuleBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.name = 'mapmodule';
    this.mediator = null;
    this.sandbox = null;
    this.conf = null;
    this.impl = null;
    this.facade = null;
    this.ui = null;
}, {
    __name : "Oskari.mapframework.bundle.PluginMapModuleBundleInstance",
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method start
     * Implements BundleInstance protocol start method.
     * Creates the map view.
     */
    "start" : function() {

        if (this.mediator.getState() == "started")
            return;

        this.libs = {
            ext : Oskari.$("Ext")
        };

        var facade = Oskari.$('UI.facade');
        this.facade = facade;

        var sandbox = facade.getSandbox();
        this.sandbox = sandbox;

        var conf = Oskari.$("startup");

        this.conf = conf;

        var showIndexMap = conf.mapConfigurations.index_map;
        var showZoomBar = conf.mapConfigurations.zoom_bar;
        var showScaleBar = conf.mapConfigurations.scala_bar;
        var allowMapMovements = conf.mapConfigurations.pan;

        var impl = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
        // impl.setOpt('createTilesGrid', false);
        this.impl = impl;

        var pnl = this._createMapPanel();
        this._panel = pnl;

        var def = this.facade.appendExtensionModule(this.impl, this.name, {}, this, 'Center', {
            'fi' : {
                title : ''
            },
            'sv' : {
                title : '?'
            },
            'en' : {
                title : ''
            }

        }, pnl);
        this.def = def;

        // plugins
        var plugins = [];
        plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
        //plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
        plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
        plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');

        for (var i = 0; i < plugins.length; i++) {
            var plugin = Oskari.clazz.create(plugins[i]);
            impl.registerPlugin(plugin);
        }

        var mapster = this._createMapContainer(this.impl.getMap());
        this._mapster = mapster;
        pnl.add(mapster);

        facade.registerPart('Mapster', this._mapster);

        // call real modules start
        this.impl.start(sandbox);
        this.mediator.setState("started");
        return this;
    },
    /**
     * @method _createMapPanel
     * creates (Ext) map panel
     * @private
     */
    _createMapPanel : function() {
        var xt = this.libs.ext;
        var pnl = xt.create('Ext.Panel', {
            region : 'center',
            layout : 'fit',
            items : []
        });

        return pnl;

    },
    /**
     * @method _createMapContainer
     * creates (Ext) map panel with openlayers map
     * @param {OpenLayers.Map} map
     * @private
     */
    _createMapContainer : function(map) {
        var xt = this.libs.ext;
        var mapster = xt.createWidget('nlsfimappanel', {
            olmap : map,
            layout : 'absolute'
        });

        return mapster;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    "update" : function(manager, b, bi, info) {
        manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop" : function() {

        this.impl.stop();

        this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
        this.def = null;

        this.mediator.setState("stopped");

        return this;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    "protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
