/**
 * @class Oskari.mapframework.bundle.layerselector2.view.LayersTab
 * 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.view.LayersTab",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance, title) {
    this.instance = instance;
    this.title = title;
    this.layerGroups = [];
    this.layerContainers = {};
    this._createUI();
}, {
    getTabPanel : function() {
        return this.tabPanel;
    },
    _createUI : function() {
        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);
        
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        /*field.bindChange(function(event) {
            me.filterLayers(field.getValue());
        }, true);*/
        this.tabPanel.getContainer().append(field.getField());
        this.filterField = field;
        
        this.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion.insertTo(this.tabPanel.getContainer());
    },
    showLayerGroups : function(groups) {
        var me = this;
        this.layerGroups = groups;
        for(var i = 0; i < groups.length; ++i) {
            var group = groups[i];
            var layers = group.getLayers();
            var groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
            group.layerListPanel = groupPanel;
            
            var groupContainer = groupPanel.getContainer();
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerWrapper = 
                    Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                    layer, this.instance.sandbox, this.instance.getLocalization());
                var layerContainer = layerWrapper.getContainer();
                if(n%2 == 1) {
                    layerContainer.addClass('odd');
                }
                groupContainer.append(layerContainer);
                this.layerContainers[layer.getId()] = layerContainer;
            }
            this.accordion.addPanel(groupPanel);
        }
    },
    /**
     * @method _filterLayers
     * @private
     * @param {String} keyword
     *      keyword to filter layers by
     * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
     * Also checks if all layers in a group is hidden and hides the group as well.
     */
    filterLayers : function(keyword) {
        
        // show all groups
        this.accordion.showPanels();
        if(!keyword || keyword.length > 0) {
            return;
        }
        // filter
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            var layerCont = this.layerContainers[layerId];
            var allLayersHidden = true;
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var bln = group.matchesKeyword(layer.getId(), keyword);
                layerCont.setVisible(bln);
                if(bln) {
                    allLayersHidden = false;
                    // open the panel if matching layers
                    group.layerListPanel.open();
                }
            }
            group.layerListPanel.setVisible(allLayersHidden);
        }
        // TODO: check if there are no groups visible -> show 'no matches' notification?
    }
});
