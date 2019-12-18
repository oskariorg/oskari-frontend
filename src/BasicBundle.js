/**
 * @classdesc 
 * Oskari.BasicBundle. For inheritance only.
 * 
 * @abstract
 * @hideconstructor
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
class BasicBundle {
    constructor () {
        /** Bundle sanbox */
        this.sandbox = null;
        /** Bundle name, override in subclass! */
        this.__name = '';
        /** Oskari event handlers */
        this.eventHandlers = {};
        /** Oskari request handlers */
        this.requestHandlers = {};
    }

    /**
     * 
     */
    getName () {
        return this.__name;
    }

    /**
     * @param {Oskari.mapframework.event.Event} event A Oskari event object
     * Event is handled forwarded to correct {@link BasicBundle#eventHandlers|eventHandler} if found or discarded if not.
     */
    onEvent (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.call(this, event);
    }

    /*
     * Module protocol method
     */
    init () { }

    /** 
     * Called from sandbox
     * @param {Object} sandbox Bundle sandbox
     */
    start (sandbox) {
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
    }

    /**
     * Called from sandbox
     * @param {Object} sandbox Bundle sandbox
     */
    update (sandbox) { }

    /**
     * Called from sandbox
     * @param {Object} sandbox Bundle sandbox
     */
    stop (sandbox) {
        Object.keys(this.requestHandlers).forEach(function (requestName) {
            sandbox.requestHandler(requestName, null);
        }, this);
        Object.keys(this.eventHandlers).forEach(function (eventName) {
            sandbox.unregisterFromEventByName(this, eventName);
        }, this);

        sandbox.unregister(this);
    }
};

Oskari.clazz.defineES(
    'Oskari.BasicBundle',
    BasicBundle,
    {
        'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
