Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequest',

/** @constructor
 * @param {Sting} functionalityId ID of initiating functionality
 * @param {String} mode kind of geometry editing, see __modes
 * @param {GeoJSONGeometry} geometry
 */
function(functionalityId, mode, geometry) {
    if (!this.__modes[mode]) {
        throw "Unknown geometry edit mode '" + mode + "'";
    }
    this._functionalityId = functionalityId;
    this._geometry = geometry;
    this._mode = mode;

}, {
    __name : "StartGeometryCuttingRequest",
    __modes : {
        "lineSplit": true,
        "polygonClip": true
    },
    getName : function() {
        return this.__name;
    },

    getId: function() {
        return this._functionalityId;
    },

    getMode : function() {
        return this._mode;
    },

    getGeometry : function() {
        return this._geometry;
    },
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});