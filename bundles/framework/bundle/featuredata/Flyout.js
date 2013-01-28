/**
 * @class Oskari.mapframework.bundle.featuredata.Flyout
 *
 * Renders the "featuredata" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.featuredata.FeatureDataGridBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this.layers = {};

    this.tabsContainer = null;
    this.service = null;
    this.modelMngr = null;
    this.selectedTab = null;
    this.active = false;
    this.mapDivId = "#mapdiv";
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.featuredata.Flyout';
    },
    /**
     * @method setEl
     * @param {Object} el
     * 		reference to the container in browser
     * @param {Number} width
     * 		container size(?) - not used
     * @param {Number} height
     * 		container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if(!jQuery(this.container).hasClass('featuredata')) {
            jQuery(this.container).addClass('featuredata');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.tabsContainer = 
            Oskari.clazz.create('Oskari.userinterface.component.TabContainer',
            this.instance.getLocalization('nodata'));
        this.service = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.service.GridJsonService', 
            this.instance.sandbox.getAjaxUrl());
        this.modelMngr = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.service.GridModelManager');
        var mapmodule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
        var newMapDivId = mapmodule.getMap().div;
        if (newMapDivId) this.mapDivId = newMapDivId;
    },
    /**
     * @method stopPlugin
     *
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {

    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('title');
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the
     * flyout
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
    },
    /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
    getOptions : function() {

    },
    /**
     * @method setState
     * @param {Object} state
     * 		state that this component should use
     * Interface method implementation, does nothing atm
     */
    setState : function(state) {
        this.state = state;
        console.log("Flyout.setState", this, state);
    },
    /**
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi : function() {
        var me = this;
        var flyout = jQuery(this.container);
        flyout.empty();
        
        var sandbox = this.instance.sandbox;
        var dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest');
        var hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
        // if previous panel is undefined -> just added first tab
        // if selectedPanel is undefined -> just removed last tab
        this.tabsContainer.addTabChangeListener(function(previousPanel, selectedPanel) {
            // cancel grid update on panel change
            if(previousPanel) {
                me.service.cancelWFSGridUpdateForLayer(previousPanel.layer.getId());
                // sendout dim request for unselected tab
                var request = dimReqBuilder(previousPanel.layer.getId());
                sandbox.request(me.instance.getName(), request);
            }
            me.selectedTab = selectedPanel;
            if(selectedPanel) {
                me._updateData(selectedPanel.layer);
                // sendout highlight request for selected tab
                if(me.active) {
                    var request = hlReqBuilder(selectedPanel.layer.getId());
                    sandbox.request(me.instance.getName(), request);
                }
            }
        });
        this.tabsContainer.insertTo(flyout);
    },
    
    /**
     * @method layerAdded
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was added
     * Adds a tab for the layer
     */ 
    layerAdded: function(layer) {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        panel.setTitle(layer.getName());
        panel.getContainer().append(this.instance.getLocalization('loading'));
        panel.layer = layer;
        this.layers['' + layer.getId()] = panel;
        this.tabsContainer.addPanel(panel);
    },
    
    /**
     * @method layerRemoved
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was removed
     * Removes the tab for the layer
     */ 
    layerRemoved: function(layer) {
        var layerId = '' + layer.getId();
        this.service.cancelWFSGridUpdateForLayer(layerId);
        var panel = this.layers[layerId];
        this.tabsContainer.removePanel(panel);
        // clean up
        panel.grid = null;
        delete panel.grid;
        panel.layer = null;
        delete panel.layer;
        this.layers[layerId] = null;
        delete this.layers[layerId];
    },
    /**
     * @method updateData
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was added
     * Updates data for layer
     */ 
    _updateData: function(layer) {
        if(!this.active) {
            // disabled
            return;
        }
        // cancel possible previous update
        this.service.cancelWFSGridUpdateForLayer(layer.getId());
        var map = this.instance.sandbox.getMap();
        var panel = this.layers['' + layer.getId()];
        var selection = null;
        if(panel.grid) {
            selection = panel.grid.getSelection();
        }
        panel.getContainer().empty();
        if(!layer.isInScale(map.getScale())) {
            panel.getContainer().append(this.instance.getLocalization('errorscale'));
            return;
        }
        panel.getContainer().append(this.instance.getLocalization('loading'));
        // in scale, proceed
        var me = this;
        var bbox = map.getBbox();
        var mapWidth = map.getWidth();
        var mapHeight = map.getHeight();
        var cb = function(response) {
            me._prepareData(layer, response);
            if(selection) {
                for(var i = 0; i < selection.length; ++i) {
                    //me._handleGridSelect(selection[i].featureId, true);
                    // ^ highlight on map, not fully working
                    panel.grid.select(selection[i].featureId, true);
                }
            }
        }
        this.service.scheduleWFSGridUpdate(layer, bbox, mapWidth, mapHeight, cb);
    },
    handleMapMoved : function() {
        if(!this.selectedTab) {
            return;
        }
        this._updateData(this.selectedTab.layer);
    },
    /**
     * @method _prepareData
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was added
     * @param {Object} data
     *           WFS data JSON
     * Updates data for layer
     */ 
    _prepareData: function(layer, data) {
        var me = this;
        var panel = this.layers['' + layer.getId()];
        var isOk = this.tabsContainer.isSelected(panel);
        if(isOk) {
            var models = this.modelMngr.getData(data);
            panel.getContainer().empty();
            if(!models) {
                // invalid data
                panel.getContainer().append(this.instance.getLocalization('errordata'));
                return; 
            }
            // only rendering "all" compilation for now
            var model = models['all'];
            model.setIdField('featureId');
            var fields = model.getFields();
            if(!panel.grid) {
                var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
                // if multiple featuredatas, we will have a "__featureName" field in "all" model -> rename it for ui
                grid.setColumnUIName('__featureName', this.instance.getLocalization('featureNameAll'));
                // set selection handler
                grid.addSelectionListener(function(pGrid, dataId) {
                    me._handleGridSelect(layer, dataId);
                });

                // set popup handler for inner data
                var showMore = this.instance.getLocalization('showmore');
                grid.setAdditionalDataHandler(showMore,
                    function(link, content) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        var okBtn = dialog.createCloseButton("OK");
                        okBtn.addClass('primary');
                        dialog.show(showMore, content, [okBtn]);
                        dialog.moveTo(link, 'bottom');
                });

                var visibleFields = [];
                // filter out certain fields
                for(var i = 0; i < fields.length; ++i) {
                    if(fields[i] != 'featureId' &&
                       fields[i] != 'qName') {
                           visibleFields.push(fields[i]);
                    }
                }
                grid.setVisibleFields(visibleFields);
                panel.grid = grid;
            }
            panel.grid.setDataModel(model);
            try {
                panel.grid.renderTo(panel.getContainer());
                // define flyout size to adjust correctly to arbitrary tables
                var mapdiv = jQuery(me.mapDivId);
                var flyout = jQuery('div.oskari-flyoutcontent.featuredata').parent().parent();
                flyout.find('div.tab-content').css('max-height',(mapdiv.height()/4).toString()+'px');
                flyout.css('max-width',mapdiv.width().toString()+'px');
            }
            catch(error) {
                alert(error);
            }
        }
        else {
            // Wrong tab selected -> ignore (shouldn't happen)
        }
    },
    /**
     * @method _handleGridSelect
     * @private
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was added
     * @param {String} dataId
     *           id for the data that was selected
     * @param {Boolean} keepCollection
     *           true to keep previous selection, false to clear before selecting
     * Notifies components that a selection was made
     */
    _handleGridSelect : function(layer, dataId, keepCollection) {
        var sandbox = this.instance.sandbox;
        var featureIds = [dataId];
        var builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
        if(keepCollection === undefined) {
            keepCollection = sandbox.isCtrlKeyDown();
        }
        var event = builder(featureIds, layer, keepCollection);
        sandbox.notifyAll(event);
    },
    /**
     * @method featureSelected
     * @param {Oskari.mapframework.bundle.mapwfs.event.WFSFeaturesSelectedEvent} event
     * Handles changes on the UI when a feature has been selected (highlights grid row) 
     */
    featureSelected : function(event) {
        
        if(!this.active) {
            return;
        }
        var layer = event.getMapLayer();
        var panel = this.layers['' + layer.getId()];
        var featureId = event.getWfsFeatureIds()[0];
        
        panel.grid.select(featureId, event.isKeepSelection());
    },
    /**
     * @method setEnabled
     * @param {Boolean} isEnabled
     * True to enable grid functionality
     * False to disable and stop reacting to any map movements etc 
     */
    setEnabled : function(isEnabled) {
        if(this.active == isEnabled) {
            // we need to check this since dragging flyout will call this all the time
            return;
        }
        this.active = (isEnabled == true);
        var sandbox = this.instance.sandbox;
        // disabled
        if(!this.active) {
            if(this.selectedTab) {
                // cancel possible previous update
                this.service.cancelWFSGridUpdateForLayer(this.selectedTab.layer.getId());
                // dim possible highlighted layer
                var dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest');
                var request = dimReqBuilder(this.selectedTab.layer.getId());
                sandbox.request(this.instance.getName(), request);
            }
            // clear panels
            for(var panel in this.layers) {
                if(panel.getContainer) {
                    panel.getContainer().empty();
                }
            }
        }
        // enabled
        else {
            if(this.selectedTab) {
                // highlight layer if any
                var hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
                var request = hlReqBuilder(this.selectedTab.layer.getId());
                sandbox.request(this.instance.getName(), request);
                
                // update data
                this._updateData(this.selectedTab.layer);
            }
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
