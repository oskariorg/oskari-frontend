/**
 * @class Oskari.mapframework.ui.module.searchservice.SearchModule
 * Provides UI for search functionality
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.searchservice.SearchModule',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._sandbox = null;
    this.uiItems = {};
}, {
    /** @static @property __name module name */
    __name : "SearchModule",
    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("[SearchModule] Init");

        Ext.define('Search', {
            extend : 'Ext.data.Model',
            fields : ['name', 'village', 'type', {
                name : 'lat',
                convert : function(value, r) {
                    var src = r.raw.lat;
                    return src;
                }
            }, {
                name : 'lon',
                convert : function(value, r) {
                    var src = r.raw.lon;
                    return src;
                }
            }, {
                name : 'zoomLevel',
                convert : function(value, r) {
                    var src = r.raw.zoomLevel;
                    return src;
                }
            }, {
                name : 'name',
                convert : function(value, r) {
                    var src = r.raw.name;
                    return src;
                }
            }]
        });

        var searchButton = Ext.create('Ext.Button', {
            id : "search-button",
            style : 'border: 1px solid #9D9D9D;',
            text : sandbox.getText("rightpanel_search_find_places_button_value"),
            handler : function() {
                doSearch();
            }
        });
        this.uiItems.searchButton = searchButton;

        var clearButton = Ext.create('Ext.Button', {
            id : "search-clear-button",
            style : 'border: 1px solid #9D9D9D;',
            icon : Oskari.$().startup.imageLocation + '/resource/icons/poisto.png',
            handler : function() {
                clear();
            }
        });
        this.uiItems.clearButton = clearButton;

        var searchTextBox = Ext.create('Ext.form.field.Text', {
            id : 'mapwindow-search',
            emptyText : sandbox.getText("rightpanel_search_find_places_textbox_value"),
            flex : 1,
            autoCreate : {
                tag : 'input',
                type : 'text',
                autocomplete : 'off'
            },
            enableKeyEvents : true,
            listeners : {
                focus : function(evt) {
                    sandbox.request("SearchModule", sandbox
                    .getRequestBuilder('DisableMapKeyboardMovementRequest')());
                },
                keyup : function(textfield, evt) {
                    if(evt.keyCode == 13) {// search on enter keypress
                        doSearch();
                    }
                },
                /** when focus lost */
                blur : function(evt) {
                    sandbox.request("SearchModule", sandbox
                    .getRequestBuilder('EnableMapKeyboardMovementRequest')());
                }
            }
        });
        this.uiItems.searchTextBox = searchTextBox;

        var resultPanel = Ext.create('Ext.Panel', {
            id : 'SearchModuleResultPanel', // for selenium selector
            layout : 'fit'
        });
        this.uiItems.resultPanel = resultPanel;

        var loadingText = sandbox.getText('searchservice_searching_title');

        function clear() {
            resultPanel.setLoading(false);
            resultPanel.removeAll(true);
            searchButton.enable();
            searchTextBox.enable();
            searchTextBox.reset();
            searchTextBox.enable();
            var sandbox = Oskari.$().mapframework.runtime.findSandbox();
            var event = sandbox.getEventBuilder('SearchClearedEvent')();
            sandbox.notifyAll(event, true);
        }

        function doSearch() {
            resultPanel.removeAll(true);
            // remove previous search result
            searchButton.disable();
            searchTextBox.disable();
            resultPanel.setLoading(loadingText);

            var searchText = searchTextBox.getValue();
            var sandbox = Oskari.$().mapframework.runtime.findSandbox();

            var searchCallback = function(msg) {
                Oskari.$().mapframework.runtime.findComponent('SearchModule').showResults(msg);
            };
            var request = sandbox.getRequestBuilder('SearchRequest')(encodeURIComponent(searchText), searchCallback, null);
            sandbox.request("SearchModule", request);
        }

        var searchModulePanel = Ext.create('Ext.Panel', {
            layout : 'fit',
            title : sandbox.getText('searchservice_search_alert_title'),
            id : 'SearchModule', // for selenium selector
            items : [this.uiItems.resultPanel],
            dockedItems : [{
                xtype : 'toolbar',
                dock : 'top',
                items : [this.uiItems.searchTextBox, this.uiItems.searchButton, this.uiItems.clearButton]
            }],
            border : false,
            frame : false
        });
        this.uiItems.searchModulePanel = searchModulePanel;
        return searchModulePanel;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /***********************************************************
     * @method showResults
     * 		This method show search results.
     * Show search results
     *
     * @param {Object}
     *            msg result object
     */
    showResults : function(msg) {
        this.uiItems.searchButton.enable();
        this.uiItems.searchTextBox.enable();
        this.uiItems.resultPanel.setLoading(false);

        var sandbox = this._sandbox;
        sandbox.request(this, sandbox.getRequestBuilder('ActionReadyRequest')("SEARCH", false));
        if(msg.totalCount == -1) {
            Ext.Msg.alert(sandbox.getText('searchservice_search_alert_title'), msg.errorText);
        } else if(msg.totalCount == 0) {
            Ext.Msg.alert(sandbox.getText('searchservice_search_alert_title'), sandbox.getText('searchservice_search_not_found_anything_text'));
        } else {
            var tmpStore = msg;

            var searchStore = Ext.create('Ext.data.Store', {
                model : 'Search',
                autoLoad : true,
                pageSize : 15,
                remoteSort : true,
                proxy : {
                    type : 'pagingmemory',
                    data : msg,
                    reader : {
                        type : 'json',
                        root : 'locations',
                        totalProperty : 'totalCount'
                    }
                }
            });

            if(tmpStore.totalCount == 1) {
                this._sendMapMove(tmpStore.locations[0].lon, tmpStore.locations[0].lat, tmpStore.locations[0].zoomLevel);
            }
            var grid = Ext.create('Ext.grid.Panel', {
                renderTo : Ext.getBody(),
                store : searchStore,
                layout : 'fit',
                flex : 1,
                displayInfo : false,
                columns : [{
                    text : sandbox.getText("searchservice_search_result_column_name"),
                    dataIndex : "name",
                    width : 80,
                    flex : 2,
                    renderer : this._renderLink,
                    sortable : true
                }, {
                    text : sandbox.getText("searchservice_search_result_column_village"),
                    dataIndex : "village",
                    width : 60,
                    flex : 2,
                    renderer : this._renderVillage,
                    sortable : true
                }, {
                    text : sandbox.getText("searchservice_search_result_column_type"),
                    dataIndex : "type",
                    width : 55,
                    flex : 1,
                    sortable : true
                }],
                dockedItems : [{
                    xtype : 'pagingtoolbar',
                    store : searchStore,
                    dock : 'bottom',
                    hidden : tmpStore.totalCount < 15,
                    displayInfo : false
                }]
            });
            this.uiItems.resultPanel.add(grid);
        }
    },
    /***********************************************************
     * @method _sendMapMove
     * 		Convenience method for sending a MapMoveRequest, sets showmarker flag as true.
     * @private
     *
	 * @param {Number} lon
	 *            longitude
	 * @param {Number} lat
	 *            latitude
	 * @param {Number/OpenLayers.Bounds} zoom (optional)
	 *            zoomlevel (0-12) or OpenLayers.Bounds to zoom to. If not given the map zoom level stays as it was.
     */
    _sendMapMove : function(lon, lat, zoom) {
        this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
    },
    /***********************************************************
     * @method _renderLink
     * 			Render center map link from record name
     * @private
     *
     * @param {Object}
     *            value extjs renderer value
     * @param {Object}
     *            p
     * @param {Object}
     *            record extjs model
     */
    _renderLink : function(value, p, record) {
        return '<b><a href="#" onclick="Oskari.$().sandbox.requestByName(\'SearchModule\', \'MapMoveRequest\',[' + record.data.lon + ',' + record.data.lat + ',' + record.data.zoomLevel + ',true]);return false;">' + record.data.name + '</a>';
    },
    /***********************************************************
     * @method _renderVillage
     * 		Render village name from record village
     * @private
     *
     * @param {Object}
     *            value extjs renderer value
     * @param {Object}
     *            p
     * @param {Object}
     *            record extjs model
     */
    _renderVillage : function(value, p, record) {
        this.village = record.data.village;
        return this.village;
    },
	/** 
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler)
            return;
        return handler.apply(this, [event]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */