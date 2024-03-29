/**
 * @class Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequest
 * Requests tab to be added
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequest',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} id User layer id
     */
    function (id) {
        this._id = id;
    }, {
        /** @static @property __name request name */
        __name: 'MyPlacesImport.ShowUserLayerDialogRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} tab title
         */
        getId: function () {
            return this._id;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
