/**
 * @class Oskari.bundles.framework.myfeatures-content-editor.request.ShowFeatureEditorRequest
 */
Oskari.clazz.define('Oskari.bundles.framework.myfeatures-content-editor.request.ShowFeatureEditorRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {string} layerId
     * @param {Object} options
     * ** saveFeatureCallback: function
     * ** deleteFeatureCallback: function
     * ** etc.
     *
     */
    function (layerId, options) {
        this._layerId = layerId;
        this._options = options || null;

    }, {
        /** @static @property __name request name */
        __name: 'FeatureEditor.ShowFeatureEditorRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getLayerId
         */
        getLayerId: function () {
            return this._layerId;
        },

        /**
         * @method getLayerId
         */
        getOptions: function () {
            return this._options;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.request.Request']
    });
