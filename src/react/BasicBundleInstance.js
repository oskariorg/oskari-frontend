import { BaseModule } from './BaseModule';

const DEFAULT_NAME = 'BasicBundleInstance';

export class BasicBundleInstance extends BaseModule {
    constructor (name = DEFAULT_NAME) {
        super(name);
        this._loc = undefined;
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

    // jump through some additional hoops to default name as the bundleId if it hasn't been overridden
    /**
     * Tries to use bundle id as name if name isn't given for constructor
     * @see BaseModule.getName()
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
