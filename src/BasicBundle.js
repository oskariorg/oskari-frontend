/**
 * @class Oskari.BasicBundle
 * Abstract class, for inheritance only
 */
Oskari.clazz.define('Oskari.BasicBundle', function () {
    this.sandbox = null;
}, {
    /**
     * @static @property __name
     * override in subclass!
     */
    __name: '',

    getName: function () {
        return this.__name;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.call(this, event);
    },

    eventHandlers: {}, // Override in subclass

    requestHandlers: {}, // Override in subclass

    /**
     * @method init
     * Module protocol method
     */
    init: function () { },

    /** 
     * @method start
     * Called from sandbox
     */
    start: function (sandbox) {
        sandbox.register(this);
        this.sandbox = sandbox;

        Object.keys(this.requestHandlers).forEach(function (requestName) {
            sandbox.requestHandler(requestName, this.requestHandlers[requestName].call(this));
        }, this);
        Object.keys(this.eventHandlers).forEach(function (eventName) {
            sandbox.registerForEventByName(this, eventName);
        }, this);

        if (this._startImpl) {
            this._startImpl(sandbox);
        }
    },

    /**
     * @method update
     * Called from sandbox
     */
    update: function (sandbox) { },

    /**
     * @method stop
     * Called from sandbox
     */
    stop: function (sandbox) {
        Object.keys(this.requestHandlers).forEach(function (requestName) {
            sandbox.requestHandler(requestName, null);
        }, this);
        Object.keys(this.eventHandlers).forEach(function (eventName) {
            sandbox.unregisterFromEventByName(this, eventName);
        }, this);

        sandbox.unregister(this);
    }
}, {
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
