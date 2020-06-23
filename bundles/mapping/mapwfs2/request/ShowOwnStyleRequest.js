/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequest
 * Requests a WFS own style to be shown
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Number} layerId layer identifier so we can select correct tab
     * @param {String} styleName style identifier so we can initialize visualization form with correct style
     * @param {Boolean} isCreateNew flag indicating that visualization form should be opened to create new style
     */
        function (layerId, styleName, isCreateNew) {
            this._layerId = layerId;
            this._styleName = styleName;
            this._isCreateNew = isCreateNew;
        }, {
            /** @static @property __name request name */
            __name: 'ShowOwnStyleRequest',

            /**
            * @method getName
            * @return {String} request name
            */
            getName: function () {
                return this.__name;
            },
            /**
            * @method getLayerId
            * @return {Number} layer identifier so we can manage select correct tab
            */
            getLayerId: function () {
                return this._layerId;
            },
            /**
            * @method getStyleName
            * @return {String} style identifier so we can initialize visualization form with correct style
            */
            getStyleName: function () {
                return this._styleName;
            },
            /**
            * @method isCreateNew
            * @return {Boolean} flag indicating that visualization form should be opened to create new style
            */
            isCreateNew: function () {
                return this._isCreateNew;
            }
        }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
            'protocol': ['Oskari.mapframework.request.Request']
        });
