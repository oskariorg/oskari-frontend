/**
 * @class Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogRequest
 * Requests the add layer dialog to be opened
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {jQuery}
 *            Originating jQuery element
 */
    function (originator, side) {
        this._originator = originator;
        this._side = side;
    }, {
        __name: 'MyPlaces.OpenAddLayerDialogRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {jQuery} Originating jQuery element
         */
        getOriginator: function () {
            return this._originator;
        },
        getSide: function () {
            return this._side;
        }

    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.request.Request']
    });
