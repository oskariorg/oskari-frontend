import { BaseModule } from './BaseModule';

const DEFAULT_NAME = 'BasicBundleInstance';

export class BasicBundleInstance extends BaseModule {
    constructor (name = DEFAULT_NAME) {
        super(name);
        this._loc = undefined;
        this._requestHandlers = undefined;
    }

    /**
     * This is the starting point of the bundle. This gets run when the bundle is started by the AppSetup loader.
     * This is probably the function you want to override, but remember to call super.start(sandbox) to skip the boilerplate code.
     * @param {Oskari.Sandbox} sandbox the sandbox this module operates in
     */
    start (sandbox) {
        // do the usual startup like registering to sandboc
        super.start(sandbox);
        // start() here is for documentation purposes as it's something bundles will likely override
    }

    /**
     * If you need to do any cleanup when the bundle is stopped, this is the place to do it.
     * If you override this, remember to call super.stop() that handles the usual cleanup for event listeners and request handlers.
     */
    stop () {
        // do the usual
        super.stop();
        // and remove any requests handlers in case the bundle added some
        this.removeRequestHandler();
    }

    /**
     * Returns a localization for the given key and options args.
     * Uses getName() for mapping localization file for this.
     * @param {String} key localization key
     * @param {Object} args arguments object with key: value pairs to be used in templating
     * @returns the localized value
     */
    loc (key, args) {
        if (!this._loc) {
            this._loc = Oskari.getMsg.bind(null, this.getName());
        }
        return this._loc(key, args);
    }

    addRequestHandler (requestName, handlerFn) {
        if (!requestName) {
            throw new Error('Tried to register handler without request name');
        }
        if (typeof handlerFn !== 'function') {
            throw new Error(`Tried to register handler for ${requestName} without handlerFn`);
        }
        if (!this._requestHandlers) {
            this._requestHandlers = Oskari.createStore('handler');
        }
        this.getSandbox().requestHandler(requestName, (req) => handlerFn(req));
        this._requestHandlers.handler(requestName, handlerFn);
    }

    removeRequestHandler (requestName) {
        if (requestName) {
            // remove single request handler
            this.getSandbox().requestHandler(requestName, null);
            this._listeners.request.reset(requestName);
        } else {
            // remove all request handlers
            this._listeners.request.handler().forEach(reqName => this.removeRequestHandler(reqName));
        }
    }

    // FIXME: this doesn't work:
    /*
    This was the plan:
```
class BaseRequest {
    constructor (name = 'BaseRequest' + Oskari.getSeq('BaseModule').nextVal()) {
        this.name = name;
    }

    getName () {
        return this.name;
    }
}

class HelloRequest extends BaseRequest {
    constructor(id) {
        super('HelloRequest');
        this._id = id;
    }

    getId () {
        return this._id;
    }
};
```
Then on bundle:
```
    this.registerRequestImpl(HelloRequest);
    this.addRequestHandler('HelloRequest', (req) => console.log(req));
```
Or even just: `this.addRequestHandler(HelloRequest, (req) => console.log(req));`
     */
    registerRequestImpl (bundleRequestClass) {
        // we should find a way for es classes to register for metadata without creating the random name
        Oskari.clazz.defineES('Oskari.random.Request' + Oskari.getSeq('BaseRequest').nextVal(), bundleRequestClass, {
            protocol: ['Oskari.mapframework.request.Request']
        });
    }

    // jump through some additional hoops to default name as the bundleId if it hasn't been overridden
    /**
     * Tries to use bundle id as name if name isn't given for constructor
     * @returns String the name of the bundle (used for referencing on sandbox, mapping the correct localization file)
     */
    getName () {
        if (this._name !== DEFAULT_NAME) {
            // default has been overridden
            return this._name;
        }
        if (this.mediator?.bundleId) {
            this._name = this.mediator.bundleId;
        } else {
            Oskari.log('BasicBundleInstance').info('Defaulting name to bundle id:', this._name);
        }
        return this._name;
    }
};
