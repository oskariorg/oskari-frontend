/**
 * @class BasicBundle
 * @abstract
 * @hideconstructor
 * @classdesc
 * Oskari.BasicBundle.
 * For inheritance only.
 * 
 * @example <caption>Creating yor own bundle</caption>
 * const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');
 * 
 * Oskari.clazz.defineES('Oskari.<mynamespace>.<bundle-identifier>.MyBundleInstance',
 *     class MyBundleInstance extends BasicBundle {
 *         constructor () {
 *             this.__name = 'Oskari.<mynamespace>.<bundle-identifier>.MyBundleInstance'
 *         }
 *         _startImpl () {
 *             console.log('Hello world!');
 *         }
 *     }
 * );
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
     * @memberof BasicBundle
     * @param {Oskari.mapframework.event.Event} event A Oskari event object.
     * Event is handled forwarded to correct {@link BasicBundle#eventHandlers|eventHandler}
     * if found or discarded if not.
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
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
     * @override
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
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});