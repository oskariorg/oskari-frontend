/**
 * @class Oskari.liikenenvirasto.bundle.lakapa.layerselector2.view.PublishedLayersTab
 *
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.PublishedLayersTab",

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
            me._searchTrigger(field.getValue());
        }, true);
        this.filterField = field;
        return field;
    },
    _searchTrigger : function(keyword) {
        var me = this;
        // clear any previous search if search field changes
        if(this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        // if field is was cleared -> do immediately
        if (!keyword || keyword.length == 0) {
            me._search(keyword);
        }
        else {
        // else use a small timeout to see if user is typing more
            this.searchTimer = setTimeout(function() {
                me._search(keyword);
                me.searchTimer = undefined;
            }, 500);
        }
    },
    tabSelected : function() {
        // update data if now done so yet
        if(this.layerGroups.length == 0) {
            this.accordion.showMessage(this.instance.getLocalization('loading'));
            var me = this;
            var ajaxUrl = this.instance.sandbox.getAjaxUrl();
            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                  if(x && x.overrideMimeType) {
                   x.overrideMimeType("application/j-son;charset=UTF-8");
                  }
                 },
                url : ajaxUrl + 'action_route=GetPublishedMyPlaceLayers',
                success : function(pResp) {
                    me._populateLayerGroups(pResp);
                    me.showLayerGroups(me.layerGroups);
                },
                error : function(jqXHR, textStatus) {
                    var loc = me.instance.getLocalization('errors');
                    me.accordion.showMessage(loc.generic);
                }
            });
        }
    },
    tabUnselected : function() {

    },
    /**
     * @method _getLayerGroups
     * @private
     */
    _populateLayerGroups : function(jsonResponse) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        this.layerGroups = [];

        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var userUuid = Oskari.user().getUuid();
        var group = null;
        for (var n = 0; n < jsonResponse.length; ++n) {
            var groupJSON = jsonResponse[n];
            if (!group || group.getTitle() != groupJSON.name) {
                group = Oskari.clazz.create("Oskari.liikennevirasto.bundle.lakapa.layerselector2.model.LayerGroup", groupJSON.name);
                this.layerGroups.push(group);
            }
            for (var i = 0; i < groupJSON.layers.length; ++i) {
                var layerJson = groupJSON.layers[i];
                var layer = this._getPublishedLayer(layerJson, mapLayerService, userUuid == groupJSON.id);
                layer.setDescription(groupJSON.name); // user name as "subtitle"
                group.addLayer(layer);
            }
        }
    },

    /**
     * @method _getPublishedLayer
     * Populates the category based data to the base maplayer json
     * @private
     * @return maplayer json for the category
     */
    _getPublishedLayer : function(jsonResponse, mapLayerService, usersOwnLayer) {
        var baseJson = this._getMapLayerJsonBase();
        baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + jsonResponse.id + "&"; // this.instance.conf.wmsUrl
        //baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + categoryModel.getId() + "&";
        baseJson.name = jsonResponse.name;
        baseJson.id = 'myplaces_' + jsonResponse.id;

        if(usersOwnLayer) {
            baseJson.permissions = {
                "publish" : "publication_permission_ok"
            };
        }
        else {
            baseJson.permissions = {
                "publish" : "no_publication_permission"
            };
        }

        var layer = mapLayerService.createMapLayer(baseJson);
        if(!usersOwnLayer) {
            // catch exception if the layer is already added to maplayer service
            // reloading published layers will crash otherwise
            // myplaces bundle will add users own layers so we dont even have to try it
            try {
                mapLayerService.addLayer(layer);
            }
            catch(ignored) {
                // layer already added, ignore
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
            //gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:true,
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
                    Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.layerselector2.view.Layer',
                    layer, this.instance.sandbox, this.instance.getLocalization());
                var layerContainer = layerWrapper.getContainer();
                groupContainer.append(layerContainer);

                this.layerContainers[layer.getId()] = layerWrapper;
            }
            this.accordion.addPanel(groupPanel);
        }

        if(this.layerGroups.length == 0) {
            // empty result
            var loc = this.instance.getLocalization('errors');
            this.accordion.showMessage(loc.noResults);
        }
        else {
            var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
            for(var i = 0; i < selectedLayers.length; ++i) {
                this.setLayerSelected(selectedLayers[i].getId(), true);
            }
        }
    },
    /**
     * @method _search
     * @private
     * @param {String} keyword
     *      keyword to filter layers by
     * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
     * Also checks if all layers in a group is hidden and hides the group as well.
     */

    _search : function(keyword) {

        var me = this;

        if (!keyword || keyword.length == 0) {
            // show all
            this.updateLayerContent();
            return;
        }
        // empty previous
        this.showLayerGroups([]);
        this.accordion.showMessage(this.instance.getLocalization('loading'));

        // search
        jQuery.ajax({
            type : "GET",
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            data : {
                searchKey : keyword
            },
            url : ajaxUrl + 'action_route=FreeFindFromMyPlaceLayers',
            success : function(pResp) {
                me._populateLayerGroups(pResp);
                me.showLayerGroups(me.layerGroups);
            },
            error : function(jqXHR, textStatus) {
                var loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.generic);
            }
        });
        // TODO: check if there are no groups visible -> show 'no matches'
        // notification?
    },
    setLayerSelected : function(layerId, isSelected) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.setSelected(isSelected);
        }
    },
    updateLayerContent : function(layerId, layer) {
        // empty the listing to trigger refresh when this tab is selected again
        this.showLayerGroups([]);
        this.tabSelected();
    }
});
