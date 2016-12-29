/**
 * @class Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest
 * Requests for toolbar to add button with given config
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 * @param {Object} config
 *            JSON config for button
 */
function(id, group, config) {
    this._id = id;
    this._group = group;
    this._config = config;
}, {
    /** @static @property __name request name */
    __name : "Toolbar.AddToolButtonRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} identifier so we can manage the button with subsequent requests
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for organizing buttons
     */
    getGroup : function() {
        return this._group;
    },
    /**
     * @method getConfig
     * @return {Object} button config
     */
    getConfig : function() {
        return this._config;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});