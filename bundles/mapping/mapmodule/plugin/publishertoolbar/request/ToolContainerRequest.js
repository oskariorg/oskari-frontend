/**
 * @class Oskari.mapframework.bundle.toolbar.request.ToolContainerRequest
 * Requests for toolbar to create/show/hide/remove a tool container.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolContainerRequest',
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

    function (op, data) {
        this._op = op;
        this._data = data || {}; // default to empty object
    }, {
        /** @static @property __name request name */
        __name: "Toolbar.ToolContainerRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
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