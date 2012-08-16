/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance", function(b) {
	this.name = 'searchservice';
	this.mediator = null;
	this.sandbox = null;

	this.impl = null;

	/**
	 * These should be SET BY Manifest end
	 */

	this.ui = null;
},
/*
 * prototype
 */
{

	createPanel : function() {
		var me = this;
		var xt = me.libs.ext;
		var pnl = xt.create('Ext.Panel', {
			region : 'center',
			layout : 'fit',
			height : 384,
			items : []
		});

		return pnl;
	},
	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		/**
		 * These should be SET BY Manifest begin
		 */
		this.libs = {
			ext : Oskari.$("Ext")
		};
		this.facade = Oskari.$('UI.facade');

		this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.searchservice.SearchModule');

		var pnl = this.createPanel();

		/**
		 *
		 * register to framework and eventHandlers
		 */
		var def = this.facade.appendExtensionModule(this.impl, this.name, {}
		/* this.impl.eventHandlers */, this, 'E', {
			'fi' : {
				title : 'Haku'
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : 'Haku'
			}

		}, pnl);
		this.def = def;
		pnl.add(def.initialisedComponent);

		this.impl.start(this.facade.getSandbox());

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
		this.def = null;
		this.impl = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
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

/* Inheritance *//**
 * @class Oskari.mapframework.ui.module.searchservice.MetadataModule
 * Provides a "metadata"/additional information panel that shows 
 * featureInfo and maplayerInfo(legendimage)
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.searchservice.MetadataModule',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._sandbox = null;
    this.uiItems = {};
}, {
    /** @static @property __name module name */
    __name : "MetadataModule",
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
        sandbox.printDebug("Initializing metadata module...");
        sandbox.registerForEventByName(this, 'AfterShowMapLayerInfoEvent');
        sandbox.registerForEventByName(this, 'AfterGetFeatureInfoEvent');
        sandbox.registerForEventByName(this, 'AfterAppendFeatureInfoEvent');

        var resultPanel = Ext.create('Ext.Panel', {
            autoScroll : true,
            layout : 'fit'
        });
        this.uiItems.resultPanel = resultPanel;

        var metadataModulePanel = Ext.create('Ext.Panel', {
            layout : 'fit',
            id : 'MetadataModule', // for selenium selector
            title : sandbox.getText('rightpanel_material_legend_title'),
            items : [this.uiItems.resultPanel],
            border : false,
            frame : false
        });
        this.uiItems.metadataModulePanel = metadataModulePanel;
        return metadataModulePanel;
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
    /**
     * @method afterShowMapLayerInfoEvent
     * Show map layer info
     *
     * @param {Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent}
     *            event layer event
     */
    afterShowMapLayerInfoEvent : function(event) {
        // clear panel before anything else
        this.uiItems.resultPanel.update('');
        this.uiItems.resultPanel.removeAll();
        // start creating the view
        var layer = event.getMapLayer();
        var sandbox = this._sandbox;

        var legendHtml = sandbox.getText('rightpanel_map_layer_have_not_description');

        // check if we have getLegendImage function and it returns a value
        if(layer.getLegendImage && layer.getLegendImage()) {
            legendHtml = '<img src="' + layer.getLegendImage() + '" alt="' + layer.getName() + '" />';

            // check if we have getCurrentStyle function
            // style legend is from getCapabilities and might
            // be something that we dont want to show
            // -> hence only use it it no default legendImage defined
        } else if(layer.getCurrentStyle && layer.getCurrentStyle().getLegend()) {
            legendHtml = '<img src="' + layer.getCurrentStyle().getLegend() + '" alt="' + layer.getName() + '" />';
        }

        this.uiItems.resultPanel.update(legendHtml);
        // find the main panel (accordion panel in this case) and expand it too
        Oskari.$('UI.facade').expandPart('E');
        this.uiItems.metadataModulePanel.expand(true);
    },
    /**
     * @method afterGetFeatureInfoEvent
     * Show get feature info results
     *
     * @param {Oskari.mapframework.event.common.AfterGetFeatureInfoEvent}
     *            msg result object
     */
    afterGetFeatureInfoEvent : function(event) {
        // clear panel before anything else
        this.uiItems.resultPanel.removeAll();
        // start creating the view
        var response = event.getResponse();

        var sandbox = this._sandbox;
        if(response == true) {
            //TODO: any reason to show here and append stuff later?
            var innerInfoPanel = Ext.create('Ext.Panel', {
                title : '<b>' + sandbox.getText("rightpanel_wms_getfeatureinfo_title") + '</b>',
                id : 'inner_feature_info_panel',
                layout : 'fit',
                autoScroll : true
            });
            this.uiItems.metadataModulePanel.innerInfoPanel = innerInfoPanel;
            this.uiItems.resultPanel.add(innerInfoPanel);
            this.uiItems.metadataModulePanel.expand(true);
        } else {
            if(event.isWfsSelected() == true) {
                sandbox.showPopupText("search_module_popup_layer_is_wfs_title", "search_module_popup_layer_is_wfs_message");
            } else {
                sandbox.showPopupText("mapcontrolsservice_layer_info_layer_not_selected_messagebox_title", "mapcontrolsservice_layer_info_layer_not_selected_messagebox_message");
            }
        }
    },
    /**
     * @method afterAppendFeatureInfoEvent
     * Append additional get feature info results
     *
     * @param {Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent}
     *            msg result object
     */
    afterAppendFeatureInfoEvent : function(event) {
        var messageHtml = "<h3>" + event.getHeader() + "</h3>";
        var msg = event.getMessage();
        // decode from string to json
        if(msg.startsWith('{parsed: {')) {
	        var jsonObj = Ext.decode(msg);
	        if(jsonObj && jsonObj.parsed) {
	        	// got transformed json
	        	msg = this._formatJsonGFI(jsonObj.parsed);
	        }	
        }
        //else treat as html
        
        msg = '<div style="padding: 5px; font: 11px Tahoma, Arial, Helvetica, sans-serif;">' + msg + '</div>';
        this.uiItems.metadataModulePanel.innerInfoPanel.update(messageHtml + msg);
        var sandbox = this._sandbox;
        sandbox.request(this, sandbox.getRequestBuilder('ActionReadyRequest')("GET_FEATURE_INFO", false));
    },
    /**
     * @method _formatJsonGFI
     * @private
     * Formats a parsed GFI response from server to html
     *
     * @param {Object}
     *            jsonData json data object
     * @return {String} formatted html
     */
    _formatJsonGFI : function(jsonData) {
    	var html = '<br/><table>';
    	var even = false;
    	for(attr in jsonData) {
    		var value = jsonData[attr];
    		if(value.startsWith('http://')) {
    			value = '<a href="'+ value + '" target="_blank">' + value + '</a>';
    		}
    		html = html + '<tr style="padding: 5px;';
    		if(!even) {
    			html = html + ' background-color: #EEEEEE';
    		}
    		even = !even;
    		html = html + '"><td style="padding: 2px">' + attr + '</td><td style="padding: 2px">' + value + '</td></tr>';
    	}
    	return html + '</table>';
    },

	/** 
	 * @property {Object} eventHandlers 
	 * @static 
	 */
    eventHandlers : {
        'AfterShowMapLayerInfoEvent' : function(event) {
            this.afterShowMapLayerInfoEvent(event);
        },
        "AfterGetFeatureInfoEvent" : function(event) {
            this.afterGetFeatureInfoEvent(event);
        },
        "AfterAppendFeatureInfoEvent" : function(event) {
            this.afterAppendFeatureInfoEvent(event);
        }
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