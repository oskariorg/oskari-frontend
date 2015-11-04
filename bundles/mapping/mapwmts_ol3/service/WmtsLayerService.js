/**
 *
 * A service to act as a WMTS Layer Source
 *
 * Requires services from MapLayerService (addLayer,removeLayer) (Will create
 * own domain objects, though)
 *
 */

Oskari.clazz.define('Oskari.mapframework.wmts.service.WMTSLayerService', function (mapLayerService, sandbox) {
    this.mapLayerService = mapLayerService;
    this.sandbox = sandbox;
    this.capabilities = {};
    this.requestsMap = {};
}, {
    /**
     * TEmp
     */
    setCapabilities: function (name, caps) {
        this.capabilities[name] = caps;

    },

    /**
     * Temp
     */
    getCapabilities: function (name) {
        return this.capabilities[name];
    },

    /**
     * @public @method getCapabilitiesForLayer
     * Sends layerId to backend for getting WMTS capabilies for layer.
     *
     * @param {Object} parameters for the get
     * @param {Function} success the success callback
     * @param {Function} failure the failure callback
     *
     */
    getCapabilitiesForLayer: function (layer, success, failure) {
        var me = this;
        var url = layer.getLayerUrl();
        var format = new ol.format.WMTSCapabilities();
        var getCapsUrl = this.sandbox.getAjaxUrl() + 'action_route=GetLayerCapabilities';

        var caps = this.getCapabilities(url);
        if(caps) {
            // return with cached capabilities
            var wmtsOptions = ol.source.WMTS.optionsFromCapabilities(caps, me.__getLayerConfig(caps, layer));
            var wmtsLayer = new ol.layer.Tile({
                source: new ol.source.WMTS(wmtsOptions),
                transparent: true,
                visible: layer.isInScale(this.sandbox.getMap().getScale()) && layer.isVisible()
            });
            success(wmtsLayer);
            return;
        }


        // gather capabilities requests
        // make ajax call just once and invoke all callbacks once finished
        var triggerAjaxBln = false;
        if(!this.requestsMap[url]) {
            this.requestsMap[url] = [];
            triggerAjaxBln = true;
        }
        this.requestsMap[url].push(arguments);

        if(triggerAjaxBln) {
            jQuery.ajax({
                data: {
                    id : layer.getId()
                },
                dataType : "xml",
                type : "GET",
                url : getCapsUrl,
                success : function(response) {
                    var caps = format.read(response);
                    me.setCapabilities(url, caps);
                    me.__handleCallbacksForLayerUrl(url);
                },
                error: function() {
                    me.__handleCallbacksForLayerUrl(url, true);
                }
            });
        }
    },
    /**
     * Invokes capabilities request callbacks once we have the data fetched.
     * @private
     * @param  {String}  url           layerUrl
     * @param  {Boolean} invokeFailure true to call the error callback (optional)
     */
    __handleCallbacksForLayerUrl : function(url, invokeFailure) {
        var me = this;
        var caps = this.getCapabilities(url);
        _.each(this.requestsMap[url], function(args) {
            if(!invokeFailure) {
                var layer = args[0];
                var options = ol.source.WMTS.optionsFromCapabilities(caps, {layer: layer.getLayerName(), matrixSet: layer.getWmtsMatrixSetId()});

                var wmtsLayer = new ol.layer.Tile({
                    opacity: layer.getOpacity() / 100.0,
                    source : new ol.source.WMTS(options)
                });
                args[1](wmtsLayer);
            }
            else if (args.length > 2 && typeof args[2] === 'function') {
                args[2]();
            }
        });
    },
    __getLayerConfig : function(caps, layer) {

            // default params and options
            // URL is tuned serverside so we use the correct one
            var config = {
                url : layer.getTileUrl(),
                name : 'layer_' + layer.getId(),
                style: layer.getCurrentStyle().getName(),
                layer: layer.getLayerName(),
                matrixSet: layer.getWmtsMatrixSetId(),
                params : {},
                buffer: 0,
                displayInLayerSwitcher: false,
                isBaseLayer: false
            };

            var capsLayer = _.find(caps.Contents.Layer, function(capsLayer) {
              return capsLayer.Identifier === config.layer;
            });

            // override default params and options from layer
            _.each(layer.getOptions(), function(value, key) {
                config[key] = value;
            });

            _.each(layer.getParams(), function(value, key) {
                config.params[key] = value;
            });

            return config;
    }
});