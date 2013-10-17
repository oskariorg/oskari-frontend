/**
 * @class Oskari.ol2.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.ol2.mapmodule.plugin.PanButtons',

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
        var me = this;
        var loc = this.__conf.location;

        var ctl = new OpenLayers.Control();
        OpenLayers.Util.extend(ctl, {
            eldiv : el.get()[0],
            draw : function() {
                OpenLayers.Control.prototype.draw.apply(this, arguments);
                return this.eldiv;
            },
            CLASS_NAME : "Oskari.PanButtons"
        });

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
