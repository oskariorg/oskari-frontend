/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChangedEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * Setup status and type of the request with setters:
 * var sb = Oskari.getSandbox();
 * var event = sb.getEventBuilder('WFSStatusChangedEvent')('mylayer_1');
 * event.setStatus(event.status.loading);
 * event.setRequestType(event.type.image);
 * sb.notifyAll(event);
 *
 * @param {String} layerId
 */
function(layerId) {
    this._layerId = layerId;
    this._type = undefined;
    this._status = undefined;
    this._nop = false;  // no operations needed in success case (e.g. keep featuredata content)

}, {
    /** @static @property __name event name */
    __name : "WFSStatusChangedEvent",
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
     * @method getLayerId
     * @return {String} layer id
     */
    getLayerId : function() {
        return this._layerId;
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
    * @method setNop
    * @param {Boolean} nop
    */
     setNop : function(nop) {
         this._nop = nop;
     },
     /**
     * @method getNop
     * @return {Boolean} nop
     */
     getNop : function() {
         return Boolean(this._nop);
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
