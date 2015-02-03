/**
 * Event is sent when the role has been added or removed
 * 
 * @class Oskari.mapframework.bundle.admin-users.event.RoleChangedEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.event.RoleChangedEvent', 
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object}
     *            role id and name for the changed layer 
     * @param {String}
     *            operation one of #operations
     */

    function (role, operation) {
        this._creator = null;
        this._role = role;
        if (!this.operations[operation]) {
            throw "Unknown operation '" + operation + "'";
        }
        this._operation = operation;
    }, {
        /** @static @property __name event name */
        __name: "RoleChangedEvent",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getRole
         * @return {Object} role id and name for the changed role (data available in
         * Oskari.mapframework.service.MapLayerService)
         */
        getRole: function () {
            return this._role;
        },
        /**
         * @method getOperation
         * @return {String} one of #operations
         */
        getOperation: function () {
            return this._operation;
        },
        /**
         * @property {Object} operations identifiers to tell what has happened
         * @static
         */
        operations: {
            /** @static @property {String} operations.add role has been added */
            'add': 'add',
            /** @static @property {String} operations.remove role has been removed
             */
            'remove': 'remove',
            /** @static @property {String} operations.update role has been updated
             * (e.g. name) */
            'update': 'update'
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });