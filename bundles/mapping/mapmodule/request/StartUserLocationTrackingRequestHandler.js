/**
 * @class Oskari.mapframework.bundle.mapmodule.request.StartUserLocationTrackingRequestHandler
 * Handles StartUserLocationTrackingRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.StartUserLocationTrackingRequestHandler', function (sandbox, mapmodule) {
    this.sandbox = sandbox;
    this.mapmodule = mapmodule;
    this._log = Oskari.log('StartUserLocationTrackingRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Start user location tracking');
        var me = this;
        var mapmodule = this.mapmodule;
        var opts = request.getOptions() || {};
        var focused = false;

        // clear previous
        this._clearLocation();
        mapmodule.clearLocationPath();
        mapmodule.stopUserLocationWatch();

        var succesCb = function (pos) {
            // move map to coordinates
            if (opts.centerMap === 'single' && !focused) {
                focused = true;
                mapmodule.centerMap(pos);
                mapmodule.zoomToFitMeters(pos.accuracy * 4);
            } else if (opts.centerMap === 'update') {
                mapmodule.centerMap(pos);
                if (!focused) {
                    focused = true;
                    mapmodule.zoomToFitMeters(pos.accuracy * 4);
                }
            }
            if (opts.addToMap === 'point') {
                me._addLocationToMap(pos);
            } else if (opts.addToMap === 'path') {
                me._addLocationToPath(pos);
            }
        };
        var errorCb = function (error) {
            me._log.warn('Failed to get user location', error);
            if (opts.addToMap === 'point') {
                me._clearLocation();
            }
        };
        mapmodule.watchUserLocation(succesCb, errorCb, opts);
    },
    _addLocationToMap: function (pos) {
        const features = this.mapmodule.getLocationGeoJSON(pos);
        const featureStyle = {
            fill: {
                color: 'rgba(57, 150, 237, 0.3)'
            },
            stroke: {
                color: 'rgba(38, 112, 181, 0.3)'
            },
            image: {
                radius: 5,
                fill: {
                    color: '#2670b5'
                }
            }
        };
        const layerOptions = {
            layerId: 'USER_LOCATION_LAYER',
            clearPrevious: true,
            featureStyle: featureStyle
        };
        Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [features, layerOptions]);
    },
    _clearLocation: function () {
        Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'USER_LOCATION_LAYER']);
    },
    _addLocationToPath: function (pos) {
        const path = this.mapmodule.updateLocationPath([pos.lon, pos.lat]);
        if (!path) {
            return;
        }
        const featureStyle = {
            stroke: {
                color: 'rgba(38, 112, 181, 1)'
            }
        };
        const layerOptions = {
            layerId: 'USER_LOCATION_LAYER',
            clearPrevious: true,
            featureStyle: featureStyle
        };
        Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [path, layerOptions]);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
