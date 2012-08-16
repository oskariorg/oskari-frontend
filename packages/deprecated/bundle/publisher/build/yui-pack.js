/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundleInstance
 *
 * Main component and starting point for the "selected layers" functionality. 
 * Lists all the layers available in Oskari.mapframework.sandbox.Sandbox.findAllSelectedMapLayers()
 * and updates UI if maplayer related events (#eventHandlers) are received.
 * 
 * See Oskari.mapframework.bundle.publisher.PublisherBundle for bundle definition. 
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publisher.PublisherBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Publisher',
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

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		this.localization = Oskari.getLocalization(this.getName());
		
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
        /**
         * @method AfterMapLayerRemoveEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
         * 
         * Calls flyouts handleLayerSelectionChanged() method
         */
        'AfterMapLayerRemoveEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method AfterMapLayerAddEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
         * 
         * Calls flyouts handleLayerSelectionChanged() method
         */
        'AfterMapLayerAddEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method MapLayerEvent
         * @param {Oskari.mapframework.event.common.MapLayerEvent} event
         */
        'MapLayerEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method AfterMapMoveEvent
         * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
         */
        'AfterMapMoveEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleMapMoved();
            // great idea if events had creators but they dont :(
            //if(event._creator != "PreviewMapModule") {
            //}
        }
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
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Tile', this);
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
 * @class Oskari.mapframework.bundle.publisher.Flyout
 *
 * Renders the "publish wizard" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;

    this.template = null;
    this.view = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.publisher.Flyout';
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
        if(!jQuery(this.container).hasClass('publisher')) {
            jQuery(this.container).addClass('publisher');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery('<div></div>');

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
        
        var sandbox = me.instance.getSandbox();
        
        // check if the user is logged in
        
        //if(!sandbox.getUser().isLoggedIn()) {
            if(false) {
            this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.NotLoggedIn', 
                this.instance, 
                this.instance.getLocalization('NotLoggedView'));
        }
        else {
            // proceed with publisher view
            this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.BasicPublisher', 
                this.instance, 
                this.instance.getLocalization('BasicView'));    
        }
        
        this.view.render(flyout);
    },
    handleLayerSelectionChanged : function() {
        if(this.view && this.view.handleLayerSelectionChanged) {
            this.view.handleLayerSelectionChanged();
        }
    },
    
    handleMapMoved : function() {
        if(this.view && this.view.handleMapMoved) {
            this.view.handleMapMoved();
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.mapframework.bundle.publisher.Tile
 * 
 * Renders the "publish wizard" tile.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.publisher.Tile',

	  /**
	   * @method create called automatically on construction
	   * @static
	   * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
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
	      return 'Oskari.mapframework.bundle.publisher.Tile';
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
/**
 * @class Oskari.mapframework.bundle.publisher.view.NotLoggedIn
 * Renders the "publisher" view for users that haven't logged in.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.NotLoggedIn',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
 * 		reference to component that created this view
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery("<p></p>");
	this.loc = localization;
}, {
	render : function(container) {
	    var me = this;
		var content = this.template.clone();
		content.append(this.loc.text);
		container.append(content);
	}
});
/**
 * @class Oskari.mapframework.bundle.publisher.view.BasicPublisher
 * Renders the "publisher" view for basic use case
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.BasicPublisher',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
 * 		reference to component that created this view
 */
function(instance, localization, pConfig) {
    var me = this;
	this.instance = instance;
	this.template = jQuery('<div class="basic_publisher">' +
	       '<div class="form">' +
               '<div class="field">' +
                   '<div class="help icon-info" title="TODO: tooltip"></div>' +
                   '<label for="domain">' + localization.domain.label + '</label><br clear="all" />' +
                   '<input name="domain" placeholder="' + localization.domain.placeholder + '"/>' +
               '</div>' +
               '<div class="field">' +
                   '<div class="help icon-info" title="TODO: tooltip"></div>' +
                   '<label for="name">' + localization.name.label + '</label><br clear="all" />' +
                   '<input name="name" placeholder="' + localization.name.placeholder + '"/>' +
               '</div>' +
               '<div class="field">' +
                   '<div class="help icon-info" title="TODO: tooltip"></div>' +
                   '<label for="language">' + localization.language.label + '</label><br clear="all" />' +
                   '<select name="language"></select>' +
               '</div>' +
               '<div class="options">' +
               '</div>' +
               '<div class="buttons">' +
               '</div>' +
           '</div>' +
           '<div class="map">' +
                localization.preview +
               '<div class="preview">' +
               '</div>' +
               '<div class="maplocation">' +
                localization.location +
                    '<div class="locationdata"></div>' +
               '</div>' +
           '</div>' +
	    '</div>');
	
    this.templateHelp = jQuery('<div class="help icon-info"></div>');
    this.templateTool = jQuery('<div class="tool "><input type="checkbox"/><span></span></div>');
    this.templateSizeOptionTool = jQuery('<div class="tool "><input type="radio" name="size" /><span></span></div>');
    this.templateCustomSize = jQuery('<div class="customsize"><input type="text" disabled="true" name="width" placeholder="' + 
            localization.sizes.width + '"/> x <input type="text" disabled="true" name="height" placeholder="' + 
            localization.sizes.height +  '"/></div>');
    
    this.templateLayerRow = jQuery('<tr data-id="">' + 
                '<td><input type="checkbox" /></td>' + 
                '<td></td>' + 
            '</tr>');
    this.templateUseAsDefault = jQuery('<a href="JavaScript:void(0);">' + 
        localization.layers.useAsDefaultLayer  + '</a>');
        
    this.tools = [
    {
        id : 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
        name : 'Mittakaavajana',
        selected : false
    },
    {
        id : 'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
        name : 'Indeksikartta',
        selected : false
    },
    {
        id : 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
        name : 'Mittakaavan säätö',
        selected : true,
        config : {
            location : {
                top : '10px',
                left : '10px'
            }
        }
    },
    {
        id : 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
        name : 'Osoite- ja paikannimihaku',
        selected : false
    } /*,
    {
        id : 'coordinates',
        name : 'Kartan keskipisteen näyttö',
        selected : false
    }*/
    ];
    this.showLayerSelection = false;
    
    this.sizeOptions = [
    {
        id : 'small',
        width : 375,
        height : 300
    },
    {
        id : 'medium',
        width : 500,
        height : 400,
        selected : true // default option
    },
    {
        id : 'large',
        width : 640,
        height : 512
    },
    {
        id : 'custom',
        width : 'max 1000',
        height : 1000,
        minWidth : 50,
        minHeight : 20,
        maxWidth : 1000,
        maxHeight : 1000
    }
    ];
     
    this.loc = localization;
	//this.config = pConfig;
    this.config = {
        layers : {
            promote  : [
            {
                text : 'Haluatko näyttää myös ilmakuvia?',
                id : [24] // , 203 
            }
            ],
            preselect : 'base_35'
        }
    };
	this.accordion = null;

	this.setupLayersList();
	
	this.defaultBaseLayer = null;
	if(this.config.layers.preselect) {
	    this.defaultBaseLayer = this.config.layers.preselect; 
	}
	this.maplayerPanel = null;
	this.previewMap = null;
	this.mainPanel = null;
}, {
	render : function(container) {
	    var me = this;
		var content = this.template.clone();
		this.mainPanel = content;
        
        // language options are rendered based on localization           
        var languageSelection = content.find('select[name=language]');
        var langOpts = this.loc.language.options;
        for(var opt in langOpts) {
            languageSelection.append('<option value="' + opt +'">' + langOpts[opt] + '</option>');
        }
        
		var mapElement = content.find('div.map div.preview');
        
		this.map = this._createMap();
        this.map.render(mapElement.get()[0]);
        
        this.handleMapMoved();
        
        container.append(content);
        
        var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion = accordion;
        accordion.addPanel(this._createSizePanel());
        accordion.addPanel(this._createToolsPanel());
        
        this.maplayerPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        this.maplayerPanel.setTitle(this.loc.layers.label);
        this._populateMapLayerPanel();
        
        accordion.addPanel(this.maplayerPanel);
        accordion.insertTo(content.find('div.options'));

        // buttons
        this._addButtons(content);
	},
	_createMap : function() {
        var module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Preview", false, false, true, false);
        this.previewMap = module;
        var sandbox = this.instance.getSandbox();
        var map = sandbox.register(module);
        
        var plugins = [];
        // NOTE: DO NOT ADD ANY PLUGINS THAT REGISTER REQUESTHANDLERS
        // otherwise main map will stop working correctly 
        plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
        plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
        plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
        plugins.push('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin');
        
        for(var i = 0; i < plugins.length; i++) {
            var plugin = Oskari.clazz.create(plugins[i]);
            module.registerPlugin(plugin);
        }
        module.setStealth(true);
        module.start(sandbox);
        
        // mouse control
        var mouseControls = new OpenLayers.Control.PorttiMouse({
            sandbox : sandbox,
            mapmodule : module
        });
        module.addMapControl('mouseControls', mouseControls);
        
        // hax to get selected layers on map since requests
        // have already been processed before this is loaded
        // FIXME: we need to filter the layers against publish rights 
        module.updateCurrentState();

        return map;
	},
	_createSizePanel : function() {
	    var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.size.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.templateHelp.clone();
        tooltipCont.attr('title', 'TODO: tooltip');
        contentPanel.append(tooltipCont);
        // content
        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=size]:checked').val();
                var customInputs = contentPanel.find('div.customsize input');
                if(size == 'custom') {
                    customInputs.removeAttr("disabled");
                    /*
                    var width = container.find('div.customsize input[name=width]').val();
                    var height = container.find('div.customsize input[name=height]').val();
                     */
                }
                else {
                    customInputs.attr("disabled",true);
                    
                    for(var i = 0; i < me.sizeOptions.length; ++i) {
                        var option = me.sizeOptions[i]; 
                        if(option.id == size) {
                            var mapElement = me.mainPanel.find('div.map div.preview');
                            mapElement.width(option.width);
                            mapElement.height(option.height);
                            break;
                        }
                    }
                }
            };
        };
        for(var i = 0; i < this.sizeOptions.length; ++i) {
            var option = this.sizeOptions[i];
            var toolContainer = this.templateSizeOptionTool.clone();
            var label = this.loc.sizes[option.id];
            label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            toolContainer.find('span').append(label);
            
            if(option.selected) {
                toolContainer.find('input').attr('checked','checked');
                var mapElement = me.mainPanel.find('div.map div.preview');
                mapElement.width(option.width);
                mapElement.height(option.height);
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr('value', option.id);
            toolContainer.find('input').change(closureMagic(option));
        }
        var customSizes = this.templateCustomSize.clone();
        contentPanel.append(customSizes);
        
        return panel;
	},
    _populateMapLayerPanel : function() {
        
        var me = this;
        var contentPanel = this.maplayerPanel.getContainer();
        
        // tooltip
        var tooltipCont = this.templateHelp.clone();
        tooltipCont.attr('title', 'TODO: tooltip');
        contentPanel.append(tooltipCont);
        
        // tool selection
        var toolContainer = this.templateTool.clone();
        toolContainer.find('span').append(this.loc.layerselection.label);
        if(this.showLayerSelection) {
            toolContainer.find('input').attr('checked','checked');
        }
        contentPanel.append(toolContainer);
        contentPanel.append(this.loc.layerselection.info);
        toolContainer.find('input').change(function() {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                me.showLayerSelection = isChecked;
                contentPanel.empty();
                me._populateMapLayerPanel();
            }
        );
        
        if(!this.showLayerSelection) {
            return;
        }
        // if layer selection = ON -> show content
        var layerTable = jQuery('<table></table>');
        var closureMagic = function(row, layer) {
            return function() {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                var cells = row.find('td');
                layer.selected = isChecked;
                if(isChecked) {
                    me.defaultBaseLayer = layer.id;
                }
                else if(me.defaultBaseLayer == layer.id) {
                    me.defaultBaseLayer = null;
                }
            };
        };
        for(var i=0; i< this.layers.length; ++i) {
            var layer = this.layers[i];
            var row = this.templateLayerRow.clone();
            row.attr('data-id', layer.id);
            var cells = row.find('td');
            if(this.defaultBaseLayer && this.defaultBaseLayer == layer.id) {
                jQuery(cells[0]).find('input').attr('checked', 'checked');
                layer.selected = true;
            }
            jQuery(cells[0]).find('input').change(closureMagic(row, layer));
            jQuery(cells[1]).append(layer.name);
            layerTable.append(row);
        }
        contentPanel.append(layerTable);
        
        if(this.config.layers.promote && 
            this.config.layers.promote.length > 0) {
          this._populateLayerPromotion(contentPanel);
        }
    },
    /*
    _defaultLayerChanged : function(chosenRowsCell) {
        var me = this;
        
        var contentPanel = this.maplayerPanel.getContainer();
        contentPanel.empty();
        this._populateMapLayerPanel();
    },
    */
    _populateLayerPromotion : function(contentPanel) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
        var closureMagic = function(layer) {
            return function() {
                sandbox.request(me.instance.getName(), addRequestBuilder(layer.getId(), true));
            };
        };
        // TODO: check that layer isn't added yet
        for(var i=0; i< this.config.layers.promote.length; ++i) {
            var promotion = this.config.layers.promote[i];
            var promoLayerList = jQuery('<ul></ul>');
            var added = false;
            for(var j=0; j< promotion.id.length; ++j) {
                
                if(!sandbox.isLayerAlreadySelected(promotion.id[j])) {
                    var item = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
                    var layer = sandbox.findMapLayerFromAllAvailable(promotion.id[j]);
                    // promo layer found in system
                    if(layer) {
                        var link = item.find('a');
                        link.append(layer.getName());
                        link.bind('click', closureMagic(layer));
                        promoLayerList.append(item);
                        added = true;
                    }
                }
            }
            if(added) {
                contentPanel.append(promotion.text);
                contentPanel.append(promoLayerList);
            }  
        }  
    },
    
    
    handleLayerSelectionChanged : function() {
        this.setupLayersList();
        var contentPanel = this.maplayerPanel.getContainer();
        contentPanel.empty();
        this._populateMapLayerPanel();
    },
    handleMapMoved : function() {
        
        var mapVO = this.instance.sandbox.getMap();
        var lon = mapVO.getX();
        var lat = mapVO.getY();
        var zoom = mapVO.getZoom();
        this.previewMap.moveMapToLanLot(new OpenLayers.LonLat(lon, lat));
        this.previewMap.setZoomLevel(zoom, true);
        this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
    },
    setupLayersList : function() {
        this.layers = [];
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i=0; i < selectedLayers.length; ++i) {
            // TODO: if rights then
            var layer = {
                id: selectedLayers[i].getId(),
                name: selectedLayers[i].getName()
            };
            this.layers.push(layer);
        }
    },
    
    _createToolsPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.tools.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.templateHelp.clone();
        tooltipCont.attr('title', 'TODO: tooltip');
        contentPanel.append(tooltipCont);
        
        var toolChanged = function(tool, enabled) {
            if(!tool.plugin) {
                tool.plugin = Oskari.clazz.create(tool.id, tool.config);
                me.previewMap.registerPlugin(tool.plugin);
            }
            if(enabled) {
                tool.plugin.startPlugin(me.instance.sandbox);
            }
            else {
                tool.plugin.stopPlugin(me.instance.sandbox);
            }
        } 
        
        // content
        var closureMagic = function(tool) {
            return function() {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                tool.selected = isChecked;
                toolChanged(tool, isChecked);
            };
        };
        for(var i = 0; i < this.tools.length; ++i) {
            var toolContainer = this.templateTool.clone();
            toolContainer.find('span').append(this.tools[i].name);
            if(this.tools[i].selected) {
                toolContainer.find('input').attr('checked','checked');
                toolChanged(this.tools[i], true);
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').change(closureMagic(this.tools[i]));
        }       
        
        return panel;
    },
    _addButtons : function(container) {
        var me = this;
        var buttonCont = container.find('div.buttons');
        var saveBtn = jQuery('<input type="button" name="save" />');
        saveBtn.val(this.loc.buttons.save);
        saveBtn.bind('click', function() {
            me._gatherSelections(container);
        });
        
        var cancelBtn = jQuery('<input type="button" name="cancel" />');
        cancelBtn.val(this.loc.buttons.cancel);
        cancelBtn.bind('click', function() {
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
        });
        
        buttonCont.append(cancelBtn);
        buttonCont.append(saveBtn);
    },
    _gatherSelections : function(container) {
        
        var domain = container.find('input[name=domain]').val();
        if(!this._checkLength(domain, 1)) {
            alert(this.loc.error.domain);
            return;
        }
        if(domain.startsWith('http') || domain.startsWith('www')) {
            alert(this.loc.error.domainStart);
            return;
        }
        var name = container.find('input[name=name]').val();
        if(!this._checkLength(name, 1)) {
            alert(this.loc.error.name);
            return;
        }
        var language = container.find('select[name=language]').val();
        var size = container.find('input[name=size]:checked').val();
        var selections = {
            domain : domain,
            name : name,
            language : language,
            plugins :[],
            layers : []
        };
        for(var i = 0; i < this.tools.length; ++i) {
            if(this.tools[i].selected) {
                selections.plugins.push({ id : this.tools[i].id });
            }
        }
        if(size == 'custom') {
            
            var width = container.find('div.customsize input[name=width]').val();
            var height = container.find('div.customsize input[name=height]').val();
            if(this._validateSize(width, height)) {
                selections.size = {
                    width : width,
                    height : height
                };  
            }
            else {
                alert(this.loc.error.size);
                return;
            }
        }
        else {
            
            for(var i = 0; i < this.sizeOptions.length; ++i) {
                var option = this.sizeOptions[i]; 
                if(option.id == size) {
                    selections.size = {
                        width : option.width,
                        height : option.height
                    };
                    break;
                }
            }
        }
        // jos karttatasot rastittu
        if(this.showLayerSelection) {
            selections.tools.push('layerselection');
            for(var i = 0; i < this.layers.length; ++i) {
                if(this.layers[i].selected) {
                    selections.layers.push({ id: this.layers[i].id });
                }
            }
        }
	jQuery.ajax({
	    url : '/web/fi/kartta' + 
		'?p_p_id=Portti2Map_WAR_' + 
		'portti2mapportlet' + 
		'&p_p_lifecycle=1' + 
		'&p_p_state=exclusive' + 
		'&p_p_mode=view' + 
		'&p_p_col_id=column-1' + 
		'&p_p_col_count=1' + 
		'&_Portti2Map_WAR_' + 
		'portti2mapportlet_' + 
		'fi.mml.baseportlet.CMD=' + 
		'ajax.jsp' + 
		'&action_route=Publish',
	    type : 'POST',
	    data : 'pubdata=' + JSON.stringify(selections),
	    dataType : 'json',
            beforeSend: function(x) {
                if(x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
	    success : function(response) {
		alert("Ok");
	    },
	    error : function() {
		alert("Fail");
	    }
	});
    },
    _checkLength : function(pStr, min, max) {
        if(pStr) {
            var str = jQuery.trim(pStr.toString());
            if(min && str.length < min) {
                return false;
            }
            if(max && str.length > max) {
                return false;
            }
            return true;            
        }
        return false;
    },
    _isNumber : function(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    },
    _validateSize : function(width, height) {
        
        if(!this._isNumber(width) || !this._isNumber(height)) {
            return false;
        }
        var custom = null;
        for(var i = 0; i < this.sizeOptions.length; ++i) {
            var option = this.sizeOptions[i]; 
            if(option.id == 'custom') {
                custom = option;
                break;
            }
        }
        if(width < custom.minWidth || width > custom.maxWidth) {
            return false;
        }
        if(height < custom.minHeight || height > custom.maxHeight) {
            return false;
        }
        return true;
    }
});
