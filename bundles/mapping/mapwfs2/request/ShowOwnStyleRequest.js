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
     * @param {Number} id layer identifier so we can select correct tab
     * @param {Number} styleId style identifier so we can initialize visualization form with correct style
     * @param {Boolean} isCreateNew flag indicating that visualization form should be opened to create new style
     */
        function (id, styleId, isCreateNew) {
            this._id = id;
            this._styleId = styleId;
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
            * @method getId
            * @return {Number} layer identifier so we can manage select correct tab
            */
            getId: function () {
                return this._id;
            },
            /**
            * @method getStyleId
            * @return {Number} style identifier so we can initialize visualization form with correct style
            */
            getStyleId: function () {
                return this._styleId;
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
