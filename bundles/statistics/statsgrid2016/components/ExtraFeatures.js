Oskari.clazz.define('Oskari.statistics.statsgrid.ExtraFeatures', function (sandbox, locale) {
    this.locale = locale;
    this.sb = sandbox;
    this._checkboxes = [];
}, {
    /** **** PUBLIC METHODS ******/
    /**
     * @method  @public getPanelContent get content panel
     */
    getPanelContent: function () {
        var me = this;
        var content = jQuery('<div></div>');
        me._initCheckboxes();
        me._checkboxes.forEach(function (buttonConf) {
            content.append(buttonConf.button.getElement());
        });
        return content;
    },

    /**
     * @method @public getValues get extra feature values
     * @return {Object} extra features values
     */
    getValues: function () {
        var me = this;
        var values = {};
        me._checkboxes.forEach(function (chkConf) {
            values[chkConf.id] = chkConf.button.isChecked();
        });
        return values;
    },

    /** **** PRIVATE METHODS ******/
    _initCheckboxes: function () {
        var me = this;
        me._checkboxes.push({
            id: 'hideOtherLayers',
            button: me._getHideOtherLayersCheckbox()
        });
        me._checkboxes.push({
            id: 'openTable',
            button: me._getOpenTableCheckbox()
        });
        me._checkboxes.push({
            id: 'openDiagram',
            button: me._getOpenDiagramCheckbox()
        });
    },
    /**
     * @method  @private _getOpenTableCheckbox  gets open table checbox element and sets this handler
     * @return {Object} checkbox element
     */
    _getOpenDiagramCheckbox: function () {
        var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        checkbox.setTitle(this.locale.openDiagramCheckbox);
        checkbox.setChecked(false);
        return checkbox;
    },
    /**
     * @method  @private _getOpenTableCheckbox  gets open table checbox element and sets this handler
     * @return {Object} checkbox element
     */
    _getOpenTableCheckbox: function () {
        var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        checkbox.setTitle(this.locale.openTableCheckbox);
        checkbox.setChecked(false);
        return checkbox;
    },
    /**
     * @method  @private _getHideOtherLayersCheckbox  gets hide other layers checbox element and sets this handler
     * @return {Object} checkbox element
     */
    _getHideOtherLayersCheckbox: function () {
        var me = this;
        var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        checkbox.setTitle(this.locale.hideMapLayers);
        checkbox.setChecked(false);
        checkbox.setHandler(function () {
            me._toggleSelectedLayersVisibility(checkbox.isChecked());
        });
        return checkbox;
    },
    /**
     * @method  @private _toggleSelectedLayersVisibility toggle selected layers visibility
     * @param  {Boolean} checked if checked then hide all map layers
     */
    _toggleSelectedLayersVisibility: function (checked) {
        var sandbox = this.sb;
        if (!sandbox.hasHandler('MapModulePlugin.MapLayerVisibilityRequest')) {
            return;
        }
        var selectedLayers = sandbox.findAllSelectedMapLayers();
        selectedLayers.forEach(function (layer) {
            if (checked && layer.getId() !== 'STATS_LAYER') {
                sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), false]);
            } else {
                sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layer.getId(), true]);
            }
        });
    }
});
