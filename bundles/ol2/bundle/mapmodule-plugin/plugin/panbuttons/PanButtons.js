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

        /*var ctl = new OpenLayers.Control({
         type : OpenLayers.Control.TYPE_BUTTON,
         loc : loc,
         div : el.get()[0],
         moveTo : function(px) {
         this.div.style.right = loc.right;
         this.div.style.top = loc.top;
         },

         draw : function(px) {
         this.moveTo(this.position);
         return this.div;
         }
         });
         */
        var ctl = new OpenLayers.Control();
        OpenLayers.Util.extend(ctl, {
            div : el.get()[0],
            draw : function() {
                // this Handler.Box will intercept the shift-mousedown
                // before Control.MouseDefault gets to see it

                return this.div;
            }
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
