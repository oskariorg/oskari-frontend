/**
 * @class Oskari.mapframework.bundle.publisher2.request.PublishMapModeChangeRequest
 * Request publisher to open given view in publish mode
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.request.PublishMapModeChangeRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} mode the map mode
     */
    function (mode) {
        this._mode = mode;
    }, {
        /** @static @property __name request name */
        __name: 'Publisher2.PublishMapModeChangeRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getMode
         */
        getMode: function () {
            return this._mode;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });