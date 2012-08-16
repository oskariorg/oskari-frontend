/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.search.service.SearchService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.service.SearchService', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual search implementation
 */
function(searchUrl) {

    /* searchUrl url that will give us results */
    this._searchUrl = searchUrl;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.mapframework.bundle.search.service.SearchService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "SearchService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method doSearch
     * 
     * Makes the actual ajax call to search service implementation
	 * @param {String}
	 *            searchString the query to search with
	 * @param {Function}
	 *            onSuccess callback method for successful search 
	 * @param {Function}
	 *            onComplete callback method for search completion
     */
    doSearch : function(searchString, onSuccess, onError) {
        var lang = Oskari.getLang();
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/json");
              }
             },
            url : this._searchUrl,
            data : "searchKey=" + searchString + "&Language=" + lang,
            error : onError,
            success : onSuccess
        });
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance *//**
 * @class Oskari.mapframework.bundle.search.SearchBundleInstance
 *
 * Main component and starting point for the "search" functionality. 
 * Provides search functionality for the map.
 * 
 * See Oskari.mapframework.bundle.search.SearchBundle for bundle definition. 
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.search.SearchBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
    this.service = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Search',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	"start" : function() {
		var me = this;

		if(me.started) {
            return;
		}

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		this.localization = Oskari.getLocalization(this.getName());
		
		var ajaxUrl = null;
		if(this.conf && this.conf.url) {
		    ajaxUrl = this.conf.url;
		}
		else {
		    ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
		} 
		
        this.service = 
            Oskari.clazz.create('Oskari.mapframework.bundle.search.service.SearchService', ajaxUrl);
		
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		sandbox.request(this, request);

        //sandbox.registerAsStateful(this.mediator.bundleId, this);
		// draw ui
		me.createUi();
	},
	/**
	 * @method init
	 * implements Module protocol init method - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

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

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

        //this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.publisher.Flyout
	 * Oskari.mapframework.bundle.publisher.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.search.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.search.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the component 
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the component 
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "selected layers" functionality
	 */
	createUi : function() {
		var me = this;
		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.search.SearchBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;

    this.template = null;
    this.templateResultTable = null;
    this.templateResultTableHeader = null;
    this.templateResultTableRow = null;
        
    this.resultHeaders = [];
    // last search result is saved so we can sort it in client
    this.lastResult = null;
    // last sort parameters are saved so we can change sort direction if the same column is sorted again
    this.lastSort = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.search.Flyout';
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
        if(!jQuery(this.container).hasClass('search')) {
            jQuery(this.container).addClass('search');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery('<div class="searchContainer">' + 
                '<div class="controls">' +
                //'<div class="search_field_div" style="float:left"><input class="search_field" type="text" name="search" /></div>' +
                //'<div><input class="search_button" type="button" name="btn_find" /></div></div>' +
                '<input class="search_field" type="text" name="search" />' +
                '<input class="search_button" type="button" name="btn_find" /></div>' +    
                '<div><br></div><div class="info">' +
                '</div><div><br></div>' + 
                '<div class="resultList">'+
                '</div>' + 
            '</div>');
        this.templateResultTable = jQuery('<table class="search_result"><thead><tr></tr></thead><tbody></tbody></table>');
        this.templateResultTableHeader = jQuery('<th><a href="JavaScript:void(0);"></a></th>');
        
        this.templateResultTableRow = jQuery('<tr>' + 
                '<td><a href="JavaScript:void(0);"></a></td>' + 
                '<td></td>' + 
                '<td></td>' + 
            '</tr>');
            
        this.resultHeaders = [
        {
            title : 'Nimi',
            prop : 'name'
        },
        {
            title : 'Kylä',
            prop : 'village'
        },
        {
            title : 'Tyyppi',
            prop : 'type'
        }
        ];
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
        var sandbox = me.instance.getSandbox();

        var flyout = jQuery(this.container);
        flyout.empty();
        var searchContainer = this.template.clone();
        var field = searchContainer.find('input[name=search]');
        
        this._bindClearButton(field);
        
        
        var doSearch = function() {
            
            field.attr('disabled','disabled');
            button.attr('disabled','disabled');
            
            var resultList = searchContainer.find('div.resultList');
            resultList.empty();
            // TODO: make some gif go round and round so user knows something is happening
            me.instance.service.doSearch(field.val(), 
                function(data) {
                    field.removeAttr('disabled');
                    button.removeAttr('disabled');
                    me._renderResults(data, field.val());
                }, 
                function(data) {
                    field.removeAttr('disabled');
                    button.removeAttr('disabled');
                    alert('vihre!');
                }
            );
            
        }; 
        
        
        var button = searchContainer.find('input[name=btn_find]');
        var buttonLocale = this.instance.getLocalization('searchButton');
        
        button.val(buttonLocale);
        button.bind('click', doSearch);
        
        field.keypress(function(event) {
		  if ( event.which == 13 ) {
		     doSearch();
		   }
		});

        
        flyout.append(searchContainer);

    },_bindClearButton : function(field) {
    	var clearButton = jQuery('<div style="margin-left: 0px; position: relative; display: inline-block; left: -20px; top: 3px;"><img src="/Oskari/applications/paikkatietoikkuna.fi/full-map/icons/icon-close.png"/></div>');
    	
    	clearButton.bind('click', function() {
    		field.val('');
    		field.trigger('keyup');
    	});
    	field.after(clearButton);
    },
    _renderResults : function(result, searchKey) {
        
        
        if(!result || !result.totalCount) {
        	return;
        } 
        
        
        var resultList = jQuery(this.container).find('div.resultList');
        this.lastResult = result;
        var me = this;
        
        
        var info = jQuery(this.container).find('div.info');
        info.empty();
        
        // error handling
        if(result.totalCount == -1) {
            resultList.append('searchservice_search_alert_title: ' + result.errorText);
            return;
        } else if(result.totalCount == 0) {
            resultList.append(this.instance.getLocalization('searchservice_search_alert_title')+':'+ this.instance.getLocalization('searchservice_search_not_found_anything_text'));
            return;
        } else {
        	info.append(
        		this.instance.getLocalization('searchResultCount') + 
        		result.totalCount + 
        		this.instance.getLocalization('searchResultDescription'));
        }
        
        if(result.totalCount == 1) {
            // move map etc
            me._resultClicked(result.locations[0]);
            // close flyout
            this.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
        }
        // render results
        var table = this.templateResultTable.clone();
        var tableHeaderRow = table.find('thead tr');
        var tableBody = table.find('tbody');
        // header reference needs some closure magic to work here
        var headerClosureMagic = function(scopedValue) {
            return function() {
                // clear table for sorted results
                tableBody.empty();
                // default to descending sort
                var descending = false;
                // if last sort was made on the same column -> change direction
                if(me.lastSort && me.lastSort.attr == scopedValue.prop) {
                    descending = !me.lastSort.descending;
                }
                // sort the results
                me._sortResults(scopedValue.prop, descending);
                // populate table content 
                me._populateResultTable(tableBody);
                // apply visual changes
                var headerContainer = tableHeaderRow.find('a:contains(' + scopedValue.title + ')');
                tableHeaderRow.find('th').removeClass('asc');
                tableHeaderRow.find('th').removeClass('desc');
                if(descending) {
                	headerContainer.parent().addClass('desc');
                }
                else {
                    headerContainer.parent().addClass('asc');
                }
            };
        };
        for(var i = 0; i < this.resultHeaders.length; ++i) {
            var header = this.templateResultTableHeader.clone();
            var link = header.find('a');
            link.append(this.resultHeaders[i].title);
            link.bind('click', headerClosureMagic(this.resultHeaders[i]));
            tableHeaderRow.append(header);
        }
        
                
        
        this._populateResultTable(tableBody);
        resultList.append('<div><h3>Tulokset:' +result.totalCount +' hakutulosta haulla '+searchKey+'</h3></div>');
        resultList.append(table);
    },
    _populateResultTable : function(resultsTableBody) {
        var me = this;
        // row reference needs some closure magic to work here
        var closureMagic = function(scopedValue) {
            return function() {
                me._resultClicked(scopedValue);
            };
        };
        var locations = this.lastResult.locations;
        for(var i = 0; i < locations.length; ++i) {
            var row = locations[i];
            var resultContainer = this.templateResultTableRow.clone();
            var cells = resultContainer.find('td');
            var titleCell = jQuery(cells[0]);
            var title = titleCell.find('a');
            title.append(row.name);
            title.bind('click', closureMagic(row));
            jQuery(cells[1]).append(row.village);
            jQuery(cells[2]).append(row.type);
            resultsTableBody.append(resultContainer);
        }
    },
    _resultClicked : function(result) {
        var me = this;
        var popupId = "searchResultPopup";
        var sandbox = this.instance.sandbox;
        // good to go
        var moveReqBuilder = this.instance.sandbox.getRequestBuilder('MapMoveRequest');
        sandbox.request(me.instance.getName(), 
            moveReqBuilder(result.lon, result.lat, result.zoomLevel, false));

        var content = [{
            html : "<h3>" + result.name + "</h3>" + 
                "<p>" + result.village + '<br/>' +
                    result.type  + "</p>",
            actions : {
                "Sulje" : function() {
                    var request = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(popupId);
                    sandbox.request(me.instance.getName(), request);
                }
            }
        }];

        var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')
            (popupId, 
                "Hakutulos", 
                content, 
                new OpenLayers.LonLat(result.lon, result.lat), 
                true);
        sandbox.request(this.instance.getName(), request);
    },
    /**
     * @method _sortResults
     * Sorts the last search result by comparing given attribute on the search objects
     * @private
     * @param {String} pAttribute attributename to sort by (e.g. result[pAttribute])
     * @param {Boolean} pDescending true if sort direction is descending
     */
    _sortResults : function(pAttribute, pDescending) {
      var me = this;
      if(!this.lastResult) {
          return;
      }
      this.lastSort = {
          attr : pAttribute,
          descending : pDescending
      };
      this.lastResult.locations.sort(function(a,b) {
            return me._searchResultComparator(a,b,pAttribute, pDescending);
      });
        
    },
    
    /**
     * @method _searchResultComparator
     * Compares the given attribute on given objects for sorting search result objects.
     * @private
     * @param {Object} a search result 1
     * @param {Object} b search result 2
     * @param {String} pAttribute attributename to sort by (e.g. a[pAttribute])
     * @param {Boolean} pDescending true if sort direction is descending
     */
    _searchResultComparator : function(a, b, pAttribute, pDescending) {
        var nameA = a[pAttribute].toLowerCase();
        var nameB = b[pAttribute].toLowerCase();
        
        var value = 0;
        if (nameA == nameB || 'name' == pAttribute) { // Because problem with address 1 and address 10 then id are ranked right 
        	nameA = a.id;
        	nameB = b.id;
        }
        if (nameA < nameB) {
        	value = -1;
        }
        else if (nameA > nameB) {
            value = 1;
        }
        if(pDescending) {
            value = value * -1;
        }
        return value;
    }

}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.mapframework.bundle.search.Tile
 * 
 * Renders the "search" tile.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.search.Tile',

	  /**
	   * @method create called automatically on construction
	   * @static
	   * @param {Oskari.mapframework.bundle.search.SearchBundleInstance} instance
	   * 		reference to component that created the tile
	   */
	  function(instance) {
	    this.instance = instance;
	    this.container = null;
	    this.template = null;
	  }, {
	    /**
	     * @method getName
	     * @return {String} the name for the component 
	     */
	    getName : function() {
	      return 'Oskari.mapframework.bundle.search.Tile';
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
	      this.container = jQuery(el);
	    },
	    /**
	     * @method startPlugin
	     * Interface method implementation, calls #refresh() 
	     */
	    startPlugin : function() {
	      this.refresh();
	    },
	    /**
	     * @method stopPlugin 
	     * Interface method implementation, clears the container 
	     */
	    stopPlugin : function() {
	      this.container.empty();
	    },
	    /**
	     * @method getTitle 
	     * @return {String} localized text for the title of the tile 
	     */
	    getTitle : function() {
	      return this.instance.getLocalization('title');
	    },
	    /**
	     * @method getDescription 
	     * @return {String} localized text for the description of the tile 
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
	      console.log("Tile.setState", this, state);
	    },
	    /**
	     * @method refresh
	     * Creates the UI for a fresh start
	     */
	    refresh : function() {
	      var me = this;
	      var instance = me.instance;
	      var cel = this.container;
	      var tpl = this.template;
	      var sandbox = instance.getSandbox();

	      var status = cel.children('.oskari-tile-status');
	      
//	      status.empty();
//	      status.append('(' + layers.length + ')');

	    }
	  }, {
	    /**
	     * @property {String[]} protocol
	     * @static 
	     */
	    'protocol' : ['Oskari.userinterface.Tile']
	  });
