/**
 * @class Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance
 * Handles modules implementing Stateful protocol to track application state.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the bundle
 *
 */
function() {}, {
    /**
     * @static
     * @property __name
     */
    __name : 'UsageTracker',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName" : function() {
        return this.__name;
    },
    /**
     * @method setSandbox
     * @param {Oskari.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox : function(sandbox) {
        this.sandbox = sandbox;
    },
    /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

        var me = this;
        if (me.started) {
            return;
        }
        me.started = true;

   		var conf = this.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        sandbox.register(me);

        // only register events if we are logging
        if (me.conf && me.conf.logUrl && me.conf.events) {
            var eventName = null;
            var eventHandler = function (event) {
                me._logState();
            };

            for (var i = 0, ilen = me.conf.events.length; i < ilen; i++) {
                eventName = me.conf.events[i].toString();
                me.eventHandlers[eventName] = eventHandler;
                sandbox.registerForEventByName(me, eventName);
            }
        }
    },

    /**
     * @method update
     *
     * implements bundle instance update method
     */
    "update" : function() {

    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop" : function() {
        var me = this;
        var sandbox = me.sandbox;

        // only unregister events if we are logging
        if (me.conf && me.conf.logUrl) {
            for (var p in me.eventHandlers) {
                sandbox.unregisterFromEventByName(me, p);
            }
        }

        me.sandbox.unregister(me);
        me.started = false;
    },

    /**
     * @method init
     * implements Module protocol init method - does nothing atm
     */
    "init": function() {
        // headless
        return null;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);

    },

    /**
     * @property {Object} eventHandlers are configurable
     * @static
     */
    eventHandlers : {},

    /**
     * @method logState
     * @private
     * Sends a GET request to the url in the conf with map parameters
     */
    _logState: function() {
        var me = this,
            logUrlWithLinkParams = me.conf.logUrl + '?'+ me.sandbox.generateMapLinkParameters();

        jQuery.ajax({
            type : "GET",
            url : logUrlWithLinkParams
        });
    }

}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
