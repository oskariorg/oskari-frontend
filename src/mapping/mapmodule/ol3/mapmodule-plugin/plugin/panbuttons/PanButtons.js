/**
 * @class Oskari.ol3.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.ol3.mapmodule.plugin.PanButtons',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.__conf.location = {
        'top' : "20px",
        "right" : "20px"
    };
}, {
    createControlAdapter : function(el) {
        var elPanBtn = el.get()[0];
        var ctl = new ol.control.Control({
            element : elPanBtn
        });
        ctl.handleMapPostrender = function() {

        };
        return ctl;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
    "extend" : ["Oskari.mapping.mapmodule.plugin.PanButtons"]

});
