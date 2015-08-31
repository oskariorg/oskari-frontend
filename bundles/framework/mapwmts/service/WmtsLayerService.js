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
        var format = new OpenLayers.Format.WMTSCapabilities();
        var getCapsUrl = this.sandbox.getAjaxUrl() + 'action_route=GetLayerCapabilities';
        var caps = this.getCapabilities(url);
        if(caps) {
            // return with cached capabilities
            var wmtsLayer = format.createLayer(caps, me.__getLayerConfig(caps, layer));
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
        var format = new OpenLayers.Format.WMTSCapabilities();
        var caps = this.getCapabilities(url);
        _.each(this.requestsMap[url], function(args) {
            if(!invokeFailure) {
                var wmtsLayer = format.createLayer(caps, me.__getLayerConfig(caps, args[0]));
                args[1](wmtsLayer);
            }
            else if (args.length > 2 && typeof args[2] === 'function') {
                args[2]();
            }
        });
    },
    __getLayerConfig : function(caps, layer) {

            // default params and options
            var config = {
                name : 'layer_' + layer.getId(),
                style: layer.getCurrentStyle().getName(),
                layer: layer.getLayerName(),
                matrixSet: layer.getWmtsMatrixSetId(),
                params : {},
                visibility: layer.isInScale(this.sandbox.getMap().getScale()),
                
                displayInLayerSwitcher: false,
                isBaseLayer: false,
                buffer: 0
            };

            var capsLayer = _.find(caps.contents.layers, function(capsLayer) {
              return capsLayer.identifier === config.layer;
            });
            if(capsLayer && capsLayer.resourceUrl && capsLayer.resourceUrl.tile) {
                config.requestEncoding = 'REST';
                config.format = capsLayer.resourceUrl.tile.format;
                config.url = capsLayer.resourceUrl.tile.template;
            }

            // override default params and options from layer
            var key,
                layerParams = layer.getParams(),
                layerOptions = layer.getOptions();

            _.each(layer.getOptions(), function(value, key) {
                config[key] = value;
            });

            _.each(layer.getParams(), function(value, key) {
                config.params[key] = value;
            });

            return config;
    },
    /**
     * This is a temporary solution actual capabilities to be
     * read in backend
     *
     */
    readWMTSCapabilites: function (wmtsName, capsPath, matrixSet, cb, conf) {

        var me = this;
        var format = new OpenLayers.Format.WMTSCapabilities();

        var httpGetConf = OpenLayers.Util.extend({
            url: capsPath,
            params: {
                SERVICE: "WMTS",
                VERSION: "1.0.0",
                REQUEST: "GetCapabilities"
            },
            success: function (request) {
                var doc = request.responseXML;
                if (!doc || !doc.documentElement) {
                    doc = request.responseText;
                }
                var caps = format.read(doc);

                me.setCapabilities(wmtsName, caps);
                var layersCreated = me.parseCapabilitiesToLayers(wmtsName, caps, matrixSet);
                if (cb) {
                    cb.apply(this, [layersCreated, caps]);
                }

            },
            failure: function () {
                alert("Trouble getting capabilities doc");
                OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
            }
        }, conf || {});
        OpenLayers.Request.GET(httpGetConf);
    },
    /**
     * This is a temporary solution actual capabilities to be
     * read in backend
     *
     */
    parseCapabilitiesToLayers: function (wmtsName, caps, matrixSet) {


        var me = this;
        var mapLayerService = this.mapLayerService;
        var getTileUrl = null;
        if (caps.operationsMetadata.GetTile.dcp.http.getArray) {
            getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
        } else {
            getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
        }
        var capsLayers = caps.contents.layers;
        var contents = caps.contents;
        var ms = contents.tileMatrixSets[matrixSet];
        var layersCreated = [],
            n,
            spec,
            mapLayerId,
            mapLayerName,
            mapLayerJson,
            layer,
            styleBuilder,
            styleSpec,
            style,
            i,
            ii;

        for (n = 0; n < capsLayers.length; n++) {

            spec = capsLayers[n];

            mapLayerId = spec.identifier;
            mapLayerName = spec.identifier;
            /*
             * hack
             */
            mapLayerJson = {
                wmtsName: mapLayerId,
                descriptionLink: "",
                orgName: wmtsName,
                type: "wmtslayer",
                legendImage: "",
                formats: {
                    value: "text/html"
                },
                isQueryable: true,
                //minScale : 4 * 4 * 4 * 4 * 40000,
                style: "",
                dataUrl: "",

                name: mapLayerId,
                opacity: 100,
                inspire: wmtsName, //"WMTS",
                maxScale: 1
            };

            layer = Oskari.clazz.create('Oskari.mapframework.wmts.domain.WmtsLayer');

            layer.setAsNormalLayer();
            layer.setId(mapLayerId.split('.').join('_'));
            layer.setName(mapLayerJson.name);
            layer.setWmtsName(mapLayerJson.wmtsName);
            layer.setOpacity(mapLayerJson.opacity);
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.info);
            layer.setDataUrl(mapLayerJson.dataUrl);
            layer.setOrganizationName(mapLayerJson.orgName);
            layer.setInspireName(mapLayerJson.inspire);
            layer.setWmtsMatrixSet(ms);
            layer.setWmtsLayerDef(spec);
            layer.setVisible(true);

            layer.addWmtsUrl(getTileUrl);

            styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

            for (i = 0, ii = spec.styles.length; i < ii; ++i) {
                styleSpec = spec.styles[i];
                style = styleBuilder();
                style.setName(styleSpec.identifier);
                style.setTitle(styleSpec.identifier);

                layer.addStyle(style);
                if (styleSpec.isDefault) {
                    layer.selectStyle(styleSpec.identifier);
                    break;
                }
            }

            mapLayerService.addLayer(layer, false);
            layersCreated.push(layer);

        }

        return layersCreated;

    }
});