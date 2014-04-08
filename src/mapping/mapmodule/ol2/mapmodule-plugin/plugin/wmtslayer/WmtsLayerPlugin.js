/**
 *
 * @class Oskari.ol2.mapmodule.WmtsLayerPlugin
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.ol2.mapmodule.WmtsLayerPlugin', function(config) {

    this.config = config;
}, {
    __name : 'WmtsLayerPlugin',

    init : function(sandbox) {
        var sandboxName = (this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);

        // register domain builder
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer')

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
            mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);
        }
    },

    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        var me = this;

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
        var matrixIds = [];
        var resolutions = [];
        var serverResolutions = [];

        for (var n = 0; n < matrixSet.matrixIds.length; n++) {

            matrixIds.push(matrixSet.matrixIds[n]);
            //.identifier);
            var scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
            var res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
            resolutions.push(res)
            serverResolutions.push(res);
        }

        var wmtsLayerConfig = {
            name : layerName.split('.').join(''),
            url : wmtsUrl,
            requestEncoding : reqEnc,
            layer : layer.getWmtsName(),
            matrixSet : matrixSet.identifier,
            format : imageFormat,
            style : layer.getCurrentStyle().getName(),
            visibility : true,
            isBaseLayer : false,
            transparent : true,
            style : layer.getCurrentStyle().getName(),
            matrixIds : matrixIds,
            isBaseLayer : layer.isBaseLayer(),
            buffer : 0,
            serverResolutions : serverResolutions,
            /*minScale : layer.getMinScale(),
             maxScale : layer.getMaxScale(),*/
            layerDef : layerDef
        };

        sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + matrixSet.identifier + " / " + wmtsLayerConfig.id + "/" + wmtsLayerConfig.layer + "/" + wmtsLayerConfig.url);

        var wmtsLayer = new OpenLayers.Layer.WMTS(wmtsLayerConfig);
        wmtsLayer.opacity = layer.getOpacity() / 100;

        sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);

        this.getMapModule().addLayer(wmtsLayer, layer, layer.getWmtsName());

        if (keepLayerOnTop) {
            this.getMapModule().setLayerIndex(wmtsLayer, this.getMapModule().getLayers().length);
        } else {
            this.getMapModule().setLayerIndex(wmtsLayer, 0);
        }

    },

    _removeMapLayerFromMap : function(layer) {

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            var baseLayerId = "";
            if (layer.getSubLayers().length > 0) {
                for (var i = 0; i < layer.getSubLayers().length; i++) {
                    var remLayer = this.getMapModule().getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                    this.getMapModule().removeLayer(remLayer[0], layer
                    .getSubLayers()[i]);
                }
            } else {
                var remLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
                if (remLayer && remLayer[0]) {
                    this.getMapModule().removeLayer(remLayer[0],layer);
                }
            }
        } else {
            var remLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
            if (remLayer && remLayer[0]) {
                this.getMapModule().removeLayer(remLayer[0],layer);
            }
        }
    },

    _afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            if (layer.getSubLayers().length > 0) {
                for (var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this.getMapModule().getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
            if (mapLayer[0] != null) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        }
    },
    /***********************************************************
     * Handle AfterChangeMapLayerStyleEvent
     *
     * @param {Object}
     *            event
     */
    _afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        /** Change selected layer style to defined style */
        if (!layer.isBaseLayer()) {
            var styledLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
            if (styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
        }
    },
    getLayerTypeIdentifier : function() {
        return 'wmtslayer';
    },
    getLayerTypeSelector : function() {
        return 'WMTS';
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
    "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"]
});
