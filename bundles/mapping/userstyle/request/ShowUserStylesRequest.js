/**
 * @class Oskari.mapframework.userstyle.request.ShowUserStylesRequest
 * Requests a user own style to be shown
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.userstyle.request.ShowUserStylesRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Number} layerId layer identifier so we can select correct tab
     * @param {Boolean} showStyle flag indicating that visualization form should be opened to create/edit style
     * @param {String} styleName style identifier so we can initialize visualization form with correct style, if undefined new style is created
     */
        function (layerId, showStyle, styleName) {
            this._layerId = layerId;
            this._showStyle = showStyle;
            this._styleName = styleName;
        }, {
            /** @static @property __name request name */
            __name: 'ShowUserStylesRequest',

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
            * @method showStyle
            * @return {Boolean} flag indicating that visualization form should be opened to create/edit style
            */
            showStyle: function () {
                return this._showStyle;
            }
        }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
            'protocol': ['Oskari.mapframework.request.Request']
        });
