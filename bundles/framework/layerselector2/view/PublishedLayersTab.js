/**
 * @class Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, title) {
        
        this.instance = instance;
        this.title = title;
        this.layerGroups = [];
        this.layerContainers = {};
        this._createUI();
    }, {

        getTitle: function () {
            
            return this.title;
        },

        getTabPanel: function () {
            
            return this.tabPanel;
        },

        getState: function () {
            
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
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

        setState: function (state) {
            
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterLayers(state.filter);
            }
            /* TODO: should open panels in this.accordion where groups[i] == panel.title
            if (state.groups && state.groups.length > 0) {

            }
            */
        },

        _createUI: function () {
            
            var me = this;
            me.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(this.title);
            me.tabPanel.setSelectionHandler(function (wasSelected) {
                if (wasSelected) {
                    me.tabSelected();
                } else {
                    me.tabUnselected();
                }
            });

            me.tabPanel.getContainer().append(this.getFilterField().getField());

            me.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            me.accordion.insertTo(this.tabPanel.getContainer());
        },

        getFilterField: function () {
            
            if (this.filterField) {
                return this.filterField;
            }
            var me = this,
                field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization('filter').text);
            field.addClearButton();
            field.bindChange(function (event) {
                me._searchTrigger(field.getValue());
            }, true);
            field.bindEnterKey(function (event) {
                me._relatedSearchTrigger(field.getValue());
            });
            this.filterField = field;
            return field;
        },

        _searchTrigger: function (keyword) {
            
            var me = this;
            // clear any previous search if search field changes
            if (me.searchTimer) {
                clearTimeout(me.searchTimer);
            }
            // if field is was cleared -> do immediately
            if (!keyword || keyword.length === 0) {
                me._search(keyword);
            } else {
                // else use a small timeout to see if user is typing more
                me.searchTimer = setTimeout(function () {
                    me._search(keyword);
                    me.searchTimer = undefined;
                }, 500);
            }
        },

        _relatedSearchTrigger: function (keyword) {
            
            var me = this;
            // clear any previous search if search field changes
            if (me.searchTimer) {
                clearTimeout(me.searchTimer);
            }
            // if field is was cleared -> do immediately
            /* TODO!
            if (!keyword || keyword.length === 0) {
                me._search(keyword);
            }*/
        },

        tabSelected: function () {
            
            // update data if now done so yet
            if (this.layerGroups.length === 0) {
                this.accordion.showMessage(this.instance.getLocalization('loading'));
                var me = this,
                    ajaxUrl = this.instance.sandbox.getAjaxUrl();
                jQuery.ajax({
                    type: "GET",
                    dataType: 'json',
                    beforeSend: function (x) {
                        if (x && x.overrideMimeType) {
                            x.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    url: ajaxUrl + 'action_route=GetPublishedMyPlaceLayers',
                    success: function (pResp) {
                        me._populateLayerGroups(pResp);
                        me.showLayerGroups(me.layerGroups);
                    },
                    error: function (jqXHR, textStatus) {
                        var loc = me.instance.getLocalization('errors');
                        me.accordion.showMessage(loc.generic);
                    }
                });
            }
        },

        tabUnselected: function () {
            
        },

        /**
         * @method _getLayerGroups
         * @private
         */
        _populateLayerGroups: function (jsonResponse) {
            
            var me = this,
                sandbox = me.instance.getSandbox(),
                mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                userUuid = Oskari.user().getUuid(),
                group = null,
                n,
                groupJSON,
                i,
                layerJson,
                layer;

            this.layerGroups = [];
            for (n = 0; n < jsonResponse.length; n += 1) {
                groupJSON = jsonResponse[n];
                if (!group || group.getTitle() !== groupJSON.name) {
                    group = Oskari.clazz.create("Oskari.mapframework.bundle.layerselector2.model.LayerGroup", groupJSON.name);
                    this.layerGroups.push(group);
                }
                for (i = 0; i < groupJSON.layers.length; i += 1) {
                    layerJson = groupJSON.layers[i];
                    layer = this._getPublishedLayer(layerJson, mapLayerService, userUuid === groupJSON.id);
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
        _getPublishedLayer: function (jsonResponse, mapLayerService, usersOwnLayer) {
            
            var baseJson = this._getMapLayerJsonBase(),
                layer;
            baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + jsonResponse.id + "&"; // this.instance.conf.wmsUrl
            //baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + categoryModel.getId() + "&";
            baseJson.name = jsonResponse.name;
            baseJson.id = 'myplaces_' + jsonResponse.id;

            if (usersOwnLayer) {
                baseJson.permissions = {
                    "publish": "publication_permission_ok"
                };
            } else {
                baseJson.permissions = {
                    "publish": "no_publication_permission"
                };
            }

            layer = mapLayerService.createMapLayer(baseJson);
            if (!usersOwnLayer) {
                // catch exception if the layer is already added to maplayer service
                // reloading published layers will crash otherwise
                // myplaces bundle will add users own layers so we dont even have to try it
                try {
                    mapLayerService.addLayer(layer);
                } catch (ignore) {
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
        _getMapLayerJsonBase: function () {
            
            var catLoc = this.instance.getLocalization('published'),
                json = {
                    wmsName: 'ows:my_places_categories',
                    type: "wmslayer",
                    isQueryable: true,
                    opacity: 50,
                    metaType: 'published',
                    orgName: catLoc.organization,
                    inspire: catLoc.inspire
                };
            return json;
        },

        showLayerGroups: function (groups) {
            
            var me = this,
                i,
                group,
                layers,
                groupContainer,
                groupPanel,
                n,
                layer,
                layerWrapper,
                layerContainer,
                loc,
                selectedLayers;

            me.accordion.removeAllPanels();
            me.layerContainers = undefined;
            me.layerContainers = {};
            me.layerGroups = groups;
            for (i = 0; i < groups.length; i += 1) {
                group = groups[i];
                layers = group.getLayers();
                groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
                group.layerListPanel = groupPanel;

                groupContainer = groupPanel.getContainer();
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerWrapper =
                        Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                            layer, me.instance.sandbox, me.instance.getLocalization());
                    layerContainer = layerWrapper.getContainer();
                    groupContainer.append(layerContainer);

                    me.layerContainers[layer.getId()] = layerWrapper;
                }
                me.accordion.addPanel(groupPanel);
            }

            if (me.layerGroups.length === 0) {
                // empty result
                loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.noResults);
            } else {
                selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
                for (i = 0; i < selectedLayers.length; i += 1) {
                    me.setLayerSelected(selectedLayers[i].getId(), true);
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

        _search: function (keyword) {
            
            var me = this;

            if (!keyword || keyword.length === 0) {
                // show all
                me.updateLayerContent();
                return;
            }
            // empty previous
            me.showLayerGroups([]);
            me.accordion.showMessage(this.instance.getLocalization('loading'));

            // search
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data: {
                    searchKey: keyword
                },
                url: ajaxUrl + 'action_route=FreeFindFromMyPlaceLayers',
                success: function (pResp) {
                    me._populateLayerGroups(pResp);
                    me.showLayerGroups(me.layerGroups);
                },
                error: function (jqXHR, textStatus) {
                    var loc = me.instance.getLocalization('errors');
                    me.accordion.showMessage(loc.generic);
                }
            });
            // TODO: check if there are no groups visible -> show 'no matches'
            // notification?
        },

        setLayerSelected: function (layerId, isSelected) {
            
            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.setSelected(isSelected);
            }
        },

        updateLayerContent: function (layerId, layer) {
            
            // empty the listing to trigger refresh when this tab is selected again
            this.accordion.removeMessage();
            this.showLayerGroups([]);
            this.tabSelected();
        }
    });