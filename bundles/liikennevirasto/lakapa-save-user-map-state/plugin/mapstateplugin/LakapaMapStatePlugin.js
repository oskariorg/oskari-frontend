/**
 * @class Oskari.liikennevirasto.bundle.mapmodule.plugin.LakapaMapStatePlugin
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.mapmodule.plugin.LakapaMapStatePlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(locale, mapModule) {
    this.mapModule = mapModule;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
    this._locale = locale;

    this._pendingAjaxQuery = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
        };

}, {
    /** @static @property __name plugin name */
    __name : 'LakapaMapStatePlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
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
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        this._sandbox = sandbox;
        this._sandbox.printDebug("[LakapaMapStatePlugin] init");
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
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._map = this.getMapModule().getMap();

        me._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }


        for(var p in me.eventHandlers) {
        	me._sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        var me = this;
        // hide infobox if open
        me._closeGfiInfo();

        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }

        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @method setEnabled
     * Enables or disables gfi functionality
     * @param {Boolean} blnEnabled
     *          true to enable, false to disable
     */
    setEnabled : function(blnEnabled) {
        this.enabled = (blnEnabled === true);
        // close existing if disabled
        if(!this.enabled) {
            this._closeGfiInfo();
        }
    },
    /**
     * @method _notifyAjaxFailure
     * @private
     * Notify ajax failure
     */
    _notifyAjaxFailure: function() {
    	 var me = this;
    	 me._sandbox.printDebug("[LakapaMapStatePlugin] Map state chenge AJAX failed");
    },
    /**
     * @method _isAjaxRequestBusy
     * @private
     * Check at if ajax request is busy
     * @return {Boolean} true if ajax request is busy, else false
     */
    _isAjaxRequestBusy: function() {
    	var me = this;
    	return me._pendingAjaxQuery.busy;
    },
    /**
     * @method _cancelAjaxRequest
     * @private
     * Cancel ajax request
     */
    _cancelAjaxRequest: function() {
    	var me = this;
    	if( !me._pendingAjaxQuery.busy ) {
    		return;
    	}
    	var jqhr = me._pendingAjaxQuery.jqhr;
    	me._pendingAjaxQuery.jqhr = null;
    	if( !jqhr) {
    		return;
    	}
    	this._sandbox.printDebug("[LakapaMapStatePlugin] Abort jqhr ajax request");
    	jqhr.abort();
    	jqhr = null;
    	me._pendingAjaxQuery.busy = false;
    },
    /**
     * @method _starAjaxRequest
     * @private
     * Start ajax request
     */
    _startAjaxRequest: function(dteMs) {
    	var me = this;
		me._pendingAjaxQuery.busy = true;
		me._pendingAjaxQuery.timestamp = dteMs;

    },
    /**
     * @method _finishAjaxRequest
     * @private
     * Finish ajax request
     */
    _finishAjaxRequest: function() {
    	var me = this;
    	me._pendingAjaxQuery.busy = false;
        me._pendingAjaxQuery.jqhr = null;
        this._sandbox.printDebug("[LakapaMapStatePlugin] finished jqhr ajax request");
    },
    /**
     * @method _saveMapState
     * @param event
     * @private
     * Save map state if user is sign in
     */
    _saveMapState: function(event){
    	var me = this;

    	var omap = me.mapModule.getMap();
    	var zoom = parseInt(omap.getZoom());
    	var lon = parseInt(omap.getCenter().lon);
    	var lat = parseInt(omap.getCenter().lat);

    	var dte = new Date();
        var dteMs = dte.getTime();

        if( me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp &&
            	dteMs - me._pendingAjaxQuery.timestamp < 500 ) {
            	me._sandbox.printDebug("[LakapaMapStatePlugin] Map state change NOT SENT (time difference < 500ms)");
            	return;
        }

        me._cancelAjaxRequest();
        me._startAjaxRequest(dteMs);

        var ajaxUrl = me._sandbox.getAjaxUrl();

        jQuery.ajax({
            beforeSend : function(x) {

            	me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
            	me._finishAjaxRequest();
            },
            error : function() {
            	me._finishAjaxRequest();
                me._notifyAjaxFailure();
            },
            always: function() {
            	me._finishAjaxRequest();
            },
            complete: function() {
            	me._finishAjaxRequest();
            },
            data : {
                centerLon : lon,
                centerLat : lat,
                mapZoom : zoom,
                lang: Oskari.getLang()
            },
            type : 'POST',
            dataType : 'json',
            url : ajaxUrl + 'action_route=SaveMapSate'
        });

    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    	'AfterMapMoveEvent' : function(event) {
    		this._saveMapState(event);
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
    	var handler = this.eventHandlers[event.getName()];

        if(!handler)
        	return;

        return handler.apply(this, [event]);
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
