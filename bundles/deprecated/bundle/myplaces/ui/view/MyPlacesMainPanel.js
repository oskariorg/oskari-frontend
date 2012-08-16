Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesMainPanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};
        config.category = null;

        // set the panel title
        config.title = this.oskariConfig.localizationSet.title;

        config.module = this.oskariConfig.module;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    
    /**
     * @method startNewDrawing
     * Resets currently selected place and sends a draw request to plugin with given config
     * @param config params for StartDrawRequest
     */
    startNewDrawing : function(config) {
        // notify components to reset any saved "selected place" data
        var event = this.oskariConfig.sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this.oskariConfig.sandbox.notifyAll(event);

        // notify plugin to start drawing new geometry
        this.sendDrawRequest(config);
    },
    /**
     * @method startNewDrawing
     * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
     * @param config params for StartDrawRequest
     */
    sendDrawRequest : function(config) {
        var me = this;
        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.StartDrawingRequest')(config);

        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);

        // show only relevant tools
        this.module.setDisableMapEvents(true);
        me.uiItems.basicControls.hide();
        if(!config.geometry) {
        	// show only when not editing?
	        me.uiItems.drawControls.setDrawMode(config.drawMode, false);
	        me.uiItems.drawControls.show();
        }

        // add my places maplayer to selected layers
        me.oskariConfig.module.addLayerToMap();
        /* 
        // set map control to selection tool (so we dont zoom while drawing etc)
        var req = me.oskariConfig.sandbox.getRequestBuilder('ToolSelectionRequest')('map_control_navigate_tool');
        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), req);
        */
    },
    /**
     * @method sendStopDrawRequest
     * Sends a StopDrawingRequest. 
     * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
     * @param propagateEvent boolean param for StopDrawingRequest
     */
    sendStopDrawRequest : function(propagateEvent) {
        var me = this;
        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.StopDrawingRequest')(propagateEvent);

        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);

		// true if pressed finish drawing button
        if(propagateEvent !== true) {
            this.module.setDisableMapEvents(false);

            // show only relevant tools
            me.uiItems.basicControls.show();
            me.uiItems.drawControls.hide();
        }
    },
    /**
     * @method placeSelected
     * Changes the panel controls to match the application state (new/edit)
     * @param myPlace selected place or null if nothing selected
     */
    placeSelected : function(myPlace) {
        var me = this;
        me.uiItems.drawControls.hide();
        if(myPlace) {
            me.uiItems.basicControls.hide();
            me.uiItems.placeSelectedControls.show();
            me.uiItems.placeSelectedControls.placeSelected(myPlace);
        } else {
            me.uiItems.placeSelectedControls.hide();
            me.uiItems.basicControls.show();
        }
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var basicControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesBasicControls', {
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            }
        });
        config.uiItems.basicControls = basicControls;

        var drawControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesDrawControls', {
            oskariConfig : {
                module : me.oskariConfig.module,
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            },
            hidden : true
        });
        config.uiItems.drawControls = drawControls;

        var placeSelectedControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesPlaceSelectedControls', {
            oskariConfig : {
                module : me.oskariConfig.module,
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            },
            hidden : true
        });
        config.uiItems.placeSelectedControls = placeSelectedControls;

        var mainPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            autoScroll : true,
            layout : 'anchor',
            bodyPadding : 10,
            items : [basicControls, drawControls, placeSelectedControls]
        });

        config.uiItems.mainPanel = mainPanel;
        config.items = [mainPanel];
    }
});
