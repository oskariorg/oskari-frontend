import olLayerTile from 'ol/layer/Tile';
import olSourceWMTS, { optionsFromCapabilities } from 'ol/source/WMTS';

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
     * Cache for loaded capabilities
     */
    setCapabilities: function (name, caps) {
        this.capabilities[name] = caps;
    },

    /**
     * Cache for loaded capabilities
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
        const me = this;
        const url = Oskari.urls.getRoute('GetLayerCapabilities', {
            json: true,
            id: layer.getId(),
            srs: Oskari.getSandbox().getMap().getSrsName()
        });

        const caps = this.getCapabilities(url);
        if (caps) {
            // return with cached capabilities
            success(this.__createWMTSLayer(caps, layer));
            return;
        }
        // gather capabilities requests
        // make ajax call just once and invoke all callbacks once finished
        let triggerAjaxBln = false;
        if (!this.requestsMap[url]) {
            this.requestsMap[url] = [];
            triggerAjaxBln = true;
        }
        this.requestsMap[url].push(arguments);

        if (triggerAjaxBln) {
            jQuery.ajax({
                dataType: 'json',
                type: 'GET',
                url: url,
                success: function (response) {
                    try {
                        const caps = me.__formatCapabilitiesForOpenLayers(response);
                        me.setCapabilities(url, caps);
                        me.__handleCallbacksForLayerUrl(url);
                    } catch (err) {
                        // just to make sure we respond with something even
                        //  when we don't get the JSON we were expecting
                        me.__handleCallbacksForLayerUrl(url, true);
                    }
                },
                error: function () {
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
    __handleCallbacksForLayerUrl: function (url, invokeFailure) {
        const caps = this.getCapabilities(url);
        // requestsMap[url] is an array of "callers" that have attempted to get the url.
        // Each array item will have the layer as first, success callback as second and optional error callback as third param
        this.requestsMap[url].forEach(([layer, successCB, errorCB]) => {
            if (!invokeFailure) {
                successCB(this.__createWMTSLayer(caps, layer));
                return;
            }
            if (typeof errorCB === 'function') {
                errorCB();
            }
        });
    },
    __createWMTSLayer: function (caps, layer) {
        const config = this.__getLayerConfig(layer);
        const options = optionsFromCapabilities(caps, config);
        // if requestEncoding is set for layer -> use it since proxied are
        //  always KVP and openlayers defaults to REST
        options.requestEncoding = config.requestEncoding || options.requestEncoding;
        if (!options.urls.length) {
            // force KVP if we have no resource urls/possible misconfig
            options.requestEncoding = 'KVP';
        }
        if (options.requestEncoding === 'KVP') {
            // override url to one provided by server since the layer might be proxied
            const url = Oskari.urls.buildUrl(layer.getLayerUrl(), layer.getParams());
            options.urls = [url];
        }
        // allows layer.options.wrapX to be passed to source.
        // On OL 6.4.3 it's always false from optionsFromCapabilities()
        // On 6.6.1 it appears to be correct and this line could be removed
        options.wrapX = !!config.wrapX;
        const wmtsLayer = new olLayerTile({
            source: new olSourceWMTS(options),
            opacity: layer.getOpacity() / 100.0,
            transparent: true,
            visible: layer.isInScale(this.sandbox.getMap().getScale()) && layer.isVisible()
        });
        return wmtsLayer;
    },

    __getLayerConfig: function (layer) {
        // default params and options
        // URL is tuned serverside so we need to use the one it gives (might be proxy url)
        return {
            name: 'layer_' + layer.getId(),
            style: layer.getCurrentStyle().getName(),
            layer: layer.getLayerName(),
            buffer: 0,
            crossOrigin: layer.getAttributes('crossOrigin'),
            ...layer.getOptions()
        };
    },

    // see https://github.com/openlayers/openlayers/blob/v6.6.1/src/ol/source/WMTS.js#L341-L588
    // for how OL parses the JSON and what it expects to find in it
    __formatCapabilitiesForOpenLayers: function (layerCapabilities) {
        // server always just gives one for frontend (one matching the map srs)
        var tileMatrixSet = layerCapabilities.links[0].tileMatrixSet;
        return {
            Contents: {
                Layer: [{
                    Identifier: layerCapabilities.id,
                    TileMatrixSetLink: [{
                        TileMatrixSet: tileMatrixSet.identifier
                    }],
                    Style: layerCapabilities.styles.map(s => {
                        return {
                            Identifier: s.name
                        };
                    }),
                    ResourceURL: layerCapabilities.resourceUrls.map(item => {
                        const { type, ...rest } = item;
                        return {
                            ...rest,
                            resourceType: type
                        };
                    }),
                    Format: layerCapabilities.formats
                }],
                TileMatrixSet: [{
                    Identifier: tileMatrixSet.identifier,
                    SupportedCRS: tileMatrixSet.projection,
                    TileMatrix: Object.values(tileMatrixSet.matrixIds).map(item => {
                        return {
                            Identifier: item.identifier,
                            MatrixWidth: item.matrixWidth,
                            MatrixHeight: item.matrixHeight,
                            ScaleDenominator: item.scaleDenominator,
                            TopLeftCorner: [item.topLeftCorner.lon, item.topLeftCorner.lat],
                            TileWidth: item.tileWidth,
                            TileHeight: item.tileHeight
                        };
                    })
                }]
            }
        };
    }
});
