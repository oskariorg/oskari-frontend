/**
 * refactored to use Ext strengths rather than hammer ext with jquery
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.layerselector.SelectedLayersModule',
/**
 * constructor
 *
 * NOTE: this SHALL not do much
 */
function(publisherWizardStepNumber) {
    this._core
    this._sandbox
    this._publisherWizardStepNumber = publisherWizardStepNumber;

    this._layerPortal = null;
    this._layerOrder = null;

    this._items = {
        layerItems : {}
    };

    this.loc = {};

    this._scale = null;
},
/**
 * prototype
 */
{
    getName : function() {
        return "SelectedLayersModule";
    },
    isPublisherWizardStep : function(stepNumber) {
        if(this._publisherWizardStepNumber == stepNumber) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * called by the mapframework to get the UI
     */
    init : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.printDebug("Initializing selected layers module...");

        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this.createLocale();

        /**
         * create and return UI
         */
        var panel = this.createUI();

        /**
         * refresh to match current map layer selection
         */
        this.updateCurrentState();

        return panel;
    },
    /**
     * called by the mapframework
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    /**
     *
     */
    stop : function(sandbox) {
    },
    /**
     *
     */
    createLocale : function() {
        var sandbox = this._sandbox;

        /**
         * get all texts here
         */
        this.loc = {
            leftpanel_selected_layers_title : sandbox.getText("leftpanel_selected_layers_title"),
            leftpanel_style : sandbox.getText('leftpanel_style'),
            mapservice_select_layer_style : sandbox.getText('mapservice_select_layer_style'),
            mapservice_basemap_image_tooltip : sandbox.getText('mapservice_basemap_image_tooltip'),
            mapservice_layer_delete_title : sandbox.getText('mapservice_layer_delete_title'),
            mapservice_maplayer_image_tooltip : sandbox.getText('mapservice_maplayer_image_tooltip'),
            mapservice_layer_show_info_title : sandbox.getText('mapservice_layer_show_info_title'),

            selected_layers_module_published_basemaps_title : sandbox.getText("selected_layers_module_published_basemaps_title"),
            selected_layers_module_published_maps_title : sandbox.getText("selected_layers_module_published_maps_title"),
            selected_layers_module_wfs_icon_tooltip : sandbox.getText('selected_layers_module_wfs_icon_tooltip'),
            selected_layers_module_vector_icon_tooltip : sandbox.getText('selected_layers_module_vector_icon_tooltip'),

            selected_layers_module_highlight_wms_layer : sandbox.getText("selected_layers_module_highlight_wms_layer"),
            selected_layers_module_highlight_wfs_layer : sandbox.getText("selected_layers_module_highlight_wfs_layer"),
            selected_layers_module_highlight_wfs_layer : sandbox.getText("selected_layers_module_highlight_wfs_layer")

        };
    },
    /*
     * adds any layers selected to current list of layers
     */
    updateCurrentState : function() {
        var sandbox = this._sandbox;
        var me = this;
        var layers = sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            sandbox.printDebug("preselecting " + layerId);
            me.addMapLayerToSelection(layerId, layer, true);
        }
    },
    /**
     * create the selected layers UI
     */
    createUI : function() {
        var sandbox = this._sandbox;
        var me = this;

        //Ext.QuickTips.init();
        var selectedLayersModuleTitle = me.loc.leftpanel_selected_layers_title;
        if(this.isPublisherWizardStep(1)) {
            selectedLayersModuleTitle = me.loc.selected_layers_module_published_basemaps_title;
        } else if(this.isPublisherWizardStep(2)) {
            selectedLayersModuleTitle = me.loc.selected_layers_module_published_maps_title;
        }

        var selectedLayersTab = Ext.create('Ext.app.PortalColumn', {

            id : 'selectedLayersTab',
            autoWidth : true,
            //layout: 'fit',
            autoScroll : false
        });

        this._items.selectedLayersTab = selectedLayersTab;

        var layerPortal = Ext.create('Ext.app.PortalPanel', {
            id : 'groupPanel',
            title : selectedLayersModuleTitle,
            autoScroll : true,
            items : [selectedLayersTab]
        });
        this._layerPortal = layerPortal;

        layerPortal.on("drop", function(dropEvent) {
            var layerId = dropEvent.panel["_layerId"];
            me.updateLayerOrder(layerId);

        });

        layerPortal.on("beforedrop", function() {
            me.buildLayerOrder();
        });

        layerPortal.on("validatedrop", function(overEvent) {

            overEvent.status = overEvent.panel["_layerId"] ? true : false;
        });
        var selectedLayerPanel = Ext.create('Ext.tab.Panel', {
            id : 'selectedLayersTabPanel',
            layout : 'fit',
            anchor : '100%, 50%',
            frame : false,
            border : false,
            autoScroll : false,
            items : [layerPortal]
        });
        this._items.selectedLayerPanel = selectedLayerPanel;

        return selectedLayerPanel;
    },
    /**
     * callback that will be
     * called when layer is about to be dropped
     */
    buildLayerOrder : function() {
        var prePos = {};
        var me = this;
        var layerPortal = me._layerPortal;

        var panelsArray = Ext.ComponentQuery.query('portlet', layerPortal);

        Ext.Array.each(panelsArray, function(obj, index, arr) {
            var layerId = obj["_layerId"];

            prePos[layerId] = index;

        });
        this._layerOrder = prePos;

    },
    /**
     * callback that will be
     * called after layer has been dropped to rearrange
     * layer order
     *
     */
    updateLayerOrder : function(layerId) {

        var me = this;
        var layerPortal = this._layerPortal;
        var prePos = this._layerOrder;

        var panelsArray = Ext.ComponentQuery.query('portlet', layerPortal);
        var toPos = {};
        Ext.Array.each(panelsArray, function(obj, index, arr) {
            var preLayerId = obj["_layerId"];
            toPos[preLayerId] = index;
        });
        for(p in toPos) {
            var currLayerId = p;
            if(layerId != currLayerId) {
                continue;
            }

            var nextPos = toPos[currLayerId];
            var prevPos = prePos[currLayerId];
            if(prevPos == nextPos) {
                continue;
            }

            /*
             * translate to core 0 based index
             */
            var nextCorePos = panelsArray.length - nextPos - 1;

            var request = me._sandbox.getRequestBuilder('RearrangeSelectedMapLayerRequest')(layerId, nextCorePos);
            me._sandbox.request(me.getName(), request);
            break;
        }

    },
    /**
     * creates a new inner panel for layer
     */
    getNewSelectedLayersInsidePanel : function(slider, label, styleCombo, id, button) {

        var me = this;
        var chkPanel = null;
        var controls = new Array();
        var firstRowControls = Ext.create('Ext.Panel', {
            id : 'leftpanel-selected-layers-controls_basic_' + id,
            layout : {
                type : 'hbox',
                align : 'stretch',
                pack : 'start'
            },
            baseCls : '',
            border : true,

            defaults : {
                padding : '5 5 0 5',
                baseCls : '',
                border : true
            },
            items : [{
                items : slider
            }, {
                items : label,
                flex : 1 // strecth this column to fill the layer
            }, {
                items : button
            }]
        });
        controls.push(firstRowControls);

        if(styleCombo != null) {
            var styleRowControls = Ext.create('Ext.Panel', {
                id : 'leftpanel-selected-layers-controls_style_' + id,
                layout : {
                    type : 'hbox',
                    align : 'stretch',
                    pack : 'start'
                },
                baseCls : '',
                border : true,
                width : '100%',

                defaults : {
                    padding : '0 5 0 5',
                    baseCls : '',
                    border : true
                },
                items : [{
                    html : me.loc.leftpanel_style
                }, {
                    items : styleCombo,
                    flex : 1
                }]
            });

            controls.push(styleRowControls);
        }
        chkPanel = Ext.create('Ext.Panel', {
            id : 'leftpanel-selected-layers-controls_' + id,
            layout : {
                type : 'vbox',
                align : 'stretch',
                pack : 'start'
            },
            cls : 'leftpanel-selected-layers-controls', // gray background
            border : false,
            height : 32 * controls.length,
            defaults : {
                padding : '0 5 0 5',
                flex : 1
            },
            items : controls
        });

        return chkPanel;
    },
    /**
     * creates inner panel component
     */
    getOpacityLabel : function(text, id) {
        var label = Ext.create('Ext.form.Label', {
            text : text + '%' /*,
             id : 'selectedLayer-opacity-label-' + id */
        });
        return label;
    },
    /**
     * creates inner panel component
     */
    getOpacitySlider : function(value, id, isBasemap, label) {
        var isPublisherWizardStep = false;
        if(this.isPublisherWizardStep(1) || this.isPublisherWizardStep(2)) {
            isPublisherWizardStep = true;
        }

        var me = this;
        var listenerImplementation = null;
        if(isPublisherWizardStep == false) {
            listenerImplementation = {
                change : function(c, item) {
                    var sandbox = me._sandbox;

                    sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest')(id, this.getValue()));
                    label.setText(this.getValue() + '%');
                }
            };
        } else {
            listenerImplementation = {
                change : function(c, item) {
                    label.setText(this.getValue() + '%');
                },
                changecomplete : function(c, item) {
                    var sandbox = me._sandbox;

                    sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest')(id, this.getValue()));
                }
            };
        }

        return Ext.create('Ext.slider.Single', {
            width : 100,
            minValue : 0,
            maxValue : 100,
            animate : true,
            value : value,
            //cls : 'selected-layer-slider',
            listeners : listenerImplementation
        });
    },
    /**
     * creates a portlet panel for layer
     */
    getNewSelectedLayersPanel : function(layer, controlsPanel) {
        var name = layer.getName();
        var id = layer.getId();
        var baselayer = layer.isBaseLayer()
        var newLayer = null;

        var me = this;
        var layerTools = [];
        var iconCls = null;

        if(baselayer) {
            iconCls = 'layer_type_stack';

        } else if(layer.isGroupLayer && layer.isGroupLayer()) {
                iconCls = 'layer_type_group';
                
        } else{
        	// only WMS has this method/content atm
            if(layer.hasLegendImage && layer.hasLegendImage()) {
                layerTools.push({
                    baseCls : 'custom-tool',
                    type : 'gear',
                    tooltip : me.loc.mapservice_layer_show_info_title,
                    handler : function() {
                        // TODO: put the whole layer into request, skip the
                        // handler in core
                        // and process the request in metadata module
                        me._sandbox.requestByName("SelectedLayersModule", "ShowMapLayerInfoRequest", [id]);
                    }
                });
            }



             if(layer.isLayerOfType('WMS')) {
                iconCls = 'layer_type_wms';
            } else if(layer.isLayerOfType('WFS')) {
                iconCls = 'layer_type_wfs';
            } else if(layer.isLayerOfType('VECTOR')) {
                iconCls = 'layer_type_vector';
            } else  {
                iconCls = 'layer_type_wms';
                //throw "Unknown layer type";
            }

        }

        if(layer.getDataUrl()) {
            layerTools.push({
                type : 'search',
                baseCls : 'custom-tool',
                qtip : me.loc.mapservice_layer_show_info_title,
                handler : function() {
                    me._sandbox.requestByName("SelectedLayersModule", "ShowOverlayPopupRequest", [layer.getDataUrl()]);
                }
            });
        }

        layerTools.push({
            type : 'close',
            baseCls : 'custom-tool',
            tooltip : me.loc.mapservice_layer_delete_title,
            handler : function() {
                me._sandbox.requestByName("SelectedLayersModule", "RemoveMapLayerRequest", [id]);
            }
        });
        newLayer = Ext.create('Ext.app.Portlet', {
            "_layerId" : id,
            collapsible : false,
            id : "selectedLayer-" + id,
            iconCls : iconCls,
            scroll : false,
            tools : layerTools,
            title : me._layerNameRenderer(name),
            layout : 'fit',
            items : controlsPanel,
            frame : false,
            border : false,
            closable : false
        });

        return newLayer;
    },
    /**
     * @method _layerNameRenderer
     * Shortens the layer name if too long and gives it a tooltip
     * TODO: Doesnt recalculate after panel resize, problem?
     */
    _layerNameRenderer : function(value) {
    	var me = this;
        if(!me._items.selectedLayerPanel.getVisibilityEl()) {
            // printing or otherwise not shown so doesn't really matter what
            // we return here
            return value;
        }
        var textWidth = this._stringWidth(value);
        var visibleTitle = value;
        var edited = false;
        var toolsWidth = 110;
        var maxLength = me._items.selectedLayerPanel.getWidth() - toolsWidth;
        while(textWidth > 110 && textWidth > maxLength) {
            edited = true;
            visibleTitle = visibleTitle.substring(0, visibleTitle.length - 3);
            textWidth = this._stringWidth(visibleTitle);
        }
        if(edited) {
            visibleTitle = visibleTitle + '...';
        }
        return '<span data-qtip="' + value + '" style="width: 40px;overflow: hidden;">' + visibleTitle + '</span>';
    },
    
    /** 
     * @method _stringWidth
     * @param msg 
     * 		The message to calculate width to
     * Calculates given strings width in pixels using 12px arial font
     */
    _stringWidth : function(msg) {
        var f = '12px arial', o = jQuery('<div>' + msg + '</div>').css({
            'position' : 'absolute',
            'float' : 'left',
            'visibility' : 'hidden',
            'font' : f
        }).appendTo(jQuery('body')), w = o.width();

        o.remove();

        return w;
    },
    /**
     * creates inner panel component
     */
    getStyleCombo : function(store, stylename, id) {
        var sandbox = this._sandbox;
        var me = this;
        var styleCombo = Ext.create('Ext.form.ComboBox', {
            id : 'layer-style_' + id,
            ctCls : 'mapservice-combostyle',
            store : store,
            mode : 'local',
            triggerAction : 'all',
            emptyText : me.loc.mapservice_select_layer_style,
            hideLabel : true,
            autoSelect : true,
            editable : false,
            width : '100%',
            listeners : {
                select : function(el, value) {
                    var indexi = value[0].index;
                    var styleName = stylename[indexi];
                    var layerInd = id;

                    sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('ChangeMapLayerStyleRequest')(layerInd, styleName));
                }
            }
        });

        return styleCombo;
    },
    /*
     * handler for map layer add
     */
    afterMapLayerAddEvent : function(event) {
        var layer = event.getMapLayer();
        var layerId = layer.getId();
        var keepLayerOnTop = event.getKeepLayersOrder();
        this.addMapLayerToSelection(layerId, layer, keepLayerOnTop);
        this.checkLayerScales();
    },
    /**
     * primitive for map layer add
     */
    addMapLayerToSelection : function(layerId, layer, keepLayerOnTop) {

        var me = this;

        var layerItems = {};
        this._items.layerItems[layerId] = layerItems;

        var slider = null;
        var label = null;
        var buttonGetFeatures = null;

        if(layer.isBaseLayer()) {
            label = this.getOpacityLabel(layer.getOpacity(), layerId);
            slider = this.getOpacitySlider(layer.getOpacity(), layerId, true, label);
        } else {
            label = this.getOpacityLabel(layer.getOpacity(), layerId);
            slider = this.getOpacitySlider(layer.getOpacity(), layerId, false, label);
        }

        layerItems.slider = slider;
        layerItems.label = label;

        var isPublisherWizardStep = false;
        if(this.isPublisherWizardStep(1) || this.isPublisherWizardStep(2)) {
            isPublisherWizardStep = true;
        }

        var styleCombo = null;
/*
        if(layer.isLayerOfType('WFS') || layer.isLayerOfType('VECTOR') || layer.isBaseLayer() || isPublisherWizardStep) {
            
            //Currently baselayers and Wfs Layers do not support styles
            
        } else*/ 
       // only relevant layer classes have the getStyles method so this should be a good enough check
        if(!layer.isBaseLayer() && layer.getStyles && !isPublisherWizardStep) {
            var styleStore = layer.getStyles();
            var layerStylesTitle = new Array();
            var layerStylesName = new Array();
            for(var i = 0; i < layer.getStyles().length; i++) {
                layerStylesTitle.push(layer.getStyles()[i].getTitle());
                layerStylesName.push(layer.getStyles()[i].getName());
            }
            if(layerStylesName.length > 1 && layerStylesTitle.length > 1) {
                // only create combo if it will be shown
                styleCombo = this.getStyleCombo(layerStylesTitle, layerStylesName, layer.getId());
                if(layer.getCurrentStyle() != null && layer.getCurrentStyle() != "" && layer.getCurrentStyle().getName() != "") {
                    var indexi = layerStylesName.indexOf(layer.getCurrentStyle().getName());
                    var styleName = layerStylesTitle[indexi];
                    styleCombo.setValue(styleName);
                } else {
                    /*
                     * Layer have many styles, default style is
                     * not defined, selected first style in use
                     */
                    var indexi = 0;
                    var styleName = layerStylesTitle[indexi];
                    styleCombo.setValue(styleName);
                }
            }
        }

        layerItems.styleCombo = styleCombo;
        /*
         * Now that panel is ready, we must find icon for
         * selecting layer and attach an onClick event to it
         */
        var blnGfi = false;
        if(layer.isFeatureInfoEnabled) {
        	blnGfi = layer.isFeatureInfoEnabled();
        }
        
        if(blnGfi && !this.isPublisherWizardStep(1)) {
            buttonGetFeatures = this.createHighlighButtonAndAttachHighlightHandlerForLayer(layer);
        }
        layerItems.buttonGetFeatures = buttonGetFeatures;

        var chkPanel = this.getNewSelectedLayersInsidePanel(slider, label, styleCombo, layer.getId(), buttonGetFeatures);

        layerItems.chkPanel = chkPanel;

        var newLayerPanel = this.getNewSelectedLayersPanel(layer, chkPanel);

        layerItems.panel = newLayerPanel;
        var tab = me._items.selectedLayersTab;
        if(tab) {
            if(layer.isBaseLayer()) {
                var location = tab.items.length + 1;
                if(keepLayerOnTop) {

                    tab.insert(0, newLayerPanel);
                } else {

                    tab.insert(location, newLayerPanel);
                }
            } else {
                tab.insert(0, newLayerPanel);
            }

            //tab.doLayout();
            this._layerPortal.doLayout();

        }

        //var scale = me._sandbox.getMap().getScale();
    },
    /*
     *
     */
    createHighlighButtonAndAttachHighlightHandlerForLayer : function(mapLayer) {
        var me = this;
        var sandbox = me._sandbox;
        var mapLayerId = mapLayer.getId();

        var unselectClass = null;
        var highlightLayerText = null;
        if(mapLayer.isLayerOfType('WMS')) {
            unselectClass = "wms-maplayer";
            highlightLayerText = me.loc.selected_layers_module_highlight_wms_layer;
        } else if(mapLayer.isLayerOfType('WFS')) {
            unselectClass = "wfs-maplayer";
            highlightLayerText = me.loc.selected_layers_module_highlight_wfs_layer;
        } else if(mapLayer.isLayerOfType('VECTOR')) {
            unselectClass = "wfs-maplayer";
            highlightLayerText = me.loc.selected_layers_module_highlight_wfs_layer;
        } else {
            unselectClass = "wms-maplayer";
            highlightLayerText = '';
            //throw "Unknown layer type";
        }
        return Ext.create('Ext.Button', {
            iconCls : unselectClass,
            cls : 'x-btn-icon',
            width : 35,
            height : 20,
            scale : 'large',
            enableToggle : true,
            toggleGroup : 'layerHighlightButtonGroup',
            tooltip : highlightLayerText,
            handler : function() {
                var selected = sandbox.isMapLayerHighLighted(mapLayerId);
                if(selected) {
                    sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('DimMapLayerRequest')(mapLayerId));
                } else {
                    sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('HighlightMapLayerRequest')(mapLayerId));
                }
            }
        });
    },
    /*
     * eventhandler for maplayer removal
     */
    afterMapLayerRemoveEvent : function(event) {
        var layerId = event.getMapLayer().getId();
        this.removeMapLayerFromSelection(layerId);
    },
    /**
     * primitive for maplayer removal
     */
    removeMapLayerFromSelection : function(layerId) {
        var layerItems = this._items.layerItems[layerId];

        var layerPanel = layerItems.panel;
        layerItems.panel = null;
        layerItems.slider = null;
        layerItems.label = null;
        layerItems.buttonGetFeatures = null;

        layerPanel.destroy();

        this._items.layerItems[layerId] = null;

        this._layerPortal.doLayout();
    },
    /**
     * refreshes visibility information for layers
     */
    checkLayerScales : function() {
        var scale = this._scale = this._sandbox.getMap().getScale();
        var sandbox = this._sandbox;
        var allLayerItems = this._items.layerItems;
        var layers = sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(layer.isBaseLayer()) {
                continue;
            }

            if(scale > layer.getMaxScale() && scale < layer.getMinScale()) {

                var layerItems = allLayerItems[layerId];
                var layerPanel = layerItems.panel;

                if(layerPanel != null) {
                    layerPanel.removeCls('layertree-scale-not-in-range');
                }

            } else {
                var layerItems = allLayerItems[layerId];
                var layerPanel = layerItems.panel;

                if(layerPanel != null) {
                    layerPanel.addCls('layertree-scale-not-in-range');
                }

            }
        }

    },
    /**
     * handler for opacity change event
     */
    afterChangeMapLayerOpacityEvent : function(event) {
        var mapLayer = event.getMapLayer();
        var allLayerItems = this._items.layerItems;
        var layerItems = allLayerItems[mapLayer.getId()];
        var slider = layerItems.slider;
        slider.setValue(mapLayer.getOpacity());
    },
    /**
     * handler for layer style change event
     */
    afterChangeMapLayerStyleEvent : function(event) {
        var mapLayer = event.getMapLayer();
        var allLayerItems = this._items.layerItems;
        var layerItems = allLayerItems[mapLayer.getId()];

        var styleCombo = layerItems.styleCombo;
        var styleName = event.getMapLayer().getCurrentStyle();
        if(styleCombo && styleName) {
            styleCombo.setValue(styleName);
        }
    },
    /**
     * handler for layer highlight begin
     */
    handleAfterHighlightMapLayerEvent : function(event) {
        var mapLayer = event.getMapLayer();
        var sandbox = this._sandbox;
        var allLayerItems = this._items.layerItems;
        var layerItems = allLayerItems[mapLayer.getId()];
        var layerPanel = layerItems.panel;
        layerPanel.addCls('higlighted');

        layerItems.chkPanel.addCls('higlighted-panel-content');
        // makes the layer bg go orange
    },
    /**
     * handler for layer highlight end
     */
    handleAfterDimMapLayerEvent : function(event) {
        var mapLayer = event.getMapLayer();
        var sandbox = this._sandbox;
        var allLayerItems = this._items.layerItems;
        var layerItems = allLayerItems[mapLayer.getId()];
        var layerPanel = layerItems.panel;
        layerPanel.removeCls('higlighted');

        layerItems.chkPanel.removeCls('higlighted-panel-content');
        if(layerItems.buttonGetFeatures) {
            layerItems.buttonGetFeatures.toggle(false);
        }
    },
    /**
     * @method handleMapLayerChange
     * @param event
     *           event that triggered this
     * let's refresh ui to match current layers
     */
    handleMapLayerChange : function(event) {
        var me = this;
        // only do something on update
        if(event.getOperation() === 'update') {
        	var layerId = event.getLayerId();
	        
	        var allLayerItems = this._items.layerItems;
	        var layerItems = allLayerItems[layerId];
	        if(!layerItems) {
	        	// layer not selected -> ignore
	        	return;
	        }
        	var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        	var layer = mapLayerService.findMapLayer(layerId);
	        var name = layer.getName();
	        layerItems.panel.setTitle(this._layerNameRenderer(name));
        }
    },
    /**
     * map to simplify event handling and registration
     */
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterMapMoveEvent' : function(event) {
            this.checkLayerScales();
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            if(this._sandbox.getObjectCreator(event) != this.getName()) {
                /* someone changed opacity */
                this.afterChangeMapLayerOpacityEvent(event);
            }
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            if(this._sandbox.getObjectCreator(event) != this.getName()) {
                /* someone changed style */
                this.afterChangeMapLayerStyleEvent(event);
            }
        },
        'AfterHighlightMapLayerEvent' : function(event) {
            this.handleAfterHighlightMapLayerEvent(event);
        },
        'AfterDimMapLayerEvent' : function(event) {
            this.handleAfterDimMapLayerEvent(event);
        },
        'ToolSelectedEvent' : function(event) {
            var sandbox = this._sandbox;
            var highLightedLayers = this._sandbox.findAllHighlightedLayers();
            if(highLightedLayers && highLightedLayers.length > 0) {
                // can be only one at a time so just pick the first one
                sandbox.request("SelectedLayersModule", sandbox.getRequestBuilder('DimMapLayerRequest')(highLightedLayers[0].getId()));
            }
        },
        'MapLayerEvent' : function(event) {
            this.handleMapLayerChange(event);
        }
    },

    /**
     * dispatcher for any received events
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler)
            return;

        return handler.apply(this, [event]);

    }
}, {
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */