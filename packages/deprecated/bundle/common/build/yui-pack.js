/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement
 * Disables debug logging and enables usage logging based on environment
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean}
 *            enableMapMovementLogging true to enable usage logging 
 */ 
function(enableMapMovementLogging) {

    /** Should map movement logging be enabled or not? */
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

/* Inheritance *//**
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

/* Inheritance *//**
 * @class Oskari.mapframework.enhancement.common.OpenLayersImagePathEnhancement
 * This enhancement will alter openlayers image path
 * TODO: refactor OpenLayers global access
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.common.OpenLayersImagePathEnhancement', 

/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    /**
     * @method getName
     * @return {String} enhancement name
     */
    getName : function() {
        return "OpenLayersImagePathEnhancement";
    },
    /**
     * @method enhance
     *
     * Interface method for the enhancement protocol
     *
     * @param {Object} core
     * 			reference to application core
     */
    enhance : function(core) {
        OpenLayers.ImgPath = Oskari.$().startup.imageLocation + "/lib/openlayers/img/";
/*
        OpenLayers._getScriptLocation = function() {
            var openlayersScriptLocation = "";
            openlayersScriptLocation = Oskari.$().startup.imageLocation + "/lib/openlayers/";
            return openlayersScriptLocation;
        }*/
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */