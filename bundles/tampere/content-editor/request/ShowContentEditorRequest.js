/**
 * @class Oskari.tampere.bundle.content-editor.request.ShowContentEditorRequest
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.request.ShowContentEditorRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {string} layerId
     */
    function (layerId) {
        this._layerId = layerId;
    }, {
        /** @static @property __name request name */
        __name: 'ContentEditor.ShowContentEditorRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getEditMap
         */
        getLayerId: function () {
            return this.layerId;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });