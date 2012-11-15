/**
 * @class Oskari.framework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
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
	this.container = null;
	this.loc = null;
}, {
	/** @static @property __name plugin name */
	__name : 'SearchPlugin',

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
		if(mapModule) {
			this.pluginName = mapModule.getName() + this.__name;
		}
	},
	/**
	 * @method hasUI
	 * @return {Boolean} true
	 * This plugin has an UI so always returns true
	 */
	hasUI : function() {
		return true;
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
		var pluginLoc = this.getMapModule().getLocalization('plugin');
		this.loc = pluginLoc[this.__name];

		this.template = jQuery('<div class="search-div">' + 
		'<div class="search-textarea-and-button">' + 
		'<input placeholder="' + this.loc['placeholder'] + '" type="text" />' + 
		'<input type="button" value="' + this.loc['search'] + '" name="search" />' + '</div>' + 
		'<div class="results">' + '<div class="header"><div class="close icon-close" title="' + this.loc['close'] + '"></div></div>' + 
		'<div class="content">&nbsp;</div>' + '</div>' + '</div>');

		this.templateResultsTable = jQuery("<table class='search-results'><thead><tr>" + 
		"<th>" + this.loc['column_name'] + "</th>" + "<th>" + this.loc['column_village'] + "</th>" + "<th>" + this.loc['column_type'] + 
		"</th>" + "</tr></thead><tbody></tbody></table>");

		this.templateResultsRow = jQuery("<tr><td nowrap='nowrap'><a href='JavaScript:void(0);'></a></td><td nowrap='nowrap'></td><td nowrap='nowrap'></td></tr>");

		var ajaxUrl = null;
		if(this.conf && this.conf.url) {
			ajaxUrl = this.conf.url;
		} else {
			ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
		}

		this.service = Oskari.clazz.create('Oskari.mapframework.bundle.search.service.SearchService', ajaxUrl);
	},
	/**
	 * @method register
	 * Interface method for the plugin protocol
	 */
	register : function() {

	},
	/**
	 * @method unregister
	 * Interface method for the plugin protocol
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

		this.container.remove();
		for(p in this.eventHandlers ) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);
		this._map = null;
		this._sandbox = null;
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
	 * if not.
	 */
	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [event]);
	},
	/**
	 * @method _createUI
	 * @private
	 * Creates UI for search functionality and places it on the maps
	 * div where this plugin registered.
	 */
	_createUI : function() {
		var sandbox = this._sandbox;
		var me = this;

		var content = this.template.clone();
		this.container = content;

		// get div where the map is rendered from openlayers
		var parentContainer = jQuery('div.mapplugins.left');
		if(!parentContainer || parentContainer.length == 0) {
			// fallback to OL map div
			parentContainer = jQuery(this._map.div);
			content.addClass('mapplugin');
		}

		// bind events
		var me = this;
		var inputField = content.find('input[type=text]');
		// to text box
		inputField.focus(function() {
			sandbox.request(me.getName(), sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
			//me._checkForKeywordClear();
		});
		inputField.blur(function() {
			sandbox.request(me.getName(), sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
			//me._checkForKeywordInsert();
		});

		inputField.keypress(function(event) {
			me._checkForEnter(event);
		});
		// to search button
		content.find('input[type=button]').click(function(event) {
			me._doSearch();
		});
		// to close button
		content.find('div.close').click(function(event) {
			me._hideSearch();
			// TODO: this should also unbind the TR tag click listeners?
		});
		content.find('div.results').hide();
		parentContainer.append(content);
		// override default location if configured
		if(this._conf && this._conf.location) {
			if(this._conf.location.top) {
				content.css('top', this._conf.location.top);
			}
			if(this._conf.location.left) {
				content.css('left', this._conf.location.left);
			}
			if(this._conf.location.right) {
				content.css('right', this._conf.location.right);
			}
			if(this._conf.location.bottom) {
				content.css('bottom', this._conf.location.bottom);
			}
		}
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
		if(window.event) {
			keycode = window.event.keyCode;
		} else if(event) {
			keycode = event.which;
		}

		if(event.keyCode == 13) {
			this._doSearch();
		}
	},
	/**
	 * @method _doSearch
	 * @private
	 * Uses SearchService to make the actual search and calls  #_showResults
	 */
	_doSearch : function() {
		if(this._searchInProgess == true) {
			return;
		}

		var me = this;
		this._hideSearch();
		this._searchInProgess = true;
		var inputField = this.container.find('input[type=text]');
		inputField.addClass("search-loading");
		var searchText = inputField.val();

		var searchCallback = function(msg) {
			me._showResults(msg);
			me._enableSearch();
		};
		var onErrorCallback = function() {
			me._enableSearch();
		};
		this.service.doSearch(searchText, searchCallback, onErrorCallback);
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
		var resultsContainer = this.container.find('div.results');
		var header = resultsContainer.find('div.header');
		var content = resultsContainer.find('div.content');

		if(errorMsg != null) {
			content.html(errorMsg);
			resultsContainer.show();
			return;
		}

		// success
		var totalCount = msg.totalCount;
		if(totalCount == 0) {
			content.html(this.loc['noresults']);
			resultsContainer.show();
		} else if(totalCount == 1) {
			// only one result, show it immediately
			var lon = msg.locations[0].lon;
			var lat = msg.locations[0].lat;
			var zoom = msg.locations[0].zoomLevel;

			this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, false));
		} else {

			// many results, show all
			var table = this.templateResultsTable.clone();
			var tableBody = table.find('tbody');

			for(var i = 0; i < totalCount; i++) {
				if(i >= 100) {
					tableBody.append("<tr><td class='search-result-too-many' colspan='3'>" + this.loc['toomanyresults'] + "</td></tr>");
					break;
				}
				var lon = msg.locations[i].lon;
				var lat = msg.locations[i].lat;
				var zoom = msg.locations[i].zoomLevel;
				var dataLocation = lon + "---" + lat + "---" + zoom;

				var row = this.templateResultsRow.clone();
				row.attr('data-location', dataLocation);

				var name = msg.locations[i].name;
				var municipality = msg.locations[i].village;
				var type = msg.locations[i].type;
				var cells = row.find('td');
				var xref = jQuery(cells[0]).find('a');
				xref.attr('data-location', dataLocation);
				xref.append(name);
				xref.click(function() {
					me._resultClicked(jQuery(this).attr('data-location'));
					return false;
				});

				jQuery(cells[1]).append(municipality);
				jQuery(cells[2]).append(type);
				tableBody.append(row);
			}
			
			tableBody.find(":odd").addClass("odd");

			content.html(table);
			resultsContainer.show();

			/*
			 tableBody.find('tr[data-location]').addClass('clickable').click(
			 function() {
			 me._resultClicked(jQuery(this).attr('data-location'));
			 }).find('a').hover( function() {
			 jQuery(this).parents('tr').unbind('click');
			 }, function() {
			 jQuery(this).parents('tr').click( function() {
			 me._resultClicked(jQuery(this).attr('data-location'));
			 });
			 });
			 */
			
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
		this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, false));
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

		this.container.find('div.results').hide();

		/* Send hide marker request */
		this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('HideMapMarkerRequest')());
	}
}, {
	/**
	 * @property {String[]} protocol array of superclasses as {String}
	 * @static
	 */
	'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
