/**
 * @class Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequest
 * Requests a map popup/infobox to be refreshed
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequest',
    /**
     * @method create called automatically on construction
     * @static
     * @param {String} id for popup/infobox
     * @param {String} operation to perform (optional)
     *                 if not provided, sends an event to notify if the popup is open
     * @param {String/Number} contentId the id for the content we want to do thing to
     */
    function (id, operation, contentId) {
        this._creator = null;
        this._id = id;
        this._operation = operation;
        this._contentId = contentId;
    }, {
        /** @static @property __name request name */
        __name: "InfoBox.RefreshInfoBoxRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} popup/infobox id
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method getOperation
         * @return {String}
         */
        getOperation: function() {
            return this._operation;
        },
        /**
         * @method getContentId
         * @return {String/Number}
         */
        getContentId: function() {
            return this._contentId;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });