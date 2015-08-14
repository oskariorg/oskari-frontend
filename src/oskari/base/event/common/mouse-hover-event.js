/**
 * @class Oskari.mapframework.event.common.MouseHoverEvent
 *
 * Notification about mouse hovering over the map
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MouseHoverEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            lon longitude on mouse location
 * @param {Number}
 *            lat latitude on mouse location
 */
function(lon, lat,isPaused) {
    this._creator = null;

    this._lon = lon;

    this._lat = lat;
    
    this._paused = isPaused;

}, {
    /** @static @property __name event name */
    __name : "MouseHoverEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLon
     * @return {Number} longitude on mouse location
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLon
     * @return {Number} latitude on mouse location
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method set
     * 
     * Update mouse location on event
     * 
     * @param {Number}
     *            lon longitude on mouse location
     * @param {Number}
     *            lat latitude on mouse location
     */
    set : function(lon, lat,isPaused,pageX,pageY,isPaused) {

        this._lon = lon;
        this._lat = lat;
        this._paused = isPaused;
        this._pageX = pageX;
        this._pageY = pageY;
        this._paused = isPaused;
    },
    
    isPaused : function() {
    	return this._paused;
    },
    
    getPageX: function() {
    	return this._pageX;
    },
    getPageY: function() {
    	return this._pageY;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */