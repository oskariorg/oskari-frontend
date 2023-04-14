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
     * @param {Object} options
     */
        function (options, showStyle, styleName) {
            this._options = options; // was layeId which is deprecated
            this._showStyle = showStyle; // deprecated
            this._styleName = styleName; // deprecated
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
            getOptions: function () {
                if (typeof this._options !== 'object') {
                    Oskari.log('ShowUserStylesRequest').deprecated('Parameters layerId, showStyle and styleName', 'Use options object instead');
                    return {
                        id: this._styleName,
                        layerId: this._options,
                        addToLayer: this._showStyle === true ? this._options : null
                    };
                }
                return this._options;
            }
        }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
            protocol: ['Oskari.mapframework.request.Request']
        });
