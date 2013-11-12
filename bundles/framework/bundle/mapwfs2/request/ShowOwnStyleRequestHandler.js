/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler",

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
 */
function(plugin) {
	this.plugin = plugin;
	this.localization = plugin.getLocalization('popup');
    this.visualizationForm = this.plugin.getVisualizationForm();

    /* templates */
    this.template = {};
    for (p in this.__templates ) {
        this.template[p] = jQuery(this.__templates[p]);
    }
}, {
    __templates : {
        "wrapper" : '<div></div>',
        "toolsButton" : '<div style= "display: inline-block; border: 1px solid;"></div>',
        "link" : '<div class="link"><a href="javascript:void(0);"></a></div></div>' 
    },

    /**
     * @method handleRequest
     * Shows WFS feature data with requested properties
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var layerId = request.getId();
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        var customStyle = layer.getCustomStyle();

        if(customStyle) {
            this.visualizationForm.setValues(customStyle);
        }

        // init popup
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var title = this.localization.title;
        var content = this.template.wrapper.clone();

        // add form
        // TODO: this.plugin getValues ? - plugin / layer holds the custom style values for the user ;)
        content.append(this.visualizationForm.getForm());

        // buttons

        var self = this;

        var saveOwnStyleBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveOwnStyleBtn.setTitle(this.localization.button.save);
        saveOwnStyleBtn.addClass('primary saveOwnStyle');
        saveOwnStyleBtn.setHandler(function() {
            var styleName = "oskari_custom";
            
            // remove old custom tiles
            self.plugin.deleteTileCache(layerId, styleName);

            // set values to backend 
            var values = self.visualizationForm.getValues();
            layer.setCustomStyle(values);
            self.plugin.setCustomStyle(layerId, values);

            // change style to custom
            layer.selectStyle(styleName);
            var event = self.plugin.getSandbox().getEventBuilder('MapLayerEvent')(layerId, 'update');
            self.plugin.getSandbox().notifyAll(event);

            dialog.close();
        });

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(this.localization.button.cancel);
        cancelBtn.setHandler(function() {
            dialog.close();
        });

        // show popup
        dialog.addClass('wfs_own_style');
        dialog.show(title, content, [cancelBtn, saveOwnStyleBtn]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});