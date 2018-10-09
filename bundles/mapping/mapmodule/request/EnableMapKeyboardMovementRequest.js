/**
 * @class Oskari.mapframework.bundle.mapmodule.request.EnableMapKeyboardMovementRequest
 *
 * Requests for keyboard control on map to be enabled. This is usually requested
 * after the disable event to reactivate the keyboard controls after leaving a
 * textfield.
 * Opposite of
 * Oskari.mapframework.bundle.mapmodule.request.DisableMapKeyboardMovementRequest
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.EnableMapKeyboardMovementRequest',

/**
 * @method create called automatically on construction
 * @static
 */
    function (options) {
        this._creator = null;
        this._options = options;
    }, {
    /** @static @property __name request name */
        __name: 'EnableMapKeyboardMovementRequest',
        /**
     * @method getName
     * @return {String} request name
     */
        getName: function () {
            return this.__name;
        },
        getOptions: function (option) {
            if (option && this._options) {
                return this._options.findIndex(function (o) {
                    return o === option;
                }) > -1;
            } else if (option) {
                return true;
            }
            return this._options;
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.request.Request']
    });
