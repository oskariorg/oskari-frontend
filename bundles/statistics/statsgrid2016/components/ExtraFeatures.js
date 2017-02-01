Oskari.clazz.define('Oskari.statistics.statsgrid.ExtraFeatures', function(sandbox, locale) {
    this.locale = locale;
    this.sb = sandbox;
}, {
    /****** PUBLIC METHODS ******/
    /**
     * @method  @public getPanelContent get content panel
     */
    getPanelContent: function() {
        var me = this;
        var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        checkbox.setTitle(this.locale.showMapLayers);
        checkbox.setChecked(true);
        checkbox.setHandler(function() {
            me._toggleSelectedLayersVisibility(checkbox.isChecked());
        });
        return checkbox.getElement();
    },

    /****** PRIVATE METHODS ******/
    /**
     * @method  @private _toggleSelectedLayersVisibility toggle selected layers visibility
     * @param  {Boolean} checked is checked
     */
    _toggleSelectedLayersVisibility: function(checked) {
        var sandbox = this.sb;
        if (!sandbox.hasHandler('MapModulePlugin.MapLayerVisibilityRequest')) {
            return;
        }
        var selectedLayers = sandbox.findAllSelectedMapLayers();
        selectedLayers.forEach(function(layer){
            if(!checked && layer.getLayerType() !== 'stats') {
                sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), false]);
            } else {
                sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), true]);
            }
        });
    }
});