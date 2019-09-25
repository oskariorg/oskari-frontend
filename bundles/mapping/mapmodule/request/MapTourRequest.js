/**
 * @class Oskari.mapframework.request.common.MapTourRequest
 */
Oskari.clazz.define('Oskari.mapframework.request.common.MapTourRequest',
    function (locations, options) {
        this._creator = null;
        this._locations = locations;
        if (typeof options !== 'object') {
            options = {};
        }
        this._projectionCode = options.srsName;
        this._animation = options.animation;
        this._zoom = options.zoom;
        this._duration = options.duration;
        this._3dAngles = {
            heading: options.heading,
            pitch: options.pitch,
            roll: options.roll
        };
    }, {
        __name: 'MapTourRequest',

        getName: function () {
            return this.__name;
        },

        getLocations: function () {
            return this._locations;
        },

        getZoom: function () {
            return this._zoom;
        },

        getSrsName: function () {
            return this._projectionCode;
        },
        getAnimation: function () {
            return this._animation;
        },
        get3dAngles: function () {
            return this._3dAngles;
        }
    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });
