/**
 * @class BasicBundle
 * @abstract
 * @hideconstructor
 * @classdesc
 * Oskari.BasicBundle.
 * For inheritance only.
 */
Oskari.clazz.define('Oskari.BasicBundle', function () {
    /**
     * Oskari sandbox.
     * @memberof BasicBundle
     */
    var sandbox = null; // Separate declaration for documentation.
    this.sandbox = sandbox;
}, {
    /**
     * Override in subclass! Empty string by default.
     * @memberof BasicBundle
     */
    __name: '',

    /**
     * Name of the Bundle. Extending classes should declare their own __name property.
     * @memberof BasicBundle
     */
    getName: function () {
        return this.__name;
    },

    /**
     * Returns reference to the application sandbox.
     * Sandbox is used for interacting with other bundles
     * @memberof BasicBundle
     */
    getSandbox: function () {
        return this.sandbox;
    },
    /**
     * @memberof BasicBundle
     * @param {Oskari.mapframework.event.Event} event A Oskari event object.
     * Event is handled forwarded to correct {@link BasicBundle#eventHandlers|eventHandler}
     * if found or discarded if not.
     */
    onEvent: function (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.call(this, event);
    },

    /**
     * Oskari event handlers
     * @memberof BasicBundle
     */
    eventHandlers: {},

    /**
     * Oskari request handlers
     * @memberof BasicBundle
     */
    requestHandlers: {},

    /**
     * Module protocol method.
     * @memberof BasicBundled
     */
    init: function () { },

    /**
     * Called from sandbox.
     * @memberof BasicBundle
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
     * Called from sandbox.
     * @memberof BasicBundle
     */
    update: function (sandbox) { },

    /**
     * Called from sandbox.
     * @memberof BasicBundle
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
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
