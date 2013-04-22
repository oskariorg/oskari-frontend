/**
 * @class Oskari.digiroad.bundle.featureselector.Flyout
 */
Oskari.clazz.define('Oskari.digiroad.bundle.featureselector.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this.loc = instance.getLocalization("gridheaders");
    
    this.grids = {};
    this.gridDataArrays = {};
    this.gridColumnArrays = {};

	this.template = null;
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName: function() {
        return 'Oskari.digiroad.bundle.featureselector.Flyout';
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
    setEl: function(el, width, height) {
        this.container = el[0];
		if(!jQuery(this.container).hasClass('featureselector')) {
			jQuery(this.container).addClass('featureselector');
		}
    },
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
    startPlugin: function() {
		var me = this;
		this.template = jQuery('<div></div>');
    },
	/**
	 * @method stopPlugin 
	 * 
	 * Interface method implementation, does nothing atm 
	 */
	stopPlugin: function() {

	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the flyout 
	 */
	getTitle: function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the flyout 
	 */
	getDescription: function() {
		return this.instance.getLocalization('desc');
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions: function() {

	},
	/**
	 * @method setState 
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState: function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	
	/**
	 * @method createUI
	 * Creates the UI for a fresh start
	 */
    createUI: function() {
        var me = this;
        var sandbox = me.instance.getSandbox();
        
		// clear container
		var cel = jQuery(this.container);
		cel.empty();

        var content = this.template.clone();
        cel.append(content);
    },

    /**
     * @method appendFeatures
     * Appends the features to the grid which the user has selected in the map.
     * @param {String} layerName e.g. 'nopeusrajoitus' or 'vaylatyyppi'
     * @param {Object[]} features an array of OpenLayers features which are about to be appended to the grid.
     */
    appendFeatures: function(layerName, features) {
        var f, feature, grid = this.grids[layerName], gridData = this.gridDataArrays[layerName];

        // WARN! Hack alert!
        // The css class .oskari-closed has a css attribute 'display: none;'
        // which doesn't play well with SlickGrid data rendering, so we're
        // setting it to use 'visibility: hidden;' instead when the features
        // are being rendered to the grid.
        var flyoutContainer = jQuery(this.container).closest('.oskari-flyout');
	    if(flyoutContainer.hasClass('oskari-closed')) {
	        flyoutContainer.removeClass('oskari-closed').addClass('featureselector-closed');
	    }
	    
    	for(var i = 0; i < features.length; ++i) {
            f = {};
            feature = features[i];
            for(attr in feature.data) {
                if(feature.data.hasOwnProperty(attr)) {
                    f[attr] = feature.data[attr];
                }
            }
            f.geometry = feature.geometry;
            gridData.push(f);
    	}

        grid.updateRowCount();
        grid.render();

        // Features rendered to the grid, safe to go back to 'display: none;'
        if(flyoutContainer.hasClass('featureselector-closed')) {
            flyoutContainer.removeClass('featureselector-closed').addClass('oskari-closed');
        }
    },

    /**
     * @method removeFeatures
     * Removes the features from the grid when they are no longer selected on the map.
     * @param {String} layerName e.g. 'nopeusrajoitus' or 'vaylatyyppi'
     * @param {Object[]} features an array of OpenLayers features which are about to be removed from the grid.
     */
    removeFeatures: function(layerName, features) {
        var oid, row_index, grid = this.grids[layerName], gridData = this.gridDataArrays[layerName];

        if(!features) {
            gridData.length = 0;
            grid.setData(gridData);
        } else {
        	for(var i = 0; i < features.length; ++i) {
        		oid = features[i].data[this.instance.targetLayers[layerName].objectId];
        		row_index = this._findGridRowIndexByOid(gridData, oid);
        		if(row_index !== null) {
                   gridData.splice(row_index, 1);
                }
        	}
        }

        grid.updateRowCount();
        grid.render();
    },

    /**
     * @method addGrid
     * Adds the grid to the view when the user adds the corresponding layer to the map.
     * @param {String} layerName e.g. 'nopeusrajoitus' or 'vaylatyyppi'
     */
    addGrid: function(layerName) {
        if(!layerName) {
            return null;
        }

        var domContainer = jQuery('<div id="'+layerName+'_grid"></div>'),
            gridData = this.gridDataArrays[layerName] = [],
            gridHeadersBase = this.gridColumnArrays[layerName] = this._gridHeaders(layerName),
            grid = null,
            cel = jQuery(this.container),
            h2 = layerName,
            objectId = [{
                "id": "object_id",
                "name": "Tunnus",
                "field": this.instance.targetLayers[layerName].objectId
            }];
        
        var gridHeaders = objectId.concat(gridHeadersBase);

        grid = this._createGrid(layerName, domContainer, gridData, gridHeaders);
        cel.append(jQuery('<h2 id="'+layerName+'">'+h2+'</h2>'));
        cel.append(domContainer);
        grid.init();
        this.grids[layerName] = grid;
    },

    /**
     * @method removeGrid
     * Removes the grid from the view when the user removes the corresponding layer from the map.
     * @param {String} layerName e.g. 'nopeusrajoitus'
     */
    removeGrid: function(layerName) {
        if(!layerName) {
            return null;
        }

        delete this.gridDataArrays[layerName];
        delete this.gridColumnArrays[layerName];
        delete this.grids[layerName];
        jQuery('h2').remove('#'+layerName);
        jQuery('div').remove('#'+layerName+'_grid');
    },

    /**
     * @method _findGridRowIndexByOid
     * @param {Object[]} grid_data the data array from which we perform the lookup
     * @param {String} oid the object id property of a feature.
     * @return {Integer} the index of the searched feature, or null if not found.
     */
    _findGridRowIndexByOid: function(grid_data, oid) {
    	for(var i = 0; i < grid_data.length; ++i) {
            var elem_oid = grid_data[i][this.instance.targetLayers[layerName].objectId];
    		if(elem_oid === oid) {
    			return i;
    		}
    	}
    	return null;
    },

    /**
     * @method _createGrid
     * @param {String} layerName e.g. 'nopeusrajoitus'
     * @param {Object} insertTo a jQuery DOM object where the grid is about to be inserted to
     * @param {Object[]} dataArray array of objects of grid data
     * @param {Object[]} columnArray array of objects representing the grid columns
     * @return {Object} grid Returns a new SlickGrid grid
     */
    _createGrid: function(layerName, insertTo, dataArray, columnArray) {
        var me = this,
            sandbox = me.instance.sandbox,
            grid,
            options = {
                editable: true,
                autoEdit: false,
                enableColumnReorder: false,
                explicitInitialization: true,
                autoHeight: true
            };

        grid = new Slick.Grid(insertTo, dataArray, columnArray, options);

        var commitEditedFeaturesCallback = function(response) {
            var errors = me.instance.getLocalization("errors")['dataSendFailed'];
            if(!response) {
                alert(errors);
            } else {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var loc = me.instance.getLocalization('notification').featureEdited;
                dialog.show(loc.title, loc.message);
                dialog.fadeout();
            }
        };

        var onMouseFunction = function(e, highlightType) {
            var row = grid.getCellFromEvent(e).row,
                cell = grid.getCellFromEvent(e).cell,
                oid = dataArray[row][me.instance.targetLayers[layerName].objectId],
                feature = me.instance.features[oid],
                columnId = grid.getColumns()[cell].id;
            
            var eventBuilder = sandbox.getEventBuilder("FeatureHighlightEvent");
            if(eventBuilder) {
                var event = eventBuilder(layerName, feature, highlightType);
                sandbox.notifyAll(event);
            }
        };

        grid.onBeforeEditCell.subscribe(function(e, args) {
            if(!sandbox.getUser().isLoggedIn()) {
                return false;
            }
        });
        grid.onCellChange.subscribe(function(e, args) {
            var service = sandbox.getService("Oskari.digiroad.bundle.myplaces2.service.MyPlacesService");
            service.saveEditedFeature(layerType, layerName, args.item, commitEditedFeaturesCallback);
        });
        grid.onMouseEnter.subscribe(function(e) {
            onMouseFunction(e, "highlight");
        });
        grid.onMouseLeave.subscribe(function(e) {
            onMouseFunction(e, "unHighlight");
        });

        return grid;
    },

    /**
     * @method _gridHeaders
     * @param {String} layerName
     * @return {Object} header
     */
    _gridHeaders: function(layerName) {
        var header = this.instance.targetLayers[layerName].headers;

        if(!header) {
            return null;
        }

        for(var i = 0; i < header.length; ++i) {
            var col = header[i];
            
            switch(col.editor) {
	            case "integer":
	                col.editor = Slick.Editors.Integer;
	                break;
	            case "select":
	                col.editor = Slick.Editors.SelectOption;
	                break;
	            case "text":
	            	col.editor = Slick.Editors.Text;
	            	break;
	        }
            /*var formatter = this._getFormatterForHeader(col.id);
            if(formatter) {
                col.formatter = formatter['formatter'];
                col.options = formatter['options'];
            }*/
        }

        return header;
    },
    
    /**
     * @method _getFormatterForHeader
     * Returns a SlickGrid formatter and options for SelectOption.
     * Formatter displays the integer values as strings for a friendlier UX.
     * @param {String} id column id
     * @return {Object} formatter and options as keys, or null if not found from localization.
     */
    _getFormatterForHeader: function(id) {
        var mappings = this.instance.getLocalization("mappings")[id];
        if(mappings) {
            return {
                'formatter': function(row, cell, value, columnDef, dataContext) {
                    return mappings["int"][value];
                },
                'options': mappings["string"]
            }
        } else {
            return null;
        }
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ['Oskari.userinterface.Flyout']
});
