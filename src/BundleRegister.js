const _bundleRegistry = {};
const _availableLazyBundles = {};

export const BundleRegister = {
    /**
     * @method bundle
     * Register bundle that is loaded and available for starting
     *
     * @param {string} bundlename Bundle name
     * @param {Function} factory function returns a bundle instance
     */
    bundle: (bundleId, value) => {
        if (value) {
            _bundleRegistry[bundleId] = value;
        }
        return _bundleRegistry[bundleId];
    },
    /**
     * @method lazyBundle
     * Register bundle for lazy-loading/run-time loading with ES import()
     *
     * @param {string} bundlename Bundle name
     * @param {Function} loader function that returns an promise that resolve to the module to be loaded
     */
    lazyBundle: (bundleId, loader) => {
        if (loader) {
            if (!_availableLazyBundles[bundleId]) {
                _availableLazyBundles[bundleId] = [];
            }
            _availableLazyBundles[bundleId].push(loader);
        }
        return _availableLazyBundles[bundleId];
    }
};
