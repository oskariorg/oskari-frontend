/**
 * @class Oskari.mapframework.enhancement.common.SetDefaultMapControlActiveEnhancement
 *
 * @deprecated
 * This enchancement set default map control
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.common.SetDefaultMapControlActiveEnhancement',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            controlId tool id like #CONTROL_NAME_NAVIGATE
 */
function(controlId) {
    this._controlId = controlId;
}, {
    /**
     * @method enhance
     *
     * Interface method for the enhancement protocol
     *
     * @param {Object} core
     * 			reference to application core
     */
    enhance : function(core) {
        core.printDebug("[SetDefaultMapControlActiveEnhancement] " + "Requesting '" + this._controlId + "' ");
        var b = core.getRequestBuilder('ToolSelectionRequest');
        var r = b(this._controlId);
        core.processRequest(r);
    },
    /**
     * @method setControl
     *
     * Sets the control that will be triggered as default when enhance() is
     * called
     *
     * @param {String} pControlId
     * 			reference to listed control property in this class
     */
    setControl : function(pControlId) {
        this._controlId = pControlId;
    },
    /**
     * @property CONTROL_NAME_NAVIGATE
     * 				control id for map select control
     * @static */
    CONTROL_NAME_NAVIGATE : "map_control_select_tool"

}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */