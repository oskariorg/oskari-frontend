/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mappublished.SearchPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
}, {
    /** @static @property __name plugin name */
    __name : 'mappublished.SearchPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        return "<div id='basemapButtonsDiv' class='search-div-with-basemap-buttons'></div>";
    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._createUI();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
        jQuery("#search-div").remove();
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
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {/*
        'DummyEvent' : function(event) {
            alert(event.getName());
        }*/
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    
    /**
     * @method _createUI
     * @private
     * Creates UI for search functionality in the 
     * HTML div thats id is passed in #_conf.toolsContainer
     */
    _createUI : function() {
    	var sandbox = this._sandbox;
    	var me = this;
    	
		this._searchBoxMessage = sandbox.getText("rightpanel_search_find_places_textbox_value");
        var buttonSearchMessage = sandbox.getText("rightpanel_search_find_places_button_value");
		var closeSearchMessage = sandbox.getText("rightpanel-searchresults-close_button_value");
		
		var html =  '<div id="search-div">' +
        '<div id="search-textarea-and-button">' +
            '<input id="search-string" value="' + this._searchBoxMessage + '" type="text" name="search-string" />' +
            '<input id="search-button" type="button" value="' + buttonSearchMessage + '" name="search-button" />' +
        '</div>' + 
        '<div id="search-container" class="hidden">' + 
        '<img id="close-search-button" src="' + startup.imageLocation + '/resource/icons/poisto.png" alt="' + closeSearchMessage +'" title="' + closeSearchMessage + '"/>' +
        '<div id="search-results-header">&nbsp;</div>' +
        '<div id="search-results"></div>' +
        '</div>' +
        '</div>';
        
        jQuery(html).appendTo("#" + this._conf.toolsContainer);
        
        // bind events
        var me = this;
        // to text box
        jQuery("#search-string").focus(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
            me._checkForKeywordClear();
	    });
        jQuery("#search-string").blur(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
            me._checkForKeywordInsert();
	    });
	    
        jQuery("#search-string").keypress(function(event){
            me._checkForEnter(event);
	    });
	    // to search button
        jQuery("#search-button").click(function(event){
            me._doSearch();
	    });
	    // to close button
        jQuery("#close-search-button").click(function(event){
            me._hideSearch();
            // TODO: this should also unbind the TR tag click listeners?
	    });
    },
    
    
    /**
     * @method _checkForEnter
     * @private
     * @param {Object} event
     * 		keypress event object from browser
     * Detects if <enter> key was pressed and calls #_doSearch if it was
     */
	_checkForEnter : function(event) {
        var keycode;
        if (window.event) {
            keycode = window.event.keyCode;
        } else if (event) {
            keycode = event.which;
        } 
	  
        if (event.keyCode == 13) {
            this._doSearch();
        }
	},
	
    /**
     * @method _doSearch
     * @private
     * Sends out a Oskari.mapframework.request.common.SearchRequest with results callback #_showResults
     */
    _doSearch : function() {
        if(this._searchInProgess == true) {
            return;
        }

		var me = this;
        this._hideSearch();
        this._searchInProgess = true;
        jQuery("#search-string").addClass("search-loading");
        var searchText = jQuery("#search-string").val();
        
        var searchCallback = function(msg) {
        	me._showResults(msg);
        };
        var onCompletionCallback = function() {
        	me._enableSearch();
        };
        
        var request = this._sandbox.getRequestBuilder('SearchRequest')(encodeURIComponent(searchText), searchCallback, onCompletionCallback);
        this._sandbox.request(this.getName(), request);
    },
    /**
     * @method _showResults
     * @private
     * @param {Object} msg 
     * 			Result JSON returned by search functionality
     * Renders the results of the search or shows an error message if nothing was found.
     * Coordinates and zoom level of the searchresult item is written in data-href 
     * attribute in the tr tag of search result HTML table. Also binds click listeners to <tr> tags.
     * Listener reads the data-href attribute and calls #_resultClicked with it for click handling.
     */
    _showResults : function(msg) {
		// check if there is a problem with search string       
		var errorMsg = msg.error;
		var me = this;
		if (errorMsg != null) {
			jQuery("#search-results").html("<div>" + errorMsg + "</div>");
			jQuery("#search-container").removeClass("hidden");
            return;
		}
		
		// success
		var totalCount = msg.totalCount;
		if (totalCount == 0) {
			jQuery("#search-results").html(this._sandbox.getText('search_published_map_no_results'));
			jQuery("#search-container").removeClass("hidden");
		} else if (totalCount == 1) {
			// only one result, show it immediately
			var lon = msg.locations[0].lon;
			var lat = msg.locations[0].lat;
			var zoom = msg.locations[0].zoomLevel;
			
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
		} else {
			// many results, show all
			var allResults = "<table id='search-result-table'><thead><tr class='search-result-header-row'><th>" + 
				this._sandbox.getText('searchservice_search_result_column_name') + "</th><th>" + 
				this._sandbox.getText('searchservice_search_result_column_village') + "</th><th>" + 
				this._sandbox.getText('searchservice_search_result_column_type') + "</th></tr></thead><tbody>";
				
			for(var i=0; i<totalCount; i++) {
			
				if (i>=100) {
				  allResults += "<tr><td class='search-result-too-many' colspan='3'>" + this._sandbox.getText('search_published_map_too_many_results') + "</td></tr>";
				  break;
				}
				
				var name = msg.locations[i].name;
				var municipality = msg.locations[i].village;
				var type = msg.locations[i].type;
				var lon = msg.locations[i].lon;
				var lat = msg.locations[i].lat;
				var zoom = msg.locations[i].zoomLevel;
				var cssClass = "class='search-result-white-row'";
				if (i % 2 == 1) {
				    cssClass = "class='search-result-dark-row'";
				}
				var row = "<tr " + cssClass + " data-href='" + lon + "---" + lat + "---" + zoom + "'><td nowrap='nowrap'>" + name + "</td><td nowrap='nowrap'>" + municipality + "</td><td nowrap='nowrap'>" + type + "</td></tr>"; 
				
				allResults += row;               
		  }
		  
		  allResults += "</tbody></table>";
		  jQuery("#search-results").html(allResults);
		  jQuery("#search-container").removeClass("hidden");
		  // bind click events to search result table rows
		  // coordinates and zoom level of the searchresult is written in data-href attribute in the tr tag
		  jQuery('#search-result-table tbody tr[data-href]').addClass('clickable').click( 
		  	function() {
				me._resultClicked(jQuery(this).attr('data-href'));
			}).find('a').hover( function() {
				jQuery(this).parents('tr').unbind('click');
			}, function() {
				jQuery(this).parents('tr').click( function() {
					me._resultClicked(jQuery(this).attr('data-href'));
				});
		  }); 
		}
	},
	
    /**
     * @method _resultClicked
     * @private
     * @param {String} paramStr String that has coordinates and zoom level separated with '---'.
     * Click event handler for search result HTML table rows.
     * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
     */
	_resultClicked : function(paramStr) {
			var values = paramStr.split('---');
			var lon = values[0];
			var lat = values[1];
			var zoom = values[2];
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
	},
	
    /**
     * @method _enableSearch
     * @private
	 * Resets the 'search in progress' flag and removes the loading icon
     */
	_enableSearch : function() {
        this._searchInProgess = false;
		jQuery("#search-string").removeClass("search-loading");
	},
	
    /**
     * @method _hideSearch
     * @private
	 * Hides the search result and sends out Oskari.mapframework.request.common.HideMapMarkerRequest
     */
	_hideSearch : function() {
		jQuery("#search-container").addClass("hidden");
		
		/* Send hide marker request */				 
    	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('HideMapMarkerRequest')());
   },
   
	
    /**
     * @method _checkForKeywordClear
     * @private
	 * Clears the search text if the field has the default value (#_searchBoxMessage)
     */
	_checkForKeywordClear : function() {
        if (jQuery("#search-string").val() == this._searchBoxMessage) {
            jQuery("#search-string").val("");
        }
	},

    /**
     * @method _checkForKeywordInsert
     * @private
	 * Sets the search text to default value (#_searchBoxMessage) if the field is empty
     */
    _checkForKeywordInsert : function() {
        if (jQuery("#search-string").val() == "") {
            jQuery("#search-string").val(this._searchBoxMessage);
        }
    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
