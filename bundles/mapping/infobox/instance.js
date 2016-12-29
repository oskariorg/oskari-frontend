/**
 * @class Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance
 *
 * Main component and starting point for the "infobox" functionality.
 * Provides functionality for other bundles (GFI/WFS featuretype/Search)
 * to display a popup on the map.
 *
 * See Oskari.mapframework.bundle.infobox.InfoBoxBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.mediator = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'Infobox',

	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	update : function() {
	},
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	start : function() {
		var me = this;
		if(me.started) {
			return;
		}
		me.started = true;
		// Should this not come as a param?
		var sandbox = Oskari.getSandbox();
		sandbox.register(me);
		me.setSandbox(sandbox);

		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.registerForEventByName(me, p);
			}
		}

		// register plugin for map (drawing for my places)
		var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
		mapModule.registerPlugin(this.popupPlugin);
		mapModule.startPlugin(this.popupPlugin);
		sandbox.addRequestHandler('InfoBox.ShowInfoBoxRequest', this.requestHandlers.showInfoHandler);
		sandbox.addRequestHandler('InfoBox.HideInfoBoxRequest', this.requestHandlers.hideInfoHandler);
        sandbox.addRequestHandler('InfoBox.RefreshInfoBoxRequest', this.requestHandlers.refreshInfoHandler);
	},
	/**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	init : function() {
        var adaptable = this.conf && this.conf.adaptable === true;
		// register plugin for map (actual popup implementation handling)
		this.popupPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin');
		this.popupPlugin.setAdaptable(adaptable);

		this.requestHandlers = {
			showInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler', this.popupPlugin),
			hideInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler', this.popupPlugin),
            refreshInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.RefreshInfoBoxRequestHandler', this.popupPlugin)

		};
		return null;
	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {
		var me = this;
		var handler = me.eventHandlers[event.getName()];
		if(!handler) {
			return;
		}

		return handler.apply(this, [event]);
	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		/**
		 * @method MapClickedEvent
		 */
		MapClickedEvent : function(e) {
		},
		'Publisher2.ColourSchemeChangedEvent': function(evt){
            this._handleColourSchemeChangedEvent(evt);
        },
        'Publisher.ColourSchemeChangedEvent': function(evt){
            this._handleColourSchemeChangedEvent(evt);
        },
        'AfterAddMarkerEvent': function(evt) {
        	if(evt.getID()) {
        		this.popupPlugin.markers[evt.getID()] = {
        			data: evt.getData(),
        			params: evt.getParams()
        		};
        	}
        },
        'AfterRemoveMarkersEvent': function(evt) {
        	if(evt.getId() && this.popupPlugin.markers[evt.getId()]) {
        		delete this.popupPlugin.markers[evt.getId()];
        		this.popupPlugin.close(this.popupPlugin.markerPopups[evt.getId()]);
        		delete this.popupPlugin.markerPopups[evt.getId()];
        	} else if (!evt.getId()){
        		this.popupPlugin.markers = {};
        	}
        },
        MapSizeChangedEvent: function (evt) {
            this.popupPlugin._handleMapSizeChanges(evt.getWidth(), evt.getHeight());
        }
	},

	_handleColourSchemeChangedEvent: function(evt){
		this.popupPlugin._changeColourScheme(evt.getColourScheme());
    },
	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	stop : function() {
		var me = this;
        var sandbox = this.sandbox;
		for(var p in me.eventHandlers) {
			if(p) {
				sandbox.unregisterFromEventByName(me, p);
			}
		}
		me.sandbox.unregister(me);
		me.started = false;
	},
    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState : function(state) {
        if(!state || !state.popups) {
            return;
        }
        // good to go -> close existing and open ones saved in state
        this.popupPlugin.close();
        for(var i = 0 ; i < state.popups.length; ++i) {
            var data = state.popups[i];
            this.popupPlugin.popup(data.id, data.title, data.data, data.lonlat);
        }
    },
    /**
     * @method getState
     * @return {Object} bundle state as JSON
     */
    getState : function() {
        // get applications current state
        var state = {
            popups : []
        };
        var popups = this.popupPlugin.getPopups();

        for(var id in popups) {
        	if (popups.hasOwnProperty(id)) {
	            var popup = popups[id];
	            var data = {
	                id: id,
	                title : popup.title,
	                data : popup.contentData,
	                lonlat : popup.lonlat
	            };
	            state.popups.push(data);
        	}
        }
        return state;
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
