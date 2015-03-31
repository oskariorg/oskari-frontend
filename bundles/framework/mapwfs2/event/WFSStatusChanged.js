/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChanged
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChanged',
/**
 * @method create called automatically on construction
 * @static
 *
 * Setup status and type of the request with setters:
 * var event = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChanged', 'mylayer_1');
 * event.setStatus(event.status.loading);
 * event.setRequestType(event.type.image);
 *
 * @param {String} layerId
 */
function(layerId) {
    this._layerId = layer;
    this._type = undefined;
    this._status = undefined;
}, {
    /** @static @property __name event name */
    __name : "WFSStatusChanged",
    status : {
    	'loading' : 1,
    	'complete' : 200,
    	'error' : 500
    },
    type : {
    	'image' : 1,
    	'highlight' : 2,
    	'feature' : 3,
    	'mapClick' : 4
    },
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getLayer
     * @return {String} layer
     */
    getLayerId : function() {
        return this._layer;
    },

    /**
     * @method setStatus
     * @param {Number} statusCode
     */
    setStatus : function(statusCode) {
        this._status = statusCode;
    },
    /**
     * @method getStatus
     * @return {Number} statusCode
     */
    getStatus : function() {
        return this._status;
    },

    /**
     * @method getFeature
     * @return {Number} typeCode
     */
    getRequestType : function() {
        return this._type;
    },
    /**
     * @method getFeature
     * @param {Number} requestType
     */
    setRequestType : function(requestType) {
        this._type = requestType;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
