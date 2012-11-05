/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance
 *
 * Utility bundle to manage updating backend status information.
 * Updates information only when LayerSelector2 is being opened.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.backendstatus.BackendStatusBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this._sandbox = null;
	this._started = false;
	this._pendingAjaxQuery = {
		busy : false,
		jqhr : null,
		timestamp : null
	};
	this.timeInterval = this.ajaxSettings.defaultTimeThreshold;
	this.backendStatus = {};
	this.backendExtendedStatus = {};
}, {
	ajaxSettings: {
		defaultTimeThreshold: 30000
	},
	/**
	 * @static
	 * @property __name
	 */
	__name : 'BackendStatus',
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
		this._sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this._sandbox;
	},
	
	getAjaxUrl: function(key) {
		var ajaxUrl = this.getSandbox().getAjaxUrl();
		var url = ajaxUrl + 'action_route=GetBackendStatus';
		
		return url;
		/*return 'GetBackendStatus.json';*/
	},
	
	/**
	 * @method start
	 * implements BundleInstance protocol start method
	 */
	"start" : function() {
		var me = this;

		if(me._started) {
			return;
		}

		me._started = true;

		var sandbox = Oskari.$("sandbox");
		me._sandbox = sandbox;

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}
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
	 * @property extensionsByName
	 * @static
	 * extensions that trigger update
	 * 
	 */
	extensionsByName : {
		'LayerSelector' : true
	},
	
	/**
	 * @property extensionStatesByName
	 * @static
	 * extension states that trigger update
	 * 
	 */
	extensionStatesByName : {
		'attach' : true,
		'detach' : true
	},

	/**
	 * @property {Object} eventHandlers
	 * @static
	 */
	eventHandlers : {
		
		/**
		 * @method ExtensionUpdatedEvent
		 */
		'userinterface.ExtensionUpdatedEvent' : function(event) {

			var extension = event.getExtension();
			if(!extension) {
				return;
			}
			var extensionName = extension.getName();
			if(!extensionName) {
				return;
			}
			if(!this.extensionsByName[extensionName]) {
				return;
			}
			var extensionViewState = event.getViewState();

			if(!this.extensionStatesByName[extensionViewState]) {
				return;
			}

			this.updateBackendStatus();
		},
		
		/**
		 * @method AfterShowMapLayerInfoEvent
		 */
		
		'AfterShowMapLayerInfoEvent' : function(event) {
			
			var mapLayer = event.getMapLayer();
			var mapLayerId = mapLayer.getId();
			var mapLayerBackendStatus = mapLayer.getBackendStatus();
			console.log("ABOUT to show information for "+mapLayerId,mapLayer,mapLayerBackendStatus);

			if( !mapLayerBackendStatus ) {
				return;
			}
						
			var backendExtendedStatusForLayer = 
				this.backendExtendedStatus[mapLayerId];
			
			console.log("MIGHT show information for "+mapLayerId,mapLayer,backendExtendedStatusForLayer);
							
			if( !backendExtendedStatusForLayer) {
				return;
			}
			
			var infoUrl = backendExtendedStatusForLayer.infourl;
			if( !infoUrl ) {
				return;
			}
						
			console.log("WOULD show information for "+mapLayerId,mapLayer,infoUrl);	
							
			this.openURLinWindow(infoUrl);
		}
	},
	
	openURLinWindow: function(infoUrl) {
		var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
		var link = infoUrl;
		window.open(link, "BackendStatus", wopParm);	
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {

		var me = this;
		var sandbox = me._sandbox;

		me._cancelAjaxRequest();

		for(p in me.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);
		this._started = false;
		this._sandbox = null;
	},
	/**
	 * @method getTitle
	 * @return {String} localized text for the title of the component
	 */
	getTitle : function() {
		return 'Backend Status';
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the component
	 */
	getDescription : function() {
		return 'Backend Status';
	},
	_cancelAjaxRequest : function() {
		var me = this;
		if(!me._pendingAjaxQuery.busy) {
			return;
		}
		var jqhr = me._pendingAjaxQuery.jqhr;
		me._pendingAjaxQuery.jqhr = null;
		if(!jqhr) {
			return;
		}
		this._sandbox.printDebug("[BackendStatus] Abort jqhr ajax request");
		jqhr.abort();
		jqhr = null;
		me._pendingAjaxQuery.busy = false;
	},
	_startAjaxRequest : function(dteMs) {
		var me = this;
		me._pendingAjaxQuery.busy = true;
		me._pendingAjaxQuery.timestamp = dteMs;

	},
	_finishAjaxRequest : function() {
		var me = this;
		me._pendingAjaxQuery.busy = false;
		me._pendingAjaxQuery.jqhr = null;
		this._sandbox.printDebug("[BackendStatus] finished jqhr ajax request");
	},
	_notifyAjaxFailure : function() {
		var me = this;
		me._sandbox.printDebug("[BackendStatus] BackendStatus AJAX failed");
		me._processResponse({ backendstatus: []});
	},
	_isAjaxRequestBusy : function() {
		var me = this;
		return me._pendingAjaxQuery.busy;
	},
	updateBackendStatus : function() {
		var me = this;
		var sandbox = me._sandbox;
		if(me._pendingAjaxQuery.busy) {
			sandbox.printDebug("[BackendStatus] updateBackendStatus NOT SENT previous query is busy");
			return;
		}
		var dte = new Date();
		var dteMs = dte.getTime();

		if(me._pendingAjaxQuery.timestamp && dteMs - me._pendingAjaxQuery.timestamp < me.timeInterval) {
			sandbox.printDebug("[BackendStatus] updateBackendStatus NOT SENT (time difference < " + me.timeInterval + "ms)");
			return;
		}

		me._cancelAjaxRequest();
		me._startAjaxRequest(dteMs);
		
		var ajaxUrl = me.getAjaxUrl();

		jQuery.ajax({
			beforeSend : function(x) {
				me._pendingAjaxQuery.jqhr = x;
				if(x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(resp) {
				me._finishAjaxRequest();
				me._processResponse(resp);
			},
			error : function() {
				me._finishAjaxRequest();
				me._notifyAjaxFailure();
			},
			always : function() {
				me._finishAjaxRequest();
			},
			complete : function() {
				me._finishAjaxRequest();
			},
			data : {
			},
			type : 'POST',
			dataType : 'json',
			url : ajaxUrl
			/*url : 'GetBackendStatus.json'*/
		});
	},
	_processResponse : function(resp) {
		var sandbox = this._sandbox;
		var evtBuilder = sandbox.getEventBuilder('MapLayerEvent');
		
		var backendStatusArr = resp.backendstatus;
		if(!backendStatusArr || backendStatusArr.length == undefined ) {
			sandbox.printDebug("[BackendStatus] backendStatus NO data");
			return;
		}

		var changeNotifications = {};
		var extendedStatuses = {};
		
		for(var n = 0; n < backendStatusArr.length; n++) {
			var data = backendStatusArr[n];
			var layerId = data.maplayer_id;
			if( !this.backendStatus[layerId] ) {
				changeNotifications[layerId] = {
						status: data.status };
				extendedStatuses[layerId] = data;
				/*sandbox.printDebug("[BackendStatus] "+layerId+" new alert");*/						
			} else if( this.backendStatus[layerId].status != data.status ) {
				changeNotifications[layerId] = { status: data.status };
				extendedStatuses[layerId] = data;
				/*sandbox.printDebug("[BackendStatus] "+layerId+" changed alert");*/
			} 	
		}
		
		for( p in this.backendStatus ) {
			if( !changeNotifications[p] && this.backendStatus[p].status != null ) {
				changeNotifications[p] = { status: null };
				/*sandbox.printDebug("[BackendStatus] "+layerId+" alert closed");*/ 
			}
		}
		
		this.backendExtendedStatus = extendedStatuses; 
		
		var maplayers = {};
		
		for( p in changeNotifications ) {
			this.backendStatus[p] = changeNotifications[p];
			
			
			var maplayer = sandbox.findMapLayerFromAllAvailable(p);
			if (!maplayer) {
				continue;
			}
			maplayers[p] = maplayer;
			maplayer.setBackendStatus(this.backendStatus[p].status);
		}
		
		for( p in maplayers ) {
			var evt = evtBuilder(p,'update');
			sandbox.notifyAll(evt);
		}
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
