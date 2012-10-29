/**
 * @class Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab",

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
    getTitle : function() {
        return this.title;
    },
    getTabPanel : function() {
        return this.tabPanel;
    },
    getState : function() {
        var state = {
            tab : this.getTitle(),
            filter : this.filterField.getValue(),
            groups : []
        };
        // TODO: groups listing
        /*
        var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup.open');
        for(var i=0; i < layerGroups.length; ++i) {
            var group = layerGroups[i];
            state.groups.push(jQuery(group).find('.groupName').text());
        }*/
        return state;
    },
    setState : function(state) {
        if(!state) {
            return;
        }
        
        if(!state.filter) {
            this.filterField.setValue(state.filter);
            this.filterLayers(state.filter);
        }
        if(state.groups && state.groups.length > 0) {
            // TODO: should open panels in this.accordion where groups[i] == panel.title
        }
    },
    _createUI : function() {
        var me = this;
        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);
        this.tabPanel.setSelectionHandler(function(wasSelected) {
            if(wasSelected) {
                me.tabSelected();
            }
            else {
                me.tabUnselected();
            }
        });
        
        this.tabPanel.getContainer().append(this.getFilterField().getField());
        
        this.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion.insertTo(this.tabPanel.getContainer());
    },
    getFilterField : function() {
        if(this.filterField) {
            return this.filterField;
        }
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        field.bindChange(function(event) {
            alert('go ajax');
        }, true);
        this.filterField = field;
        return field;
    },
    tabSelected : function() {
        alert('TODO: json query for users');
        //this._getLayerGroups(jsonResponse)
    },
    tabUnselected : function() {
        //alert('unselected');
    },
    /**
     * @method _getLayerGroups
     * @private
     */
    _getLayerGroups : function(jsonResponse) {
        // FIXME: work in progress, no actual data yet so not tested
        var me = this;
        var sandbox = this.instance.getSandbox();

        var groupList = [];
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var userUuid = sandbox.getUser().getUuid();
        var group = null;
        for (var n = 0; n < jsonResponse.length; ++n) {
            var groupJSON = jsonResponse[n];
            if (!group || group.getTitle() != groupJSON.name) {
                group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", groupJSON.name);
                groupList.push(group);
            }
            for (var i = 0; i < jsonResponse.layers.length; ++i) {
                var layerJson = jsonResponse.layers[i];
                var layer = this._getPublishedLayer(layerJson, mapLayerService, userUuid == groupJSON.uuid);
                layer.setDescription(groupJSON.name); // user name as "subtitle"
                group.addLayer(layer);
            }
        }
        return groupList;
    },
    /**
     * @method _getPublishedLayer
     * Populates the category based data to the base maplayer json
     * @private 
     * @return maplayer json for the category
     */
    _getPublishedLayer : function(jsonResponse, mapLayerService, hasPermission) {
        var baseJson = this._getMapLayerJsonBase();
        baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + jsonResponse.id + "&"; // this.instance.conf.wmsUrl
        //baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + categoryModel.getId() + "&";
        baseJson.name = jsonResponse.name;
        baseJson.id = 'myplaces_' + '<id>';
        var layer = mapLayerService.createMapLayer(baseJson);
        mapLayerService.addLayer(layer);
        
        // TODO: check this here or where?
        if(hasPermission) {
            baseJson.permissions = {
                "publish" : "publication_permission_ok" 
            }
        }
        else {
            baseJson.permissions = {
                "publish" : "no_publication_permission"
            }
        }
        return layer;
    },
    /**
     * @method _getMapLayerJsonBase
     * Returns a base model for maplayer json to create my places map layer
     * @private 
     * @return {Object}
     */
    _getMapLayerJsonBase : function() {
        var catLoc = this.instance.getLocalization('published');
        var json = {
            wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            type: "wmslayer",
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity: 50,
            metaType: 'published',
            orgName: catLoc.organization,
            inspire: catLoc.inspire,
            maxScale:1
        };
        return json;
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
                groupContainer.append(layerContainer);
                
                this.layerContainers[layer.getId()] = layerWrapper;
            }
            this.accordion.addPanel(groupPanel);
        }
        
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
            this.setLayerSelected(selectedLayers[i].getId(), true);
        }
                    
        this.filterLayers(this.filterField.getValue());
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
                    if(visibleLayerCount%2 == 1) {
                        layerCont.getContainer().addClass('odd');
                    }
                    else {
                        layerCont.getContainer().removeClass('odd');
                    }
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
                if(n%2 == 1) {
                    layerCont.getContainer().addClass('odd');
                }
                else {
                    layerCont.getContainer().removeClass('odd');
                }
            }
            group.layerListPanel.setVisible(true);
            group.layerListPanel.close();
            group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        }
    },
    setLayerSelected : function(layerId, isSelected) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.setSelected(isSelected);
        }
    },
    setLayerName : function(layerId, newName) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.setLayerName(newName);
        }
    }
});
