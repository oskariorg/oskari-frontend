const _bundleRegistry = {};
const _availableLazyBundles = {};

const validateFactoryFunction = (bundleId, factoryFn) => {
    const isFunc = typeof factoryFn === 'function';
    const isLegacyClazz = typeof factoryFn?.clazz?.create === 'function';
    if (!isFunc && !isLegacyClazz) {
        throw new TypeError('Factory function for bundleId: ' + bundleId + ' is not a function nor legacy clazz');
    }
};

export const BundleRegister = {
    /**
     * @method bundle
     * Register a bundle factory function for bundle id.
     * The bundle is considered loaded and available for starting as part of an app.
     * Bundle instance MUST have a start() function, but this is not validated by calling factory function ahead of time.
     *
     * @param {string} bundleId Bundle id
     * @param {Function} factoryFn function returns a bundle instance
     */
    bundle: (bundleId, factoryFn) => {
        if (factoryFn) {
            if (!bundleId) {
                throw new TypeError('Bundle Id needs to be truthy when registering a factory function');
            }
            validateFactoryFunction(bundleId, factoryFn);
            if (_bundleRegistry[bundleId]) {
                throw new Error('Factory function already registered for bundleId: ' + bundleId + '. Denied overwriting.');
            }
            _bundleRegistry[bundleId] = factoryFn;
        }
        if (!bundleId) {
            // return all bundle ids that have been registered
            return Object.keys(_bundleRegistry);
        }
        return _bundleRegistry[bundleId];
    },
    /**
     * @method lazyBundle
     * Register bundle for lazy-loading/run-time loading with ES import()
     *
     * @param {string} bundleId Bundle name
     * @param {Function} loader function that returns an promise that resolves when the module has been loaded
     */
    lazyBundle: (bundleId, loader) => {
        if (loader) {
            if (!bundleId) {
                throw new TypeError('Bundle Id needs to be truthy when registering a loader function');
            }
            if (typeof loader !== 'function') {
                throw new TypeError('Loader function for bundleId: ' + bundleId + ' is not a function');
            }
            if (!_availableLazyBundles[bundleId]) {
                _availableLazyBundles[bundleId] = [];
            }
            _availableLazyBundles[bundleId].push(loader);
        }
        if (!bundleId) {
            // return all bundle ids that have been registered as lazyloaded
            return Object.keys(_availableLazyBundles);
        }
        return _availableLazyBundles[bundleId];
    }
};
