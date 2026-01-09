/**
 * @class Oskari.mapframework.bundle.myfeatures.request.ShowFeatureEditorRequest
 * Requests a dialog to add / modify a feature on a selected layer
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myfeatures.request.ShowFeatureEditorRequest',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} id myfeatures layer id
     */
    function (layerId, featureId) {
        this._layerId = layerId;
        this._featureId = featureId;
    }, {
        /** @static @property __name request name */
        __name: 'ShowFeatureEditorRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLayerId
         * @return {String} request layerId
         */
        getLayerId: function () {
            return this._layerId;
        },
        /**
         * @method getFeatureId
         * @return {String} request featureId
         */
        getFeatureId: function () {
            return this._featureId;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.request.Request']
    });
