import { watchUserLocation, stopUserLocationWatch,
    clearLocationCoords, getLocationCoords } from '../LocationModule';

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
        this._clearLocationFromMap();
        clearLocationCoords();
        stopUserLocationWatch();
        var succesCb = function (pos) {
            let mapMoved = false;
            // move map to coordinates
            if (opts.centerMap === 'update' || (opts.centerMap === 'single' && !focused)) {
                mapMoved = mapmodule.centerMap(pos);
            }
            // zoom only once, skip if centerMap fails
            if (!focused && mapMoved) {
                focused = true;
                mapmodule.zoomToFitMeters(pos.accuracy * 4);
            }
            if (opts.addToMap === 'point') {
                me._addLocationToMap(pos, false, {
                    featureStyle: opts.featureStyle,
                    optionalStyles: opts.optionalStyles
                });
            } else if (opts.addToMap === 'path') {
                me._addPathToMap();
            } else if (opts.addToMap === 'location') {
                me._addLocationToMap(pos, true, {
                    featureStyle: opts.featureStyle,
                    optionalStyles: opts.optionalStyles
                });
            }
        };
        var errorCb = function (error) {
            me._log.warn('Failed to get user location', error);
            if (opts.addToMap === 'point') {
                me._clearLocation();
            }
        };
        watchUserLocation(succesCb, errorCb, opts);
    },
    // styles is undocumented "hidden feature" for testing purposes
    _addLocationToMap: function (pos, addAccuracy = true, styles = {}) {
        const features = this.mapmodule.getLocationGeoJSON(pos, addAccuracy);
        const { featureStyle: requestedStyle = {}, optionalStyles: requestedAccuracyStyle = {} } = styles;
        const layerOptions = {
            layerId: 'USER_LOCATION_LAYER',
            clearPrevious: true,
            featureStyle: {
                fill: {
                    color: 'rgba(57, 150, 237, 0.3)'
                },
                stroke: {
                    color: '#0fd1fe',
                    width: 2
                },
                image: {
                    radius: 5,
                    fill: {
                        color: '#004d7f'
                    }
                },
                ...requestedStyle
            }
        };
        if (addAccuracy) {
            const accuracyStyle = {
                property: {
                    key: 'name',
                    value: 'accuracy'
                },
                stroke: {
                    color: 'rgba(38, 112, 181, 0.3)',
                    width: 1
                },
                // without null image we get the default image
                image: null,
                ...requestedAccuracyStyle
            };
            layerOptions.optionalStyles = [accuracyStyle];
        }
        Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [features, layerOptions]);
    },
    _clearLocationFromMap: function () {
        Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'USER_LOCATION_LAYER']);
    },
    _addPathToMap: function () {
        const coords = getLocationCoords();
        const path = this.mapmodule.getLocationPathGeoJSON(coords);
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
