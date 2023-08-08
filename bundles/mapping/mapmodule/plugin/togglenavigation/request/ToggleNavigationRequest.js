/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ToggleNavigationRequest
 * Requests navigation toggle functionality to be activated or disabled
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.ToggleNavigationRequest',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Boolean} enable True to enable, false to disable
     *
     */
    function (visible) {
        this.visible = visible;
    }, {

        /**
         * @public @method getName
         *
         *
         * @return {String} request name
         */
        getName: function () {
            return 'MapModulePlugin.ToggleNavigationRequest';
        },

        /**
         * @public @method isVisible
         * Returns true if navigation toggle should be visible, false to hide
         *
         *
         * @return {Boolean}
         */
        isVisible: function () {
            return this.visible;
        }
    }, {
        /**
         * @static @property {String[]} protocol array of superclasses as {String}
         */
        protocol: ['Oskari.mapframework.request.Request']
    }
);
