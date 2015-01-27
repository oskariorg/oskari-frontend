/**
 * @class Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequest
 * Requests to show licence on the metadata catalogue search results.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.request.ShowLicenseRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {jQuery} licenseElement the jQuery element for licence, may be e.g. text, link or button.
 * @param {Function} callback the callback fucton that handles the licenseElement clicks.  Metadatacatalogue search result is passed to callback function.
 * @param {String} bindCallbackTo bind callback functionilaty to this jQuery selector on element param. If bindCallbackTo is null, callback is binded to main element of licenseElement param.
 * @param {String} licenseTextSelector license text jQuery selector. If it's null then text showed on main element.
 */
function(licenseElement, callback, bindCallbackTo, licenseTextSelector) {
    this._licenseElement = licenseElement;
    this._callback = callback;
    this._bindCallbackTo = bindCallbackTo;
    this._licenseTextSelector = licenseTextSelector;
}, {
    /** @static @property __name request name */
    __name : "ShowLicenseRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLicenseElement
     * @return {Object} licence element
     */
    getLicenseElement : function() {
        return this._licenseElement;
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
     * @return {String} bind callback to
     */
    getBindCallbackTo : function() {
        return this._bindCallbackTo;
    },
    /**
     * @method getLicenseTextSelector
     * @return {String} license text selector
     */
    getLicenseTextSelector : function() {
        return this._licenseTextSelector;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});