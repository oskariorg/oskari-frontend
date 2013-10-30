/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolbarRequest
 * Requests for toolbar to create/show/hide/remove a toolbar.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolbarRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            id identifier so we can manage the toolbars buttons with subsequent requests
     * @param {String}
     *            op operation 'add', 'remove','show' or 'hide'
     * @param {Object}
     *            data operation arguments as properties
     */

    function (id, op, data) {
        this._id = id;
        this._op = op;
        this._data = data;
    }, {
        /** @static @property __name request name */
        __name: "Toolbar.ToolbarRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getId
         * @return {String} identifier so we can manage the button with subsequent requests
         */
        getId: function () {
            return this._id;
        },
        /**
         * @method getGroup
         * @return {String} identifier for organizing buttons
         */
        getOp: function () {
            return this._op;
        },

        /**
         * @method getData
         * @return {Object} the properties for requested operation
         */
        getData: function () {
            return this._data;
        }

    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });

/* Inheritance */