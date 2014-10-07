/**
 * @class Oskari.leaflet.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.leaflet.mapmodule.plugin.PanButtons',

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
        
        el.css("top",this.__conf.location.top);
        el.css("right",this.__conf.location.right);
        

        var ctl = L.Control.extend({
            el : el,
            options : {
                position : 'topright'
            },
            initialize : function(foo, options) {
                L.Util.setOptions(this, options);
            },

            onAdd : function(map) {
                return this.el.get()[0];
            },
            onRemove : function(map) {
                this.el.remove();
            }
        });

        return new ctl(this.pluginName, {
            el : el
        });
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
    "extend" : ["Oskari.mapping.mapmodule.plugin.PanButtons"]

});
