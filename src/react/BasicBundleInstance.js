export class BasicBundleInstance {
    constructor (name = 'BasicBundleInstance') {
        // override
        this._name = name;
        this._loc = undefined;
        this._sandbox = undefined;
        this._listeners = {
            event: Oskari.createStore('listener'),
            request: Oskari.createStore('handler')
        };
    }

    getName () {
        if (this._name !== 'BasicBundleInstance') {
            // default overridden
            return this._name;
        }
        if (this.mediator?.bundleId) {
            this._name = this.mediator.bundleId;
        } else {
            Oskari.log('BasicBundleInstance').warn('Defaulting name to bundle id:', this._name);
        }
        return this._name;
    }

    loc (key, args) {
        if (!this._loc) {
            this._loc = Oskari.getMsg.bind(null, this.getName());
        }
        return this._loc(key, args);
    }

    start (sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
    }

    stop () {
        this.off();
        this.getSandbox().unregister(this);
    }

    getSandbox () {
        return this._sandbox;
    }

    init () {
        // called by sandbox when the bundle is registered to sandbox
    }

    on (eventName, handlerFn) {
        if (!eventName) {
            throw new Error('Tried to register listener without event name');
        }
        if (typeof handlerFn !== 'function') {
            throw new Error('Tried to register listener for event without the handler');
        }
        // TODO: register to sandbox
        this.getSandbox().registerForEventByName(this, eventName);
        this._listeners.event.listener(eventName, handlerFn);
    }

    off (eventName) {
        if (eventName) {
            this.getSandbox().unregisterFromEventByName(this, eventName);
            this._listeners.event.reset(eventName);
        } else {
            // if not defined, remove all listeners
            this._listeners.event.listener().forEach(evtName => this.off(evtName));
        }
    }

    addRequestHandler (requestName, handlerFn) {
        if (!requestName) {
            throw new Error('Tried to register handler without request name');
        }
        this.getSandbox().requestHandler(requestName, (req) => handlerFn(req));
        this._listeners.request.handler(requestName, handlerFn);
    }

    removeRequestHandler (requestName) {
        if (requestName) {
            // remove single request handler
            this.getSandbox().requestHandler(requestName, null);
            this._listeners.request.reset(requestName);
        } else {
            // remove all request handlers
            this._listeners.request.handler().forEach(reqName => this.requestHandler(reqName));
        }
    }

    // called by sandbox when event this listens has been triggered
    // this is framework function, use on() to register listeners.
    onEvent (event) {
        const handler = this._listeners.event.listener(event.getName());
        if (!handler) {
            return;
        }
        return handler(event);
    }
};
