/**
 * @class Oskari.mapframework.domain.Tooltip
 * @deprecated (?)
 *
 * Tooltip, not used anywhere?
 */
Oskari.clazz.define('Oskari.mapframework.domain.Tooltip',

/**
 * @method create called automatically on construction
 * @static
 * TODO: check doc
 *
 * @param {Object} component
 *            component reference(?)
 * @param {Object} tooltip
 *            message(?)
 */
function(component, tooltip) {
    this._component = component;
    this._tooltip = tooltip;
}, {
    /**
     * @method setComponent
     * Sets the component reference(?)
     *
     * @param {Object} component
     *            component reference(?)
     */
    setComponent : function(component) {
        this._component = component;
    },
    /**
     * @method setTooltip
     * Sets the tooltip message(?)
     *
     * @param {Object} tooltip
     *            tooltip message(?)
     */
    setTooltip : function(tooltip) {
        this._tooltip = tooltip;
    },
    /**
     * @method getComponent
     * Gets the component reference(?)
     *
     * @return {Object}
     *            component reference(?)
     */
    getComponent : function() {
        return this._component;
    },
    /**
     * @method getTooltip
     * Gets the tooltip message(?)
     *
     * @return {Object}
     *            tooltip message(?)
     */
    getTooltip : function() {
        return this._tooltip;
    }
});
