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
        
        this.filterField = this.getFilterField();
        this.tabPanel.getContainer().append(this.filterField.getField());
        
        this.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion.insertTo(this.tabPanel.getContainer());
    },
    getFilterField : function() {
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        field.bindChange(function(event) {
            me.filterLayers(field.getValue());
        }, true);
        return field;
    },
    showLayerGroups : function(groups) {
        var me = this;
        this.accordion.removeAllPanels();
        this.layerContainers = undefined;
        this.layerContainers = {};
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
                
                this.layerContainers[layer.getId()] = layerWrapper;
            }
            this.accordion.addPanel(groupPanel);
        }
        
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
            this.setLayerSelected(selectedLayers[i].getId(), true);
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
        if(!keyword || keyword.length == 0) {
            this._showAllLayers();
            return;
        }
        // filter
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            var visibleLayerCount = 0;
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                var bln = group.matchesKeyword(layerId, keyword);
                layerCont.setVisible(bln);
                if(bln) {
                    visibleLayerCount++;
                    // open the panel if matching layers
                    group.layerListPanel.open();
                }
            }
            group.layerListPanel.setVisible(visibleLayerCount > 0);
            group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount +  '/' + layers.length + ')');
        }
        // TODO: check if there are no groups visible -> show 'no matches' notification?
    },
    
    _showAllLayers : function() {
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                layerCont.setVisible(true);
            }
            group.layerListPanel.setVisible(true);
            group.layerListPanel.close();
            group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        }
    },
    setLayerSelected : function(layerId, isSelected) {
        var layerCont = this.layerContainers[layerId];
        layerCont.setSelected(isSelected);
    },
    setLayerName : function(layerId, newName) {
        var layerCont = this.layerContainers[layerId];
        layerCont.setSelected(isSelected);
    }
});
