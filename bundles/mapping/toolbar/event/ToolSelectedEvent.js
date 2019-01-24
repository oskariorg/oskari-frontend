/**
 * @class Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent
 *
 * Used to notify components that a tool has been selected and
 * components should cancel their tool related operations if any.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} toolId tool that was selected
 * @param {String} groupId group of the tool that was selected
 */
    function (toolId, groupId, isSticky) {
        this._toolId = toolId;
        this._groupId = groupId;
        this._isSticky = isSticky;
    }, {
    /** @static @property __name event name */
        __name: 'Toolbar.ToolSelectedEvent',
        /**
     * @method getName
     * Returns event name
     * @return {String}
     */
        getName: function () {
            return this.__name;
        },
        /**
     * @method getToolId
     * Returns id for the tool that was selected
     * @return {String}
     */
        getToolId: function () {
            return this._toolId;
        },
        /**
     * @method getGroupId
     * Returns group id for the tool that was selected
     * @return {String}
     */
        getGroupId: function () {
            return this._groupId;
        },
        /**
     * @method getSticky
     * Returns stickyness of selected tool
     * @return {Boolean}
     */
        getSticky: function () {
            return this._isSticky;
        }
    }, {
    /**
     * @property {String[]} protocol
     * @static
     */
        'protocol': ['Oskari.mapframework.event.Event']
    });
