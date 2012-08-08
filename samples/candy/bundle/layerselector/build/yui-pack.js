/* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:28:33 GMT+0200 (Suomen normaaliaika)) */ 
/**
 *
 * @class Oskari.mapframework.ui.module.layerselector.AllLayersModule
 *
 * refactored to use Ext strengths rather than hammer ext with jquery
 *
 * @to-do support multiple views: basic grid view/ miminal search/grid view /
 * animated dataview
 * @to-do support keyword selections
 * @to-do backend with pluggable layer search caps : db,meta,semantic,
 * wmscaps,...,external resources?
 *
 *
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.layerselector.AllLayersModule',
/**
 * @constructor
 *
 * constructor with class member definitions
 *
 * NOTE: This SHALL not do much
 */
function() {

    this.libs = {
        ext : Oskari.$("Ext")
    };
    this.sandbox = null;
    var conf = Oskari.$("startup");

    this.conf = conf;

    this.stores = {};
    this.items = {};

    this.selected = {};

    this.scale = null;
    this.refreshTools = null;
    this.refreshLayerNames = null;

},
/**
 * prototype
 */
{
    __name : "AllLayersModule",
    getName : function() {
        return this.__name;
    },
    /**
     * @method refresh
     *
     * called when layer selection has been changed
     */
    refresh : function() {
        this.items.grid.getView().refresh();
    },
    /**
     * @method init
     * @param sandbox
     *           reference to sandbox
     * called by the mapframework to build UI
     */
    init : function(sandbox) {
        this.sandbox = sandbox;
        sandbox.printDebug("[AllLayersModule] " + "Initializing all layers module...");

        this.scale = sandbox.getMap().getScale();

        /* this is done in bundle */
        for(var p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

        ///this.prepareData(this.conf);

        this.createModels();
        this.createStores();

        var pnl = this.createUI();

        this.updateCurrentState();

        return pnl;

    },
    /**
     * @method updateCurrentState
     * refreshes current selected layers status
     */
    updateCurrentState : function() {
        var sandbox = this.sandbox;
        var layers = sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();
            this.selected[layerId] = layer;
            sandbox.printDebug("[AllLayersModule] " + "preselecting " + layerId);
        }
    },
    /**
     * @method createModels
     * let's create the data model if it hasn't been done
     * already
     */
    createModels : function() {
        //						var me = this;
        var xt = this.libs.ext;

        if(!xt.ClassManager.get('MapLayer')) {
            var modelFields = ['id', 'type', 'name', 'inspire', 'orgName', 'dataUrl', 'minScale', 'maxScale', 'orderNumber'];

            xt.define('MapLayer', {
                extend : 'Ext.data.Model',
                fields : modelFields
            });
        }
    },
    /**
     * Gets the layer models from MapLayerService and converts
     * them to MapLayer models for the store
     */
    getLayersData : function() {
        var me = this;
        var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        var layers = mapLayerService.getAllLayers();
        var convertedLayers = new Array();
        for(var i = 0; i < layers.length; i++) {

            var layer = Ext.create('MapLayer', {
                id : layers[i].getId(),
                name : layers[i].getName(),
                inspire : layers[i].getInspireName(),
                orgName : layers[i].getOrganizationName(),
                dataUrl : layers[i].getDataUrl(),
                minScale : layers[i].getMinScale(),
                maxScale : layers[i].getMaxScale(),
                orderNumber : layers[i].getOrderNumber()
            });

            if(layers[i].isBaseLayer()) {
                layer.set('type', 'base');
            }  else if(layers[i].isLayerOfType('WMS')) {
            	if(layers[i].isGroupLayer()) {
              		layer.set('type', 'group');
              	} else {
                	layer.set('type', 'wmslayer');
              	}
            } else if(layers[i].isLayerOfType('WFS')) {
            	layer.set('type', 'wfslayer');
            } else if(layers[i].isLayerOfType('VECTOR')) {
                layer.set('type', 'vector');
            }
            convertedLayers.push(layer);
        }
        return convertedLayers;
    },
    /**
     * @method createStores
     * let's create datastores for the UI
     */
    createStores : function() {

        //						var me = this;

        var layers = this.getLayersData();

        var allLayersStore = Ext.create('Ext.data.Store', {
            model : 'MapLayer',
            autoLoad : true,
            groupField : 'inspire',
            data : [layers]
        });
        this.regStore('allLayersStore', allLayersStore);

    },
    /**
     * @method regStore
     * @param id
     *           id for the store that can be used to get reference to the store
     * @param store
     *           actual store
     * helper to register store
     */
    regStore : function(id, store) {
        this.stores[id] = store;
    },
    /**
     * @method getStore
     * @param id
     *           id that was used when registering the store
     * helper to get store
     */
    getStore : function(id) {
        return this.stores[id];
    },
    /**
     * @method createUI
     * let's build the UI
     */
    createUI : function() {
        var me = this;
        var xt = this.libs.ext;

        var lang = me.sandbox.getLanguage();

        /**
         * renderer to support graying out of scale layers
         * adds a marker div around the actual content
         * so we can update it manually on scale change
         * uses dimmer() for actual rendering
         */
        function dimmerRenderer(value, meta, rec) {
            return '<div id="layerName_' + rec.get('id') + '">' + dimmer(value, rec) + '</div>';
        }

        /**
         * renderer to support graying out of scale layers
         */
        function dimmer(value, rec) {

            var minScale = rec.get('minScale');
            var maxScale = rec.get('maxScale');

            if(me.scale > maxScale && me.scale < minScale) {
                return value;
            } else {
                return "<span style=\"color: #c0c0c0;\">" + value + "</span>";
            }

        }

        // NOTE: row index is bugged with grouping grid
        // sencha has planned a fix for version 4.1
        // http://www.sencha.com/forum/showthread.php?135535-OPEN-EXTJSIV-2247-v4.0.1-Ext.grid.column.Action-incorrect-w-grouping&s=c5dbd05976250c907ce4b59c67347652
        /**
         * action column that provides support to select or
         * deselect layers
         */
        /*
        var gridActionColumn = {
        xtype : 'actioncolumn',
        width : 32,
        groupable: true,
        items : [
        {
        icon : Oskari.$().startup.imageLocation + '/resource/icons/lisays_vihrea.png',

        handler : function(pGrid, rowIndex, colIndex) {
        console.log("row=" + rowIndex);

        var rec = me.getStore(
        'allLayersStore').getAt(
        rowIndex);
        var layerId = "" + rec.get('id');

        me.sandbox.requestByName(me
        .getName(),
        "AddMapLayerRequest",
        [ layerId , false ]);
        },
        getClass : function(v, meta, rec) {
        var layerId = "" + rec.get('id');

        if (me.selected[layerId]) {
        return "hidden";
        } else
        return "";
        }

        },
        {
        icon : Oskari.$().startup.imageLocation + '/resource/icons/poisto.png',
        handler : function(grid, rowIndex,
        colIndex) {
        var rec = me.getStore(
        'allLayersStore').getAt(
        rowIndex);
        var layerId = "" + rec.get('id');
        me.sandbox.requestByName(me
        .getName(),
        "RemoveMapLayerRequest",
        [ layerId ]);

        },
        getClass : function(v, meta, rec) {

        var layerId = "" + rec.get('id');
        if (!me.selected[layerId]) {
        return "hidden";
        } else
        return "";
        }
        } ]
        };
        */

        /**
         * workaround since action columns dont work with grouping
         * see above
         * includeDiv is some (row?)number on normal render
         * when called internally we dont provide it so this
         * wont add divs inside themselves
         */
        function layerToolsRenderer(value, p, record) {
            return '<div id="layerTools_' + record.get('id') + '">' + renderActionLinks(record) + '</div>';
        }


        Ext.QuickTips.init();
        /**
         * Actual tools column renderer that we use also when
         * manually updating the grid
         */
        function renderActionLinks(record) {

            var layerIcon = '/resource/icons/taso.png';
            var layerIconTip = 'mapservice_maplayer_image_tooltip';

            if(record.get('type') == 'wfslayer') {
                layerIcon = '/resource/silk-icons/database.png';
                layerIconTip = 'selected_layers_module_wfs_icon_tooltip';
            } else if(record.get('type') == 'group') {
                layerIcon = '/resource/icons/group.png';
                layerIconTip = 'mapservice_basemap_image_tooltip';
            } else if(record.get('type') == 'base') {
                layerIcon = '/resource/icons/pino.png';
                layerIconTip = 'mapservice_basemap_image_tooltip';
            }
            // layerIcon
            var actionsHtml = '<img src="' + Oskari.$().startup.imageLocation + layerIcon + '" style="vertical-align: top;" data-qtip="' + me.sandbox.getText(layerIconTip) + '"/> ';

            var layerId = record.get('id');

            if(isNaN(layerId)) {
                // working with base layer here
                // need to add quotes as this is not a number
                // otherwise it is treated as js variable
                layerId = '\'' + layerId + '\'';
            }

            // if selected -> remove link
            if(me.selected[record.get('id')]) {
                actionsHtml = actionsHtml + '<a href="#" onclick="Oskari.$().sandbox.requestByName(\'' + me.getName() + '\', \'RemoveMapLayerRequest\',[' + layerId + ']);return false;" data-qtip="' + me.sandbox.getText("mapservice_layer_delete_title") + '"><img src="' + Oskari.$().startup.imageLocation + '/resource/icons/poisto.png' + '" height="15" /></a>';
            }
            // if not selected -> add link
            else if("base" == record.get('type')) {
                actionsHtml = actionsHtml + '<a href="#" onclick="Oskari.$().sandbox.requestByName(\'' + me.getName() + '\', \'AddMapLayerRequest\',[' + layerId + ',false]);return false;" data-qtip="' + me.sandbox.getText("leftpanel_add_layer") + '"><img src="' + Oskari.$().startup.imageLocation + '/resource/icons/lisays_vihrea.png' + '" height="15" /></a>';
            } else {
                actionsHtml = actionsHtml + '<a href="#" onclick="Oskari.$().sandbox.requestByName(\'' + me.getName() + '\', \'AddMapLayerRequest\',[' + layerId + ',true]);return false;" data-qtip="' + me.sandbox.getText("leftpanel_add_layer") + '"><img src="' + Oskari.$().startup.imageLocation + '/resource/icons/lisays_vihrea.png' + '" height="15" /></a>';
            }

            // popup link - only show if url defined
            var dataUrl = record.get('dataUrl');
            if(dataUrl) {
                actionsHtml = actionsHtml + ' <a href="#" onclick="Oskari.$().sandbox.requestByName(\'' + me.getName() + '\', \'ShowOverlayPopupRequest\',[\'' + dataUrl + '\']);return false;" data-qtip="' + me.sandbox.getText("mapservice_layer_show_info_title") + '"><img src="' + Oskari.$().startup.imageLocation + '/resource/icons/kysymysmerkki.png' + '" height="15"/></a>';
            }
            return actionsHtml;
        };

        function refreshTools(layerId) {
            // funny way to do this, but getByID returns null
            var recordRow = me.getStore('allLayersStore').findBy(function(r) {
                return r.get('id') == layerId;
            });
            var actualRecord = me.getStore('allLayersStore').getAt(recordRow);

            // FIXME: dirty dirty html replace
            // TODO: fix when actionColumn is used
            var toolsDiv = Ext.get('layerTools_' + layerId);
            if(toolsDiv) {
                toolsDiv.update(renderActionLinks(actualRecord));
            }
        }

        //assign method to "parent" or somesuch to get reference from
        // eventhandlers
        me.refreshTools = refreshTools;

        function refreshLayerNames() {

            me.getStore('allLayersStore').each(function(record) {
                var nameDiv = Ext.get('layerName_' + record.get('id'));
                if(nameDiv) {
                    var value = record.get('name');
                    nameDiv.update(dimmer(value, record));
                }
            });
        }

        //assign method to "parent" or somesuch to get reference from
        // eventhandlers
        me.refreshLayerNames = refreshLayerNames;

        var headerName = 'Nimi';
        if(lang == 'sv') {
            headerName = 'Namn';
        } else if(lang == 'en') {
            headerName = 'Name';
        }
        /**
         * a column model for the layer grid
         */
        var gridColumns = [{
            header : 'Actions',
            width : 64,
            renderer : layerToolsRenderer
        }, {
            header : headerName,
            // dataIndex : 'orderNumber',
            dataIndex : 'name',
            flex : 1,
            renderer : dimmerRenderer
        }];

        var sandbox = this.sandbox;
        var searchField = xt.create('Ext.form.TextField', {
            height : 25,
            emptyText : me.sandbox.getText("leftpanel_find_maplayers_value"),
            margin : 0,
            padding : 0,
            listeners : {
                focus : function(evt) {
                    Oskari.$().sandbox.request("SearchModule", Oskari.$().sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
                },
                blur : function(evt) {
                    Oskari.$().sandbox.request("SearchModule", Oskari.$().sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
                },
                change : {
                    fn : onSearchTextChange,
                    scope : this,
                    buffer : 100
                }
            }
        });
        this.items.searchtf = searchField;

        var groupingFeature = xt.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl : '{name} ({rows.length})',
            startCollapsed : true
        });

        /**
         * the grid that displays available layers
         */
        var grid = xt.create('Ext.grid.Panel', {
            flex : 1,
            margin : 0,
            padding : 0,
            bodyCls : 'blanco',
            frame: false,
            hideHeaders : true,
            bodyBorder : false,
            store : me.getStore('allLayersStore'),
            viewConfig : {
                stripeRows : true
            },
            features : [groupingFeature],
            columns : gridColumns
        });
        grid.getStore().sort([{
            property : 'inspire',
            direction : 'ASC'
        }, {
            property : 'orderNumber',
            direction : 'ASC'
        }]);

        this.items.grid = grid;

        var layerTabs = Ext.createWidget('tabpanel', {
            flex : 1,
            activeTab : 0,
            defaults : {
                bodyPadding : 0
            },
            listeners : {
                tabchange : function(tabPanel, newTab, oldTab, event) {
                    oldTab.removeAll(false);
                    grid.getStore().clearGrouping();
                    grid.getStore().group(newTab.getId());
                    grid.getStore().sort([{
                        property : newTab.getId(),
                        transform : function(value) {
                            return value.toLowerCase();
                        },
                        direction : 'ASC'
                    }, {
                        property : 'orderNumber',
                        direction : 'ASC'
                    }]);
                    newTab.add(grid);
                }
            },
            items : [{
                title : me.sandbox.getText('leftpanel_thema_title'),
                id : 'inspire',
                // without layout, the scrollbars dont work
                layout : 'fit',
                items : grid
            }, {
                title : me.sandbox.getText('leftpanel_organisation_title'),
                id : 'orgName',
                layout : 'fit'
                // items(=grid) is set manually in listener because its reused
                // and cant be on both tabs at the same time
            }]
        });

        function onSearchTextChange() {
            var searchText = searchField.getValue();
            var hasText = (searchText != '');
            // only send event from clear if not applying another filter
            // collapse groups when not filtering
            groupingFeature.startCollapsed = true;
            me.getStore('allLayersStore').clearFilter(hasText);
            // filter the store data with the text field value
            if(hasText) {

                // expand groups with filtering
                groupingFeature.startCollapsed = false;
                // do the filtering
                me.getStore('allLayersStore').filterBy(function(record, id) {
                    var recordName = record.get('name');
                    var recordOrg = record.get('orgName');

                    var pattern = new RegExp(searchText, 'gi');
                    // g=global match, i= case insensitive

                    if(pattern.test(recordName) || pattern.test(recordOrg)) {
                        return true;
                    }
                });
            }

        };

        var layerSelectionPanel = xt.create('Ext.panel.Panel', {
            bodyPadding : 0,
            margin : 0,
            id: 'AllLayersModule', // for selenium selector
            padding : 0,
            layout : {
                type : 'vbox',
                padding : 0,
                align : 'stretch'
            },
            items : [searchField, layerTabs]
        });
        return layerSelectionPanel;
    },
    /**
     * @method start
     * @param sandbox
     *           reference to sandbox
     * called by the mapframework
     */
    start : function(sandbox) {
        sandbox.printDebug("[AllLayersModule] " + "Starting " + this.getName());

    },
    /**
     * @method stop
     * @param sandbox
     *           reference to sandbox
     *
     */
    stop : function(sandbox) {
    },
    /**
     * @method checkLayerScales
     * @param currentScale
     *           desc
     * let's do nothing anymore since all is being done in grid
     * renderers
     */
    checkLayerScales : function(currentScale) {
        //						var sandbox = this._sandbox;
        //						var me = this;

    },
    /**
     * @method afterMapLayerAddEvent
     * @param event
     *           event that triggered this
     * let's refresh UI after map layer selection has changed
     */
    afterMapLayerAddEvent : function(event) {
        //						var sandbox = this.sandbox;
        var layer = event.getMapLayer();
        var me = this;
        me.selected[layer.getId()] = layer;

        // update the tools on the grid row
        this.refreshTools(layer.getId());
        //this.refresh();
    },
    /**
     * @method afterMapLayerRemoveEvent
     * @param event
     *           event that triggered this
     * let's refresh UI after map layer selection has changed
     */
    afterMapLayerRemoveEvent : function(event) {
        //						var sandbox = this.sandbox;
        var layer = event.getMapLayer();
        var me = this;
        me.selected[layer.getId()] = undefined;
        // update the tools on the grid row
        this.refreshTools(layer.getId());
        //this.refresh();
    },
    /**
     * @method afterMapMoveEvent
     * @param event
     *           event that triggered this
     * let's refresh ui to match current scale
     */
    afterMapMoveEvent : function(event) {

        var eventScale = event.getScale();
        // eventScale is undefined if sent from openlayers moveend
        // == when sent from searchmodule etc
        if(eventScale == this.scale || !eventScale) {
            return;
        }

        this.scale = eventScale;

        //scale graying
        this.refreshLayerNames();
    },
    /**
     * @method handleMapLayerChange
     * @param event
     *           event that triggered this
     * let's refresh ui to match current layers
     */
    handleMapLayerChange : function(event) {
        var me = this;
        // not really interested what happened just update the list
        var newLayers = this.getLayersData();
        me.getStore('allLayersStore').loadData(newLayers);
    },
    /**
     * handlers that get called by the mapframework
     */
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterMapMoveEvent' : function(event) {
            this.afterMapMoveEvent(event);
        },
        'MapLayerEvent' : function(event) {
            this.handleMapLayerChange(event);
        }
    },

    /**
     * @method onEvent
     * @param event
     *           event that triggered this
     * handler function that dispatches to eventHandlers
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];

        if(!handler)
            return;

        return handler.apply(this, [event]);
    }
},
/**
 * metadata for this class
 */

