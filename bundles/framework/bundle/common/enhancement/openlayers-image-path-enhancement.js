/**
 * @class Oskari.mapframework.enhancement.common.OpenLayersImagePathEnhancement
 * This enhancement will alter openlayers image path
 * TODO: refactor OpenLayers global access
 * @deprecated
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