/**
 * @class Oskari.mapping.drawtools.event.DrawingEvent
 *
 *  Used to notify drawing is completed
 */
Oskari.clazz.define('Oskari.mapping.drawtools.event.DrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} id drawing id as given in StartDrawingRequest
 * @param {Object} geojson drawn shape (includes buffer as property?)
 * @param {Object} additional info like length of line or area of a polygon?
 */
function(id, geojson, data, isFinished) {
    this._id = id;
    this._geojson = geojson;
    this._data = data;
    this._isFinished = isFinished;
}, {
    /** @static @property __name event name */
    __name : "DrawingEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    getId : function() {
        return this._id;
    },
    getGeoJson : function() {
        return this._geojson;
    },
    getData : function() {
        return this._data;
    },
    getCrs : function() {
        return this._geoJson.crs;
    },
    getIsFinished : function() {
        return this._isFinished;
    },
    /**
     * Serialization for RPC
     * @return {Object} object that includes event properties
     */
    getParams: function () {
        return {
            name: this.getName(),
            id: this.getId(),
            geojson: this.getGeoJson(),
            data: this.getData(),
            isFinished: this.getIsFinished()
       };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});