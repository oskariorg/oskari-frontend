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






// FIXME TEST USE ONLY
var addMarker = jQuery('<button>Add marker</button>');
var addInfobox = jQuery('<button>Add infobox</button>');
var removeMarker = jQuery('<button>Remove marker</button>');
Oskari.shapeNumber  =0;
addMarker.click(function(){
	var sb = Oskari.getSandbox();

	// Add marker
	var markerData = {
		x: 411650.70779123,
	    y: 6751897.3481153,
	    color: "ff0000",
	    msg : '',
	    shape: Oskari.shapeNumber, // icon number (0-6)
	    size: 4
	};
	Oskari.shapeNumber++;
	if(Oskari.shapeNumber===6) {
		markerData.shape = {
				data: '<svg width="32" height="32"><g transform="matrix(0.25,0,0,0.25,2.0791861e-4,0)"><g><path d="m 46.108,95.078 c -1.563,-1.563 -4.094,-1.563 -5.656,0 L 40.335,94.961 18.421,109.578 33.038,87.664 32.921,87.547 c 1.563,-1.563 1.555,-4.102 0,-5.656 -1.563,-1.563 -4.094,-1.563 -5.656,0 l -26.594,39.89 c -1.055,1.586 -0.852,3.695 0.5,5.047 0.773,0.774 1.797,1.172 2.828,1.172 0.766,0 1.539,-0.219 2.219,-0.672 l 39.891,-26.594 c 1.562,-1.562 1.554,-4.101 -0.001,-5.656 z" style="fill:#221c24" /></g></g><path d="m 18.000534,1.99975 12,12 -4,0 -8,8 0,4 -12.0000001,-12 4.0000001,0 8,-8 0,-4 m 0,-2 c -0.25775,0 -0.5175,0.04875 -0.76575,0.15225 -0.746,0.30875 -1.23425,1.03925 -1.23425,1.84775 l 0,3.172 -6.8280001,6.828 -3.172,0 c -0.8085,0 -1.539,0.48825 -1.84775,1.2345 -0.3105002,0.748 -0.13875,1.6075 0.4335,2.17975 l 12.0000001,12 c 0.38275,0.38275 0.8945,0.586 1.414,0.586 0.25775,0 0.5175,-0.04875 0.76575,-0.15225 0.746,-0.3085 1.2345,-1.039 1.2345,-1.84775 l 0,-3.172 6.82825,-6.82825 3.172,0 c 0.8085,0 1.539,-0.48825 1.84775,-1.2345 0.3105,-0.748 0.13875,-1.6075 -0.4335,-2.17975 l -12,-12 c -0.38325,-0.3825 -0.895,-0.58575 -1.4145,-0.58575 l 0,0 z" style="fill:#ff2ad4" /></svg>',

				//<g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
                x: 0, // center point x position
                y: 0 // center point y position
            };
	}
	if(Oskari.shapeNumber>7) {
		Oskari.shapeNumber = 0;
	}
	var reqAddMarker = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest')(markerData, 'MARKER_TEST');
	sb.request('MainMapModule', reqAddMarker);
});

addInfobox.click(function(){
	var sb = Oskari.getSandbox();
	// show info box
	var content = [{'html': '<div>Markkerin infoboksi</div>'}];

	var data = {
		lon: 411650,
		lat: 6751897,
		marker: 'MARKER_TEST'
	};

	var reqShowInfo = sb.getRequestBuilder('InfoBox.ShowInfoBoxRequest')('MARKON TESTI ID', 'Info title', content, data, {hidePrevious:true});
	sb.request('MainMapModule', reqShowInfo);
});

removeMarker.click(function(){
	var sb = Oskari.getSandbox();
	var reqRemoveMarker = sb.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest')('MARKER_TEST');
	sb.request('MainMapModule', reqRemoveMarker);
});

var tools = jQuery('<div style="background-color:#ffffff;border:1px solid #ff0000;position:absolute;top:10px;right:10px;z-index:1000000;"></div>');

tools.append(addMarker);
tools.append(addInfobox);
tools.append(removeMarker);
jQuery('#contentMap').append(tools);