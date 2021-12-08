/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.CoordinateToolService',
/**
 * @method create called automatically on construction
 * @static
 */
    function (instance, config) {
        this._instance = instance;
        this._sandbox = instance.sandbox;
        this._config = config;
        this._reverseGeocodingIds = config.reverseGeocodingIds;
        this.urls = {};

        this.urls.reverseGeocode = Oskari.urls.getRoute('GetReverseGeocodingResult');
    }, {
        __name: 'CoordinateTool.CoordinateToolService',
        __qname: 'Oskari.mapframework.bundle.coordinatetool.CoordinateToolService',
        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        /**
     * Initializes the service (does nothing atm).
     *
     * @method init
     */
        init: function () {
        },
        /**
     * Returns the url to request reverse geocoding result
     *
     * @method getReverseGeocodeUrl
     * @return {String}
     */
        _getReverseGeocodeUrl: function (lon, lat) {
            var url = this.urls.reverseGeocode + '&epsg=' + this._sandbox.getMap().getSrsName() + '&lon=' + lon + '&lat=' + lat;
            if (this._reverseGeocodingIds) {
            // '&scale=' + this._sandbox.getMap().getScale();
                url += '&channel_ids=' + this._reverseGeocodingIds + '&scale=5000';
            }
            return url;
        },
        /**
     * Retrieves retreaves reverse geocoding result to input lon, lat
     *
     * @method getReverseGeocode
     * @param  {Function} successCb
     * @param  {Function} errorCb (optional)
     * @param  {String/Number} lon (east coordinate)
     * @param  {String/Number} lat (north coordinate)
     * @param  {String} id (optional)
     */
        getReverseGeocode: function (successCb, errorCb, lon, lat, id) {
            var me = this,
                url = me._getReverseGeocodeUrl(lon, lat);

            if (id) {
                url += '&id=' + id;
            }

            jQuery.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (response) {
                        me._handleResponse(response, successCb);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            });
        },
        _handleResponse: function (response = {}, cb) {
            if (typeof cb !== 'function' || !response.locations) {
                return;
            }

            const result = response.locations.map((location) => {
                return {
                    channelId: location.channelId,
                    name: location.name,
                    type: location.type
                };
            });
            cb(result);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
