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
     * @param {String} id for popup/infobox (optional)
     * @param {jQuery} content new content for popup
     * @param {Boolean} replace true to replace old content, false to append to it
     */
    function (id, content, replace) {
        this._creator = null;
        this._id = id;
        this._content = content;
        this._replace = replace;
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
         * @method getContent
         * @return {jQuery}
         */
        getContent: function() {
            return this._content;
        },
        /**
         * @method getReplace
         * @return {Boolean}
         */
        getReplace: function() {
            return this._replace;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });