/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};

    this.config = config;
}, {
    __name: 'WmtsLayerPlugin',

    getName: function () {
        return this.pluginName;
    },
    getMap: function () {
        return this._map;
    },
    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    register: function () {
        this.getMapModule().setLayerPlugin('WmtsLayer', this);
    },
    unregister: function () {
        this.getMapModule().setLayerPlugin('WmtsLayer', null);
    },
    init: function (sandbox) {
        var sandboxName = (this.config ? this.config.sandbox : null) || 'sandbox';
        var sbx = Oskari.getSandbox(sandboxName);

        // register domain builder
        var mapLayerService = sbx.getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
            mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);
        }
    },
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        var p;
        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(this, p);
            }
        }
    },
    stopPlugin: function (sandbox) {
        var p;
        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /*
     * @method start called from sandbox
     */
    start: function (sandbox) {},
    /**
     * @method stop called from sandbox
     *
     */
    stop: function (sandbox) {},
    eventHandlers: {
        'AfterMapLayerAddEvent': function (event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent': function (event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent': function (event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent': function (event) {
            this.afterChangeMapLayerStyleEvent(event);
        }
    },

    onEvent: function (event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    preselectLayers: function (layers) {

        var sandbox = this._sandbox,
            i,
            layer,
            layerId;
        for (i = 0; i < layers.length; i++) {
            layer = layers[i];
            layerId = layer.getId();

            if (layer.isLayerOfType('WMTS')) {
                sandbox.printDebug("preselecting " + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
        }

    },
    /***********************************************************
     * Handle AfterMapLaeyrAddEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerAddEvent: function (event) {
        this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },

    addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {

        if (!layer.isLayerOfType('WMTS')) {
            return;
        }

        var me = this;
        var map = me.getMap();

        var matrixIds = layer.getWmtsMatrixSet().matrixIds;
        var layerDef = layer.getWmtsLayerDef();

        var layerName = null;
        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            layerName = 'basemap_' + layer.getId();
        } else {
            layerName = 'layer_' + layer.getId();
        }

        var sandbox = this._sandbox;

        var imageFormat = "image/png";
        var reqEnc = "KVP";


        var wmtsUrl = //layer.getWmtsUrls()[0]; 
            layerDef.resourceUrl ? (layerDef.resourceUrl.tile ? layerDef.resourceUrl.tile.template : undefined) : undefined;

        if (!wmtsUrl) {
            wmtsUrl = layer.getWmtsUrls()[0][0].url;
        } else {
            reqEnc = "REST";
        }

        var matrixSet = layer.getWmtsMatrixSet();
        matrixIds = [];
        var resolutions = [];
        var serverResolutions = [],
            n,
            scaleDenom,
            res;

        for (n = 0; n < matrixSet.matrixIds.length; n++) {

            matrixIds.push(matrixSet.matrixIds[n]);
            //.identifier);
            scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
            res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
            resolutions.push(res);
            serverResolutions.push(res);
        }

        var wmtsLayerConfig = {
            name: layerName.split('.').join(''),
            url: wmtsUrl,
            requestEncoding: reqEnc,
            layer: layer.getWmtsName(),
            matrixSet: matrixSet.identifier,
            format: imageFormat,
            style: layer.getCurrentStyle().getName(),
            visibility: true,
            transparent: true,
            matrixIds: matrixIds,
            isBaseLayer: layer.isBaseLayer(),
            buffer: 0,
            serverResolutions: serverResolutions,
            visibility : layer.isInScale(sandbox.getMap().getScale()),
            layerDef: layerDef
        };

        sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + matrixSet.identifier + " / " + wmtsLayerConfig.id + "/" + wmtsLayerConfig.layer + "/" + wmtsLayerConfig.url);

        var wmtsLayer = new OpenLayers.Layer.WMTS(wmtsLayerConfig);
        wmtsLayer.opacity = layer.getOpacity() / 100;

        sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);

        map.addLayers([wmtsLayer]);

    },

    getOLMapLayers: function (layer) {
        if (!layer.isLayerOfType('WMTS')) {
            return null;
        }

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            return this._map.getLayersByName('basemap_' + layer.getId());
        } else {
            return this._map.getLayersByName('layer_' + layer.getId());
        }
    },
    /***********************************************************
     * Handle AfterMapLayerRemoveEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerRemoveEvent: function (event) {
        var layer = event.getMapLayer();

        this.removeMapLayerFromMap(layer);
    },
    removeMapLayerFromMap: function (layer) {
        var oLayer = this.getOLMapLayers(layer);

        if (oLayer && oLayer[0]) {
            oLayer[0].destroy();
        }
    },
    afterChangeMapLayerOpacityEvent: function (event) {
        var layer = event.getMapLayer(),
            oLayer = this.getOLMapLayers(layer),
            newOpacity = (layer.getOpacity() / 100);

        if (oLayer && oLayer[0]) {
            oLayer[0].setOpacity(newOpacity);
        }
    },
    /***********************************************************
     * Handle AfterChangeMapLayerStyleEvent
     *
     * @param {Object}
     *            event
     */
    afterChangeMapLayerStyleEvent: function (event) {
        var layer = event.getMapLayer(),
            oLayer = this.getOLMapLayers(layer),
            newStyle = layer.getCurrentStyle().getName();

        if (oLayer && oLayer[0]) {
            oLayer[0].mergeNewParams({
                styles: newStyle
            });
        }
    }
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
