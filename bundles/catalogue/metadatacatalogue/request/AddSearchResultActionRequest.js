/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequest
 * Requests to add search result action on the metadata catalogue search results.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object} data request data
 */
function(data) {
    this._actionElement = data.actionElement;
    this._actionTextElement = data.actionTextElement;
    this._callback = data.callback;
    this._bindCallbackTo = data.bindCallbackTo;    
}, {
    /** @static @property __name request name */
    __name : "AddSearchResultActionRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getActionElement
     * @return {jQuery} action jQuery element
     */
    getActionElement : function() {
        return this._actionElement;
    },
    /**
     * @method getActionTextElement
     * @return {String} action text jQuery selector
     */
    getActionTextElement : function() {
        return this._actionTextElement;
    },
    /**
     * @method getCallback
     * @return {Function} callback
     */
    getCallback : function() {
        return this._callback;
    },
    /**
     * @method getBindCallbackTo
     * @return {Sting} bind callback to this jQuery selector
     */
    getBindCallbackTo : function() {
        return this._bindCallbackTo;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});