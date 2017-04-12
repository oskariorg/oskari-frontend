/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequest
 * Requests to add search result action on the metadata catalogue search results.
 *
 * Requests are build and sent through Oskari.Sandbox.
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
    this._actionText = data.actionText;
    this._callback = data.callback;
    this._bindCallbackTo = data.bindCallbackTo;
    this._showAction = data.showAction;
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
     * @method getActionText
     * @return {String} action text
     */
    getActionText : function() {
        return this._actionText;
    },
    /**
     * @method getCallback
     * @return {Function} callback function, first param is metadata search result object.
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
    },
    /**
     * @method getShowAction
     * @return {Function} showAction checker, if setted then show metadata action only when this return true. First param is metadata search result object.
     */
    getShowAction : function() {
        return this._showAction;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});