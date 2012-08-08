Oskari.clazz.define('Oskari.mapframework.ui.module.mapasker.GridModule', function() {

    this._sandbox = null;

    this._currentData = {};

    this._definedModels = [];
    this._selectedLayer = null;
    this._initialized = false;

    this._service = null;

    this._mainPanel = null;
    this._tabPanel = null;
    this._latestResponseId = -1;

}, {
    /***********************************************************
     * Get module name
     */
    __name : "GridModule",
    getName : function() {
        return this.__name;
    },
    /***********************************************************
     * Initialize module
     *
     * @param {Object}
     *            sandbox
     */
    init : function(sandbox) {
        var me = this;
        this._sandbox = sandbox;
        sandbox.printDebug("Initializing grid module...");
        sandbox.registerForEventByName(this, 'AfterWfsGetFeaturesJsonFlowForTableFormatEvent');
        sandbox.registerForEventByName(this, 'AfterMapLayerRemoveEvent');
        sandbox.registerForEventByName(this, 'AfterHighlightMapLayerEvent');
        sandbox.registerForEventByName(this, 'AfterDimMapLayerEvent');
        sandbox.registerForEventByName(this, 'AfterMapMoveEvent');
        sandbox.registerForEventByName(this, 'AfterHighlightWFSFeatureRowEvent');

        this._service = this._sandbox.getService('Oskari.mapframework.service.OgcSearchService');

        this.noFoundFeaturesError = sandbox.getText("grid_module_not_found_info_for_selected_area");
        this.notInScaleError = sandbox.getText("grid_module_wfs_maplayer_not_visible_this_scale");
        this.loadingText = sandbox.getText('grid_module_loading_info');

        this._msgPanel = Ext.create('Ext.panel.Panel', {
            id : 'grid-msg-tab',
            border : true,
            layout : 'fit',
            frame : false,
            split : false,
            loadMask : false, // workaround to a extjs 4.0.2 bug
            // http://www.sencha.com/forum/showthread.php?136528
            title : sandbox.getText('grid_module_gridpanel_no_title'),
            containerScroll : false
        });

        this._mainPanel = Ext.create('Ext.panel.Panel', {
            id : 'grid-module',
            border : true,
            layout : 'fit',
            frame : false,
            split : false,
            //loadMask : false, // workaround to a extjs 4.0.2 bug
            // http://www.sencha.com/forum/showthread.php?136528
            title : sandbox.getText('grid_module_gridpanel_no_title'),
            //items : [me._tabPanel],
            containerScroll : true
        });
        this._customTooltip = Ext.create('Ext.tip.ToolTip', {
            autoHide : false
        });
        return this._mainPanel;
    },
    /***********************************************************
     * Start module
     *
     * @param {Object}
     *            sandbox
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    /**
     *
     */
    stop : function(sandbox) {

    },
    _findInList : function(pList, pValue) {
        var foundAt = -1;
        for(var i = 0; i < pList.length; ++i) {
            if(pList[i] == pValue) {
                return i;
            }
        }
        return foundAt;
    },
    /**
     * Clears the screen of everything, this should happen when another data
     * model changes
     * and initUIComponents() needs to create a new ui
     */
    _cleanUp : function() {

        this._mainPanel.suspendLayout = true;
        if(this._currentData) {
            for(var f in this._currentData) {
                if(f.grid) {
                    f.grid.suspendLayout = true;
                    this._tabPanel.remove(f.grid);
                    f.grid.destroy();
                    f.grid = null;
                    this._currentData[f] = null;
                }
            }
        }
        this._currentData = null;
        this._currentData = {};

        //this._tabPanel.suspendLayout = true;
        // if true to removeall -> calls grid refresh which results in extjs
        // error
        // (store is null) on tabs that have not been actually shown (user has
        // not visited them)
        this._tabPanel.removeAll(false);
        // clean up everything else after grids have been cleaned with previous
        // removeAll
        this._tabPanel.removeAll(true);
        this._tabPanel.destroy();
        this._tabPanel = null;

        this._mainPanel.suspendLayout = false;
        this._mainPanel.removeAll(true);
    },
    /**
     * returns list of featureIds that are currently selected in given tab (if
     * tab not given, uses active tab)
     */
    getSelectedFeatures : function(tabToSelectFrom) {

        var tab = tabToSelectFrom;
        if(!tab && this._tabPanel) {
            tab = this._tabPanel.getActiveTab();
        }
        // check that we are working with grid tab
        if(!tab.getSelectionModel) {
            tab = null;
        }
        // extract featureId's
        var idList = [];
        if(tab) {
            var selectedList = tab.getSelectionModel().getSelection();
            for(var i = 0; i < selectedList.length; ++i) {
                idList.push(selectedList[i].get('featureId'));
            }
        }
        return idList;
    },
    /**
     * Selects row from given tab (if tab not given, uses active tab)
     * Deselects if empty or null list
     */
    selectRows : function(selectedList, tabToSelectFrom) {
        var tab = tabToSelectFrom;
        if(!tab && this._tabPanel) {
            tab = this._tabPanel.getActiveTab();
        }
        // check that we are working with grid tab
        if(!tab.getSelectionModel) {
            tab = null;
        }
        var modelList = [];
        if(tab) {
            var store = tab.getStore();

            if(selectedList && selectedList.length > 0) {
                index = store.findBy(function(record, id) {
                    var featureId = record.get('featureId');
                    for(var i = 0; i < selectedList.length; ++i) {
                        if(featureId == selectedList[i]) {
                            modelList.push(record);
                            break;
                        }
                    }
                    //return false;
                });
            }
        }
        if(modelList.length > 0) {
            tab.getSelectionModel().select(modelList);
            // moves scroller to row location on big data sets
            // doesn't seem to work too well, but does something :)
            tab.getView().focusRow(modelList[0]);
        } else if(tab && tab.getSelectionModel) {
            // clear Selection if on grid tab
            tab.getSelectionModel().deselectAll();
        }
        return modelList.length;
    },
    /***********************************************************
     * Check json data at this is ok
     *
     * @param {Object}
     *            data json data
     */
    _isValidData : function(event) {
        var _return = (event !== null);
        var data = event.getData();

        if(data == null || data.headers == null || data.featureDatas == null) {
            _return = false;
        }

        // Check at datas is ok
        if(_return) {
            for(var i = 0; i < data.featureDatas.length; i++) {
                if(data.featureDatas[i].children == null) {
                    _return = false;
                    break;
                }
            }
        }
        return _return;
    },
    showMessage : function(msg) {
        if(msg) {
            for(var i = 0; i < this._tabPanel.items.items.length; i++) {
                if(this._tabPanel.items.items[i].getStore) {
                    this._tabPanel.items.items[i].getStore().removeAll();
                }
            }

            // handling where initial tabs are empty or we need to show out of
            // scale message
            if(this._tabPanel.items.items.length == 0 || !this._isInScale()) {
                this._tabPanel.add(this._msgPanel);
            }
            this._msgPanel.update('<div style="margin:5px;">' + msg + '</div>');
            this._tabPanel.setActiveTab(this._msgPanel);
        } else {
            this._tabPanel.remove(this._msgPanel, false);
        }
    },
    /**
     * Data models constructed to match the data
     */
    _initUiComponents : function(jsonData) {

        this._sandbox.printDebug('[' + this.getName() + '] Grid model changed');
        var me = this;

        // create a "all data" tab with grid
        var allTabFields = [];
        // field to identify an individual feature in all tabs grid
        allTabFields.push('mapframeworkFeatureTitle');

        // create individual data tabs with grids
        for(var i = 0; i < jsonData.length; i++) {

            // just using finnish name to identify data set internally
            var featureName = jsonData[i]["feature_fi"];
            // initialize models
            var parsedData = this._parseAndInitFeatureDataModel(jsonData[i]);
            this._currentData[featureName] = {};
            this._currentData[featureName].feature = parsedData;

            var featureGrid = this._createFeatureGrid(parsedData);

            this._currentData[featureName].grid = featureGrid;
            this._tabPanel.add(featureGrid);

            // init fields for all data grid
            for(var index = 0; index < parsedData.modelAttributes.length; index++) {
                var attr = parsedData.modelAttributes[index];
                var foundAtIndex = this._findInList(allTabFields, attr);
                if(foundAtIndex !== -1) {
                    // column with same name cannot be defined twice -> just drop
                    // if already existing
                    // TODO: check if we need to keep the column (maybe prefix
                    // with panel title)
                    //attr = parsedData.title + ' - ' + attr;
                } else {
                    allTabFields.push(attr);
                }
            }

        }

        // TODO: check if we need to redefine "all data" model everytime
        // ext breaks if (re)defining models with same name -> modify modelname
        var alldataModelId = 'GridAllTabsModel-' + Ext.id();
        Ext.define(alldataModelId, {
            extend : 'Ext.data.Model',
            fields : allTabFields
        });

        // create all data store
        var storeAll = Ext.create('Ext.data.Store', {
            model : alldataModelId
        });

        // create grid columns for "all data" tab
        var allTabColumns = [];

        for(var index = 0; index < allTabFields.length; index++) {
            var field = allTabFields[index];

            var hiddenColumn = false;

            if(field == 'featureId' || field == 'qName') {
                hiddenColumn = true;
            }

            var column = {
                dataIndex : '' + field + '',
                text : '' + field + '',
                hidden : hiddenColumn,
                sortable : true,
                renderer : function(value, tdMeta, record, rowIndex, colIndex, pStore, pGrid) {
                    return me._customRenderer(value, tdMeta, record, rowIndex, colIndex, pStore, pGrid);
                }
            };
            // customize featureData title field
            if(field === 'mapframeworkFeatureTitle') {
                column.text = this._sandbox.getText("grid_module_feature_type_title");
                column.width = 200;
            }
            allTabColumns.push(column);
        }
        // create actual all data grid
        this._allDataGrid = Ext.create('Ext.grid.Panel', {
            id : 'grid-all',
            multiSelect : true,
            store : storeAll,
            loadMask : false, // workaround to a extjs 4.0.2 bug
            // http://www.sencha.com/forum/showthread.php?136528
            title : this._sandbox.getText("grid_module_all_tab_title"),
            trackMouseOver : false,
            autoScroll : true,
            viewConfig : {
                stripeRows : true,
                deferEmptyText : false,
                emptyText : me.noFoundFeaturesError
            },
            columns : allTabColumns,
            listeners : {
                itemclick : function(dv, record, item, index, e) {
                    me._sendUpdatedSelectionEvent();
                },
                cellClick : function(grid, cellEl, colIndex, record, rowEl, rowIndex, event, listeners) {
                    me._cellClicked(grid, cellEl, colIndex, record, rowEl, rowIndex, event, listeners);
                }
            }
        });

        this._tabPanel.add(this._allDataGrid);
        // first is message tab -> show grid on index 1
        this._tabPanel.setActiveTab(0);
        this._initialized = true;
    },
    /***********************************************************
     * Handle AfterWfsGetFeaturesJsonFlowForTableFormatEvent
     * Core fires this event that has the data to show
     * Figure out from data:
     *  1) new data -> create models & ui based on data
     *  2) old data -> update existing ui with new data
     *
     * TODO: move the data fetching to this module
     *
     * @param {Object}
     *            event
     */
    _handleAfterWfsGetFeaturesJsonFlowForTableFormatEvent : function(event) {

        this._mainPanel.setLoading(false);
        /* safety checks */
        if(event.getData().wfsQueryId) {
            // check that we are handling a more recent response than on last run
            var responseId = parseInt(event.getData().wfsQueryId);
            if(responseId < this._latestResponseId) {
                this._sandbox.printDebug('[' + this.getName() + '] Grid data response got old data. Current: ' + this._latestResponseId + ', got: ' + responseId);
                return;
            }
            this._latestResponseId = responseId;
        }

        this._sandbox.request(this, this._sandbox.getRequestBuilder('ActionReadyRequest')("WFS_GRID", false));

        if(!this._isValidData(event)) {
            this.showMessage(this.noFoundFeaturesError);
            return;
        }

        var treeJson = event.getData();
        if(!this._initialized) {
            // new data, reinit ui
            this._initUiComponents(treeJson.featureDatas);
        }

        // try to keep selected items
        var selectedItems = this.getSelectedFeatures();

        // ui up-to-speed, populate grids
        this._updateData(event.getData().featureDatas);

        this.showMessage();
        // try to keep selected items
        var selectCount = this.selectRows(selectedItems);
        if(selectCount > 0) {
            // update map with selected dots
            this._sendUpdatedSelectionEvent();
        }
    },
    /**
     * Actual data update to ui components
     */
    _updateData : function(featureJson) {

        this._sandbox.printDebug('[' + this.getName() + '] Grid data changed');
        var allTabsData = [];
        // create individual data tabs with grids
        for(var i = 0; i < featureJson.length; i++) {

            var featureData = featureJson[i];
            var featureName = featureData["feature_fi"];

            // update individual grid data
            var store = this._currentData[featureName].grid.getStore();
            // extjs store modifies the array so copy it with slice(0) before
            // giving to store
            store.loadData(featureData.children.slice(0));

            // populate all data
            for(var index = 0; index < featureData.children.length; index++) {
                var data = featureData.children[index];
                data.mapframeworkFeatureTitle = this._currentData[featureName].feature.title;
                allTabsData.push(data);
            }
        }
        // update all data grid
        var storeAll = this._allDataGrid.getStore();
        storeAll.loadData(allTabsData);
    },
    /**
     * Parses the model etc from data
     */
    _parseAndInitFeatureDataModel : function(featureJson) {

        var lang = this._sandbox.getLanguage();

        var featureData = {};
        featureData.title = featureJson["feature_" + lang];

        if(!featureData.title) {
            featureData.title = featureJson["feature_fi"];
        }
        featureData.modelAttributes = [];

        var children = featureJson.children;

        // populate model fields, check children length just to be safe
        if(children.length > 0) {
            for(var childAttr in children[0]) {
                featureData.modelAttributes.push(childAttr);
            }
        }
        featureData.modelName = 'GridModel.' + featureData.title;

        var modelAlreadyDefined = false;
        for(var i = 0; i < this._definedModels.length; ++i) {
            if(this._definedModels[i] === featureData.modelName) {
                modelAlreadyDefined = true;
                break;
            }

        }
        // child Model, only define if not defined before
        // ext breaks if defining models with same modelname
        if(!modelAlreadyDefined) {
            Ext.define(featureData.modelName, {
                extend : 'Ext.data.Model',
                fields : featureData.modelAttributes
            });
            this._definedModels.push(featureData.modelName);
        }

        return featureData;
    },
    /**
     * Creates the grid component for an individual data feature set
     */
    _createFeatureGrid : function(featureData) {

        var me = this;
        // create colums and fields
        var columns = [];

        for(var index = 0; index < featureData.modelAttributes.length; ++index) {
            var attribute = featureData.modelAttributes[index];

            var hiddenColumn = false;

            if(attribute == 'featureId' || attribute == 'qName') {
                hiddenColumn = true;
            }

            var column = {
                dataIndex : '' + attribute + '',
                text : '' + attribute + '',
                hidden : hiddenColumn,
                sortable : true,
                renderer : function(value, tdMeta, record, rowIndex, colIndex, pStore, pGrid) {
                    return me._customRenderer(value, tdMeta, record, rowIndex, colIndex, pStore, pGrid);
                }
            };
            columns.push(column);
        }

        // create store
        var store = Ext.create('Ext.data.Store', {
            model : featureData.modelName
        });

        var grid = Ext.create('Ext.grid.Panel', {
            id : 'grid-' + featureData.title,
            store : store,
            displayInfo : false,
            loadMask : false, // workaround to a extjs 4.0.2 bug
            // http://www.sencha.com/forum/showthread.php?136528
            title : featureData.title,
            multiSelect : true,
            trackMouseOver : false,
            autoScroll : true,
            columns : columns,
            viewConfig : {
                stripeRows : true,
                deferEmptyText : false,
                emptyText : me.noFoundFeaturesError
            },
            listeners : {
                itemclick : function(dv, record, item, index, e) {
                    me._sendUpdatedSelectionEvent();
                },
                cellClick : function(grid, cellEl, colIndex, record, rowEl, rowIndex, event, listeners) {
                    me._cellClicked(grid, cellEl, colIndex, record, rowEl, rowIndex, event, listeners);
                }
            }
        });

        return grid;
    },
    _cellClicked : function(pGrid, cellEl, colIndex, record, rowEl, rowIndex, event, listeners) {
        // need to get the column name from grid
        // model has initially same field order, but user might have changed
        // column order in ui
        var key = pGrid.getGridColumns()[colIndex].dataIndex;
        var value = record.get(key);

        var type = typeof value;
        if(type === 'object') {
            var tableHtml = '<table cellspacing=\'5\'>';
            for(var attr in value) {
                var valueType = typeof value[attr];
                var valueObj = value[attr];
                tableHtml = tableHtml + '<tr><td>' + attr + '</td><td>' + value[attr] + '</td></tr>';

                /*if (valueType === 'object') {
                 // render inner table?
                 valueObj = valueObj[0];
                 }*/
            }
            tableHtml = tableHtml + '</table>';
            this._customTooltip.update(tableHtml);
            // need to show before setting position
            this._customTooltip.show();
            this._customTooltip.alignTo(cellEl);
        }
    },
    /**
     * renderer for object type grid data
     */
    _customRenderer : function(value, tdMeta, record, rowIndex, colIndex, pStore, pGrid) {
        var type = typeof value;
        if(type !== 'object') {
            return value;
        } else {
            //var customId = pGrid.getId() + '_' + record.get('featureId') + '_'
            // + record.fields.keys[colIndex];
            var img = '<img src="' + Oskari.$().startup.imageLocation + '/resource/icons/kysymysmerkki.png" />';
            //var buttonPlaceholder = '<div id="' + customId + '">' + img +
            // '</div>';
            return img;
        }

    },
    /***********************************************************
     * Sets the "loading message" or scale error depending on layer
     *
     * @param {Object}
     *            layer
     */
    _showDataLoadMessage : function() {

        if(this._isInScale()) {
            this._mainPanel.setLoading(this.loadingText);
        } else {
            this._mainPanel.setLoading(false);
            // out of scale
            this.showMessage(this.notInScaleError);
            this._sandbox.request(this, this._sandbox.getRequestBuilder('ActionReadyRequest')("WFS_GRID", false));
        }
    },
    /***********************************************************
     * Handle AfterHighlightWFSFeatureRowEvent
     * == higlight places specified in the event
     */
    _handleAfterHighlightWFSFeatureRowEvent : function(event) {

        this._mainPanel.setLoading(false);
        var me = this;
        var selectedFeatureIds = event.getWfsFeatureIds();

        var selectList = [];

        if(selectedFeatureIds.length > 0) {
            if(event.isKeepSelection()) {
                // if ctrl -> add to list
                selectList = this.getSelectedFeatures();
            }
            for(var i = 0; i < selectedFeatureIds.length; ++i) {
                var alreadyAdded = me._arrayContainsValue(selectList, selectedFeatureIds[i]);
                // add if not selected yet
                if(!alreadyAdded) {
                    selectList.push(selectedFeatureIds[i]);
                } else {
                    // TODO: remove selection?
                }
            }
            me.selectRows(selectList);
        } else if(!event.isKeepSelection()) {
            // clear selection if ctrl not down
            me.selectRows(selectList);
        }

        this._sendUpdatedSelectionEvent();
    },
    /**
     * Checks if given array contains given value
     */
    _arrayContainsValue : function(myArray, id) {
        var length = myArray.length;
        for(var i = 0; i < length; i++) {
            if(myArray[i] == id) {
                return true;
            }
        }
        return false;
    },
    /**
     * Create and send request to highlight selected items on map
     */
    _sendUpdatedSelectionEvent : function() {
        var requestIdList = "";
        var tab = this._tabPanel.getActiveTab();
        if(!tab) {
            this._sandbox.printDebug("[grid-module] Tab is not ready.");
            return;
        }
        var selModel = tab.getSelectionModel();
        if(!selModel) {
            this._sandbox.printDebug("[grid-module] Tab is not ready.");
            return;
        }
        var selectedList = tab.getSelectionModel().getSelection();
        if(!selectedList) {
            this._sandbox.printDebug("[grid-module] Tab is not ready.");
            return;
        }
        var separator = ":::";
        // extract featureId's
        var idList = [];
        for(var i = 0; i < selectedList.length; ++i) {
            var model = selectedList[i];
            var featureId = model.get('featureId');
            var qName = model.get('qName');
            requestIdList += featureId + separator + qName;
            if(i < selectedList.length - 1) {
                requestIdList += ",";
            }
        }
        var mapLayer = this._getSelectedMapLayer();
        var b = this._sandbox.getRequestBuilder('HighlightWFSFeatureRequest');
        var r = b(requestIdList, mapLayer.getId());
        this._sandbox.request("GridModule", r);
    },
    enable : function(layer) {
        // bring up the ui
        var me = this;

        this._tabPanel = Ext.create('Ext.tab.Panel', {
            id : 'grid-module-tab-panel',
            frame : false,
            loadMask : false, // workaround to a extjs 4.0.2 bug
            // http://www.sencha.com/forum/showthread.php?136528
            border : false,
            autoWidth : true,
            //hidden: true,
            height : 200,
            defaults : {
                layout : 'fit'
            },
            listeners : {
                tabchange : function(tabPanel, newTab, oldTab) {
                    // try to keep selection when moving between
                    // alldata tab and individual data tab
                    // otherwise dont bother
                    if(!oldTab.getSelectionModel || oldTab.getSelectionModel().getSelection().length == 0) {
                        // no selection, stop here
                        return;
                    }
                    // has selection
                    if(me._allDataGrid == newTab || me._allDataGrid == oldTab) {
                        // moving from or to all data tab
                        var selectedList = me.getSelectedFeatures(oldTab);
                        // call to select rows on new tab
                        me.selectRows(selectedList, newTab);
                    }
                }
            }
        });

        var uiManagerBottomPanel = Ext.getCmp("main-app-bottom");
        if(uiManagerBottomPanel && !uiManagerBottomPanel.isVisible()) {
            uiManagerBottomPanel.expand();
        }
        this._mainPanel.add(this._tabPanel);
        this._setSelectedMapLayer(layer);
        this._showDataLoadMessage();
    },
    disable : function() {
        this._mainPanel.update('');
        this._tabPanel.hide();
        this._mainPanel.setLoading(false);
        // cancel ongoing requests if possible
        this._service.removeWFSLayerGridRequests(this._selectedLayer);
        this._mainPanel.setTitle(this._sandbox.getText('grid_module_gridpanel_no_title'));
        this._cleanUp();
        this._selectedLayer = null;

        // hide ui
        var uiManagerBottomPanel = Ext.getCmp("main-app-bottom");
        if(uiManagerBottomPanel && uiManagerBottomPanel.isVisible()) {
            uiManagerBottomPanel.collapse();
        }
    },
    /**
     * Return the layer we are working with
     */
    _getSelectedMapLayer : function() {
        return this._selectedLayer;
    },
    _setSelectedMapLayer : function(layer) {
        this._selectedLayer = layer;
        this._initialized = false;
        this._mainPanel.setTitle(this._sandbox.getText('grid_module_gridpanel_title', [layer.getName()]));
    },
    _isActive : function() {
        if(this._selectedLayer) {
            return true;
        }
        return false;
    },
    _isInScale : function() {
        if(this._isActive()) {
            return this._getSelectedMapLayer().isInScale();
        }
        return false;
    },
    _updateServiceData : function() {
        if(this._isInScale()) {
            this._service.removeWFSLayerGridRequests(this._selectedLayer);
            var map = this._sandbox.getMap();
            this._service.scheduleWFSGridUpdate(this._getSelectedMapLayer(), map.getBbox(), map.getWidth(), map.getHeight(), this.getName());
        }
    },
    /***********************************************************
     * OnEvent handler
     *
     * @param {Object}
     *            event
     */
    onEvent : function(event) {
        // activate if wfs layer is highlighted
        if(event.getName() == 'AfterHighlightMapLayerEvent') {
            var layer = event.getMapLayer();
            if(layer.isLayerOfType('WFS')) {
                this.enable(layer);
                this._updateServiceData();
            }
        } else if(this._isActive()) {
            // show data in table
            if(event.getName() == 'AfterWfsGetFeaturesJsonFlowForTableFormatEvent') {
                if(this._isInScale()) {
                    // can return several map moves later -> map move should
                    // disable previous calls
                    this._handleAfterWfsGetFeaturesJsonFlowForTableFormatEvent(event);
                }

                // highlight requested rows
            } else if(event.getName() == 'AfterHighlightWFSFeatureRowEvent') {
                this._handleAfterHighlightWFSFeatureRowEvent(event);

                // update data on move
            } else if(event.getName() == 'AfterMapMoveEvent') {
                this._showDataLoadMessage();
                this._updateServiceData();

                // disable on dim/remove layer
            } else if(event.getName() == 'AfterDimMapLayerEvent' || event.getName() == 'AfterMapLayerRemoveEvent') {
                if(this._getSelectedMapLayer().getId() === event.getMapLayer().getId()) {
                    this.disable();
                }
            }
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */