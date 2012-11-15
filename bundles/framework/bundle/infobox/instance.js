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
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
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
		var sandbox = Oskari.$('sandbox');
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

        sandbox.registerAsStateful(this.mediator.bundleId, this);
	},
	/**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	init : function() {
		var me = this;
		// register plugin for map (actual popup implementation handling)
		this.popupPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin');

		this.requestHandlers = {
			showInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequestHandler', this.popupPlugin),
			hideInfoHandler : Oskari.clazz.create('Oskari.mapframework.bundle.infobox.request.HideInfoBoxRequestHandler', this.popupPlugin)

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
		 * FIXME: just for testing - dummy data for demo purposes
		 */
/*		MapClickedEvent : function(e) {
			var me = this;

			var popupId = "" + e.getLonLat().lon + "_" + e.getLonLat().lat;

			var exampleContent = [{
				html : "<h3>Kumpumoreeni</h3>" + "<p>Suomen maanperä 1:10000000 (WFS)</p>",
				actions : {
					"Tallenna" : function() {
						alert('tallennettu');
					},
					"Sulje" : function() {
                        var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(popupId);
                        me.sandbox.request(me.getName(), request);
					}
				}
			}, {
				html : "<h3>Struven ketju/Mustaviiri</h3>" + "<p>Maailmanperintökohteet (N:6682245 E:478060)</p>" + "<p>Struven ketju on kolmioketju, joka kulkee lähelllä itäistä 26 pituuspiiriä Hammerfestistä, Pohjoisen jäämeren rannalta, Mustallemerelle Ukrainan Izmailmaan</p>",
				actions : {
					"Tallenna" : function() {
						alert('tallennettu2');
					},
					"Sulje" : function() {
						var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(popupId);
						me.sandbox.request(me.getName(), request);
					}
				}
			}];

			var request = this.sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(popupId, "Title", exampleContent, e.getLonLat(), true);
			this.sandbox.request(me.getName(), request);

		}
		*/
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	stop : function() {
		var me = this;
        var sandbox = this.sandbox;
        sandbox.unregisterStateful(this.mediator.bundleId);
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
            var popup = popups[id];
            var data = {
                id: id,
                title : popup.title,
                data : popup.contentData,
                lonlat : popup.lonlat
            };
            state.popups.push(data);
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