{
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance *//**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultLayerSelectorBundleInstance",
				function(b) {
					this.name = 'layerselector';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					this.ui = null;
				},
				/*
				 * prototype
				 */
				{
					
					createPanel: function() {
						var me = this;
						var xt = me.libs.ext;
						var pnl = xt.create('Ext.Panel', {
							region : 'center',
							layout : 'fit',
							height: 384,
							items : []
						});
						
						return pnl;
					},

					/**
					 * start bundle instance
					 * 
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;
						
						var me = this;

						me.libs = {
							ext : Oskari.$("Ext")
						};

						me.facade = Oskari.$('UI.facade');

						me.impl = Oskari.clazz
								.create('Oskari.mapframework.ui.module.layerselector.AllLayersModule');

						var pnl = this.createPanel();
						
						/**
						 * 
						 * register to framework and eventHandlers
						 */
						var def = me.facade.appendExtensionModule(me.impl,
								me.name, {}/* this.impl.eventHandlers */,
								me, 'E', {
									'fi' : {
										title : 'Kaikki tasot'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : 'Map Layers'
									}

								},pnl);
						
						me.def = def;
						
						pnl.add(def.initialisedComponent);
						
						me.impl.start(this.facade.getSandbox());
						
						me.mediator.setState("started");
						
						return this;
					},

					/**
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * stop bundle instance
					 */
					"stop" : function() {
						
						this.impl.stop();

						this.facade.removeExtensionModule(this.impl, this.name,
								this.impl.eventHandlers, this, this.def);

						this.def = null;
						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultLayerSelectorBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
