/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundleInstance
 *
 * Main component and starting point for the "map publisher" functionality. 
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
	this.publisher = null;
	this.disabledLayers = null;
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
        	// TODO: not needed anymore?
            this.plugins['Oskari.userinterface.Flyout'].handleMapMoved();
        },
        /**
         * @method Publisher.MapPublishedEvent
         * @param {Oskari.mapframework.bundle.publisher.event.MapPublishedEvent} event
         */
        'Publisher.MapPublishedEvent' : function(event) {
        	// TODO: generate url
        	alert(event.getId());
        },
        /**
         * @method userinterface.ExtensionUpdatedEvent
         * Disable preview on close, otherwise enable preview
         */
        'userinterface.ExtensionUpdatedEvent' : function(event) {

            var me = this;
            if(event.getExtension().getName() != me.getName()) {
                // wasn't me -> do nothing
                return;
            }

            var doOpen = event.getViewState() != "close";
            this.plugins['Oskari.userinterface.Flyout'].setEnabled(doOpen);
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
	},
	/**
	 * @method setPublishMode
	 * Transform the map view to publisher mode if parameter is true
	 * @param {Boolean} blnEnabled
	 * @param {Layer[]} deniedLayers layers that the user can't publish
	 */
	setPublishMode : function(blnEnabled, deniedLayers) {
		var me = this;
    	var map = jQuery('#contentMap');
    	var tools = jQuery('#maptools');
    	
		if (blnEnabled == true) {
			this.disabledLayers = deniedLayers;
			// remove denied
    		this._removeLayers();
			
    		map.addClass('mapPublishMode');
    		// close all flyouts - TODO: how about popups/gfi?
            me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
    		    
            // proceed with publisher view
            this.publisher = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.BasicPublisher', 
                this, this.getLocalization('BasicView'));
            this.publisher.render(map);
            this.publisher.setEnabled(true);
    	}
    	else {
    		map.removeClass('mapPublishMode');
    		this._addLayers();
    		if(this.publisher) {
            	this.publisher.setEnabled(false);
    			this.publisher.destroy();
    		}
    	}
	},
	/**
	 * @method _addLayers
	 * Adds temporarily removed layers to map
	 */
	_addLayers : function() {
		var me = this;
		var sandbox = this.sandbox;
        var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
		if(this.disabledLayers) {
			for(var i=0; i < this.disabledLayers.length; ++i) {
				// remove
				var layer = this.disabledLayers[i];
            	sandbox.request(me, addRequestBuilder(layer.getId(), true));
			}
		}
	},
	/**
	 * @method _removeLayers
	 * Removes temporarily layers from map that the user cant publish
	 */
	_removeLayers : function() {
		var me = this;
		var sandbox = this.sandbox;
        var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
		if(this.disabledLayers) {
			for(var i=0; i < this.disabledLayers.length; ++i) {
				// remove
				var layer = this.disabledLayers[i];
            	sandbox.request(me, removeRequestBuilder(layer.getId()));
			}
		}
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
