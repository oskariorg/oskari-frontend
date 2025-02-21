export class BaseModule {
    constructor (name = 'BaseModule' + Oskari.getSeq('BaseModule').nextVal()) {
        // override
        this._name = name;
        this._sandbox = undefined;
        this._eventListeners = undefined;
    }

    getName () {
        return this._name;
    }

    /**
     * Sets the sandbox for module and registers the module in sandbox
     * @param {Oskari.Sandbox} sandbox the sandbox this module operates in
     */
    start (sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
    }

    /**
     * Removes any event listeners that might have been added and unregisters the module from sandbox.
     */
    stop () {
        this.off();
        this.getSandbox().unregister(this);
    }

    getSandbox () {
        return this._sandbox;
    }

    init () {
        // called by sandbox when start() calls sandbox.register(this)
        // can be overridden, but mostly you can do stuff in start() instead
    }

    // listen to events
    on (eventName, handlerFn) {
        if (!eventName) {
            throw new Error('Tried to register listener without event name');
        }
        if (typeof handlerFn !== 'function') {
            throw new Error('Tried to register listener for event without the handler');
        }

        if (!this._eventListeners) {
            // create only if needed/module actually listens something
            this._eventListeners = Oskari.createStore('listener', {
                // otherwise returns true from store.noop() as default value
                defaultValue: () => undefined
            });
        }
        if (this._eventListeners.listener(eventName)) {
            // This would overwrite the previous listener for bundle itself
            //  and register the module multiple times to sandbox -> would trigger multiple calls per event
            throw new Error('Tried to register listener for same event we are already listening. This is not supported yet.');
        }
        this._eventListeners.listener(eventName, handlerFn);
        this.getSandbox().registerForEventByName(this, eventName);
    }

    // stop listening to events
    off (eventName) {
        if (!this._eventListeners) {
            // nothing registered, nothing needs to be removed
            return;
        }
        if (eventName) {
            this.getSandbox().unregisterFromEventByName(this, eventName);
            this._eventListeners.reset(eventName);
        } else {
            // if not defined, remove all listeners
            this._eventListeners.listener().forEach(evtName => this.off(evtName));
        }
    }

    // called by sandbox when event this listens has been triggered
    // this is framework function, use on() to register listeners.
    onEvent (event) {
        const handler = this._eventListeners?.listener(event.getName());
        if (!handler) {
            return;
        }
        return handler(event);
    }
};
