/**
 * @class Oskari.mapframework.bundle.featuredata2.Flyout
 *
 * Renders the "featuredata2" flyout.
 */

Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataGridBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this.layers = {};

    this.tabsContainer = null;
    this.selectedTab = null;
    this.active = false;
    this.mapDivId = "#mapdiv";
    this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
    // Resizability of the flyout
    this.resizable = true;
    // Is layout currently resizing?
    this.resizing = false;
    // The size of the layout has been changed (needed when changing tabs)
    this.resized = false;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.featuredata2.Flyout';
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
    },
    /**
     * @method setResizable
     * @param {Boolean} resizable
     * 		state of the flyout resizability
     * Defines if the flyout is resizable
     */
    setResizable : function(resizable) {
        this.resizable = resizable;
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
            // sendout dim request for unselected tab
            if(previousPanel) {
                var request = dimReqBuilder(previousPanel.layer.getId());
                sandbox.request(me.instance.getName(), request);
            }
            me.selectedTab = selectedPanel;
            if(selectedPanel) {
                me.updateData(selectedPanel.layer);
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
    updateData: function(layer) {
        if(!this.active) {
            return;
        }

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
        this._prepareData(layer);

        if(selection && selection.length > 0 && typeof selection[0].featureId != "undefined") {
            for(var i = 0; i < selection.length; ++i) {
                panel.grid.select(selection[i].featureId, true);
            }
        }

        // mapClick
        if(panel.grid && layer.getClickedFeatureIds().length > 0) {
            for(var j = 0; j < layer.getClickedFeatureIds().length; ++j) {
                panel.grid.select(layer.getClickedFeatureIds()[j], true);
            }
        }

        // filter
        if(panel.grid && layer.getSelectedFeatures().length > 0) {
            for(var k = 0; k < layer.getSelectedFeatures().length; ++k) {
                panel.grid.select(layer.getSelectedFeatures()[k][0], true);
            }
        }
    },

    /**
     * @method updateGrid
     * @param {Object} user's selection on map
     * Updates grid for drawn places
     */
    updateGrid : function() {
        if(!this.selectedTab) {
            return;
        }
        this.updateData(this.selectedTab.layer);
    },

    /**
     * @method _enableResize
     * Enables the flyout resizing
     */
    _enableResize: function() {
        var me = this;

        var content = jQuery('div.oskari-flyoutcontent.featuredata');
        var flyout = content.parent().parent();
        var container = content.parent();
        var tabsContent = content.find('div.tabsContent');
        var mouseOffsetX = 0;
        var mouseOffsetY = 0;

        // Resizer image for lower right corner
        flyout.find('div.tab-content').css({'padding-top':'1px','padding-right':'1px'});
        var resizer = jQuery('<div/>');
        resizer.addClass('flyout-resizer');
        var resizerHeight = 16;
        resizer.removeClass('allowHover');
        resizer.addClass('icon-drag');
        resizer.bind('dragstart', function(event) { event.preventDefault(); });

        // Start resizing
        resizer.mousedown(function(e) {
            if (me.resizing) return;
            me.resizing = true;
            mouseOffsetX = e.pageX-flyout[0].offsetWidth-flyout[0].offsetLeft;
            mouseOffsetY = e.pageY-flyout[0].offsetHeight-flyout[0].offsetTop;
            // Disable mouse selecting
            jQuery(document).attr('unselectable', 'on')
                    .css('user-select', 'none')
                    .on('selectstart', false);
        });

        // End resizing
        jQuery(document).mouseup(function(e){
            me.resizing = false;
            me.resized = true;
        });

        // Resize the featuredata2 flyout
        jQuery(document).mousemove(function(e){
            if (!me.resizing) return;

            var flyOutMinHeight = 100;
            var bottomPadding = 60;
            var flyoutPosition = flyout.offset();
            var containerPosition = container.offset();

            if (e.pageX > flyoutPosition.left) {
                var newWidth = e.pageX-flyoutPosition.left-mouseOffsetX;
                flyout.css('max-width',newWidth.toString()+'px');
                flyout.css('width',newWidth.toString()+'px');
            }
            if (e.pageY-flyoutPosition.top > flyOutMinHeight) {
                var newHeight = e.pageY-flyoutPosition.top-mouseOffsetY;
                flyout.css('max-height',newHeight.toString()+'px');
                flyout.css('height',newHeight.toString()+'px');

                var newContainerHeight = e.pageY-containerPosition.top-mouseOffsetY;
                container.css('max-height',(newContainerHeight-resizerHeight).toString()+'px');
                container.css('height',(newContainerHeight-resizerHeight).toString()+'px');

                var tabsContent = jQuery('div.oskari-flyoutcontent.featuredata').find('div.tabsContent');
                var newMaxHeight = e.pageY-tabsContent[0].offsetTop-resizerHeight-bottomPadding;
                flyout.find('div.tab-content').css('max-height',newMaxHeight.toString()+'px');
            }
        });

        // Modify layout for the resizer image
        flyout.find('div.oskari-flyoutcontent').css('padding-bottom','5px');
        if (jQuery('div.flyout-resizer').length === 0) flyout.append(resizer);
    },

    /**
     * @method _prepareData
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that was added
     * @param {Object} data
     *           WFS data JSON
     * Updates data for layer
     */
    _prepareData: function(layer) {
        var me = this;
        var panel = this.layers['' + layer.getId()];
        var isOk = this.tabsContainer.isSelected(panel);
        if(isOk) {
            panel.getContainer().empty();

            // create model
            var model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            model.setIdField("__fid");

            // hidden fields (hide all - remove if not empty)
            var hiddenFields = layer.getFields().slice(0);

            // helper for removing item (indexOf is not in IE8)
            remove_item = function(a, val){
                for(key in a){
                    if(a[key] == val){
                        a.splice(key, 1);
                        break;
                    }
                }
                return a;
            }

            // get data
            var featureData;
            var values;
            var fields = layer.getFields();
            var features = layer.getActiveFeatures();
            var selectedFeatures = layer.getSelectedFeatures().slice(0); // filter

            this._addFeatureValues(model, fields, hiddenFields, features, selectedFeatures);
            this._addFeatureValues(model, fields, hiddenFields, selectedFeatures, null);

            fields = model.getFields();
            hiddenFields.push("__fid");

            if(!panel.grid) {
                var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid',this.instance.getLocalization('columnSelectorTooltip'));

                // localizations
                var locales = layer.getLocales();
                if(locales) {
                    for(var k = 0; k < locales.length; k++) {
                        grid.setColumnUIName(fields[k], locales[k]);
                    }
                }

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

                // helper function for visibleFields
                var contains = function(a, obj) {
                    for(var i = 0; i < a.length; i++) {
                        if(a[i] == obj)
                            return true;
                    }
                    return false
                }

                // filter out certain fields
                var visibleFields = [];
                for(var i = 0; i < fields.length; ++i) {
                    if(!contains(hiddenFields, fields[i])) {
                       visibleFields.push(fields[i]);
                    }
                }

                grid.setVisibleFields(visibleFields);
                grid.setColumnSelector(true);
                grid.setResizableColumns(true);

                panel.grid = grid;
            }
            panel.grid.setDataModel(model);
            panel.grid.renderTo(panel.getContainer());
            // define flyout size to adjust correctly to arbitrary tables
            var mapdiv = jQuery(me.mapDivId);
            var content = jQuery('div.oskari-flyoutcontent.featuredata');
            var flyout = content.parent().parent();
            if (!me.resized) {
                // Define default size for the object data list
                flyout.find('div.tab-content').css('max-height',(mapdiv.height()/4).toString()+'px');
                flyout.css('max-width',mapdiv.width().toString()+'px');
            }
            if (me.resizable) this._enableResize();
        }
        else {
            // Wrong tab selected -> ignore (shouldn't happen)
        }
    },


    /**
     * @method _addFeatureValues
     * @private
     * @param {Oskari.userinterface.component.GridModel} grid
     * @param {Object[]} features
     *
     * Adds features to the model data
     */
    _addFeatureValues : function(model, fields, hiddenFields, features, selectedFeatures) {
        for(var i = 0; i < features.length; i++) {
            featureData = {};
            values = features[i];

            // remove from selected if in feature list
            if(selectedFeatures != null && selectedFeatures.length > 0) {
                for(var k = 0; k < selectedFeatures.length; k++) {
                    if(values[0] == selectedFeatures[k][0]) { // fid match
                        selectedFeatures.splice(k, 1);
                    }
                }
            }

            for(var j = 0; j < fields.length; j++) {
                if(values[j] == null || values[j] == "") {
                    featureData[fields[j]] = "";
                } else {
                    featureData[fields[j]] = values[j];
                    // remove from empty fields
                    remove_item(hiddenFields, fields[j]);
                }
            }
            model.addData(featureData);
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


        var fids = event.getWfsFeatureIds();
        if(fids != null && fids.length > 0) {
            panel.grid.select(fids[0], event.isKeepSelection());
            if(fids.length > 1) {
                for (var i = 1; i < fids.length; ++i) {
                    panel.grid.select(fids[i], true);
                }
            }
        } else {
            panel.grid.removeSelections();
        }
    },

    /**
     * @method setEnabled
     * @param {Boolean} isEnabled
     * True to enable grid functionality
     * False to disable and stop reacting to any map movements etc
     */
    setEnabled : function(isEnabled) {
        if(this.active == isEnabled) {
            return;
        }

        this.active = (isEnabled == true);
        var sandbox = this.instance.sandbox;

        // feature info activation disabled if object data grid flyout active and vice versa
        var gfiReqBuilder = sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
        if(gfiReqBuilder) {
            sandbox.request(this.instance.getName(), gfiReqBuilder(!this.active));
        }

        // disabled
        if(!this.active) {
            if(this.selectedTab) {
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
                this.updateGrid();
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
