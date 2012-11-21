/**
 * @class Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement
 * Disables debug logging and enables usage logging based on environment
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean}
 *            enableMapMovementLogging true to enable usage logging 
 */ 
function(enableMapMovementLogging) {

    // Should map movement logging be enabled or not
    this._enableMapMovementLogging = enableMapMovementLogging;
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
        core.disableDebug();
        if(this._enableMapMovementLogging) {
            core.enableMapMovementLogging();
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});