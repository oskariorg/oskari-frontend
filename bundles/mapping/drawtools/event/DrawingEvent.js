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
function(id, geojson, data) {
    this._id = id;
    this._geojson = geojson;
    this._data = data;
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
