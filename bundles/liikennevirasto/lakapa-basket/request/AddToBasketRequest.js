/**
 * @class Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequest
 * Requests a add selection to basket
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} bbox, cropping bbox
 * @param {Array} selectedLayers, selected layers
 * @param {String} croppingMode, cropping mode
 * @param {String} transport, transport
 * @param {String} identifier
 * @param {Array} features
 */
function(bbox, selectedLayers,croppingMode, transport, identifier,features) {
    this._bbox = bbox;
    this._selectedLayers = selectedLayers;
    this._croppingMode = croppingMode;
    this._transport = transport;
    this._identifier = identifier;
    this._features = features;
}, {
	/** @static @property __name request name */
    __name : "AddToBasketRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getBbox
     * @return {Object} bbox
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method getSelectedLayers
     * @return {Array} selectedLayers
     */
    getSelectedLayers : function() {
        return this._selectedLayers;
    },
    /**
     * @method getCroppingMode
     * @return {String} croppingMode
     */
    getCroppingMode : function() {
        return this._croppingMode;
    },
    /**
     * @method getTransport
     * @return {String} transport
     */
    getTransport : function() {
        return this._transport;
    },
    /**
     * @method getIdentifier
     * @return {String} identifier
     */
    getIdentifier : function() {
        return this._identifier;
    },
    /**
     * @method getFeatures
     * @return {Array} features
     */
    getFeatures : function() {
        return this._features;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});