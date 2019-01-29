import {getUserLocation} from '../LocationModule';

/**
 * @classOskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler
 * Handles MapModulePlugin.GetUserLocationRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler', function (sandbox, mapmodule) {
    this.sandbox = sandbox;
    this.mapmodule = mapmodule;
    this._log = Oskari.log('GetUserLocationRequestHandler');
}, {
    handleRequest: function (core, request) {
        this._log.debug('Get user location');
        var me = this;
        var mapmodule = this.mapmodule;
        var opts = request.getOptions() || {};

        var succesCb = function (lon, lat, accuracy) {
            // move map to coordinates
            if (request.getCenterMap()) {
                mapmodule.centerMap({ lon: lon, lat: lat }, 6);
                if (opts.enableHighAccuracy === true) {
                    mapmodule.zoomToFitMeters(accuracy * 4);
                }
            }
            if (opts.addToMap === true) {
                me._addLocationToMap(lon, lat, accuracy);
            } else {
                me._clearLocation();
            }
        };
        var errorCb = function () {
            me._clearLocation();
        };
        getUserLocation(succesCb, errorCb, opts);
    },
    _addLocationToMap: function (lon, lat, accuracy) {
        const pos = {
            lon: lon,
            lat: lat,
            accuracy: accuracy
        };
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
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
