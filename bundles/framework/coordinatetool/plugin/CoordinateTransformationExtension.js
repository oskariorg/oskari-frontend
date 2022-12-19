/**
 * @class Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        this._locale = locale;
        this._config = config;
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._instance = instance;
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension';
        this._ajaxXhr = {};
    }, {
        /**
         * Generates the options for the projection change select based on config, or hides control if no options
         * @method @private _populateCoordinatesTransformSelect
         * @param {Object} popupContent
         */
        _populateCoordinatesTransformSelect: function (select) {
            var me = this;
            const config = this._config || {};
            const supportedProjs = config.supportedProjections || [];
            supportedProjs.forEach(function (key) {
                var option = me._templates.projectionSelectOption.clone();
                option.val(key);
                if (me._locale('display.coordinatesTransform.projections.' + key)) {
                    option.html(me._locale('display.coordinatesTransform.projections.' + key));
                } else {
                    option.html(key);
                }
                select.append(option);
            });
        },
        /**
         * Transforms the given coordinates
         * @method @public transformCoordinates
         * @param {Object} data: lat/lon coordinates to be transformed
         * @param {String} srs: projection for given lonlat params like "EPSG:4326"
         * @param {String} targetSRS: projection to transform to like "EPSG:4326"
         * @return {Object} data: transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (data, srs, targetSRS) {
            var me = this;
            me._coordinatesFromServer = false;
            if (!data) {
                var map = this._sandbox.getMap();
                data = {
                    'lonlat': {
                        'lat': parseFloat(map.getY()),
                        'lon': parseFloat(map.getX())
                    }
                };
            }
            if (!srs) {
                srs = this._mapmodule.getProjection();
            }
            
            try {
                if (srs && targetSRS) {
                    data.lonlat = this._mapmodule.transformCoordinates(data.lonlat, srs, targetSRS);
                }
            } catch (e) {
                throw new Error('SrsName not supported!');
            }
            return data;
        },
        /**
         * Transforms the given coordinates using action_route=Coordinates and updates coordinates to the UI
         * @method getTransformedCoordinatesFromServer
         * @param {Object} data: {lonlat: lat: '', lon: ''} coordinates to be transformed
         * @param {String} srs: projection for given lonlat params like "EPSG:4326"
         * @param {String} targetSRS: projection to transform to like "EPSG:4326"
         * @param {Function} successCb success callback
         * @param {Function} errorCb error callback
         */
        getTransformedCoordinatesFromServer: function (data, srs, targetSRS, successCb, errorCb) {
            var me = this;
            if (!data) {
                var map = me._sandbox.getMap();
                data = {
                    'lonlat': {
                        'lat': parseFloat(map.getY()),
                        'lon': parseFloat(map.getX())
                    }
                };
            }
            // If coordinates are empty then not try to transform these
            if ((typeof data.lonlat.lon === 'undefined' && typeof data.lonlat.lat === 'undefined') ||
                (data.lonlat.lon === '' && data.lonlat.lat === '')) {
                if (typeof errorCb === 'function') {
                    errorCb();
                }
                return;
            }

            if (!srs) {
                srs = this._mapmodule.getProjection();
            }
            if (srs !== targetSRS) {
                if (me._ajaxXhr[srs + targetSRS]) {
                    me._ajaxXhr[srs + targetSRS].abort();
                }
                me._ajaxXhr[srs + targetSRS] = jQuery.ajax({
                    url: Oskari.urls.getRoute('Coordinates'),
                    data: {
                        lat: data.lonlat.lat,
                        lon: data.lonlat.lon,
                        srs: srs,
                        targetSRS: targetSRS
                    },
                    success: function (response) {
                        if (response.lat && response.lon) {
                            var newData = {
                                'lonlat': {
                                    'lon': response.lon,
                                    'lat': response.lat
                                }
                            };
                            me._coordinatesFromServer = true;
                            if (typeof successCb === 'function') {
                                successCb(newData);
                            }
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                            errorCb(jqXHR, textStatus);
                        }
                    }
                });
            }
        },
        /**
         * format different degree presentations of lon/lat coordinates
         */
        _formatDegrees: function (lon, lat, type) {
            var degreesX,
                degreesY,
                minutesX,
                minutesY,
                secondsX,
                secondsY;

            switch (type) {
            case 'min':
                degreesX = parseInt(lon);
                degreesY = parseInt(lat);
                minutesX = Number((lon - degreesX) * 60).toFixed(5);
                minutesY = Number((lat - degreesY) * 60).toFixed(5);
                return {
                    'degreesX': degreesX,
                    'degreesY': degreesY,
                    'minutesX': minutesX.replace('.', Oskari.getDecimalSeparator()),
                    'minutesY': minutesY.replace('.', Oskari.getDecimalSeparator())
                };
            case 'sec':
                degreesX = parseInt(lon);
                degreesY = parseInt(lat);
                minutesX = parseFloat((lon - degreesX) * 60);
                minutesY = parseFloat((lat - degreesY) * 60);
                secondsX = parseFloat((minutesX - parseInt(minutesX)) * 60).toFixed(3);
                secondsY = parseFloat((minutesY - parseInt(minutesY)) * 60).toFixed(3);
                return {
                    'degreesX': degreesX,
                    'degreesY': degreesY,
                    'minutesX': parseInt(minutesX),
                    'minutesY': parseInt(minutesY),
                    'secondsX': secondsX.replace('.', Oskari.getDecimalSeparator()),
                    'secondsY': secondsY.replace('.', Oskari.getDecimalSeparator())
                };
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
