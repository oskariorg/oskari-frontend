/**
 * Startupsequence processor for Oskari. Bundles have ether been bundled/minfied
 * into the application JS file or separate chunks. In both cases bundles must be
 * declared in miniferAppSetup.json
 *
 * Usage:
 *
 *     var startupSequence = [...bundles to load/start... ];
 *     var config = { ... bundle configs ... };
 *     var loader = Oskari.loader(startupSequence, config);
 *     loader.log.enableDebug(true); // to get additional logging
 *     loader.processSequence(function() {
 *         // application started
 *     });
 *
 */
(function (o) {
    if (!o) {
        // can't add loader if no Oskari ref
        return;
    }
    if (o.loader) {
        // loader already present, but we might want another?
    }
    const log = Oskari.log('Loader');
    const linkFile = function (href, rel, type) {
        const importParentElement = document.head || document.body;
        const linkElement = document.createElement('link');
        linkElement.rel = rel || 'stylesheet';
        linkElement.type = type || 'text/css';
        linkElement.href = href;
        importParentElement.appendChild(linkElement);
    };

    /**
     * @method loadDynamic
     * Called to start dynamic loading of a bundle
     *
     * @param {string} bundlename Bundle name
     *
     * @return Promise that resolves when all modules have loaded
     */
    const loadDynamic = function (bundlename) {
        const loaders = Oskari.lazyBundle(bundlename);
        if (loaders) {
            return Promise.all(loaders.map((l) => l.call()));
        }
        return null;
    };

    /**
     * Loader
     * @param  {Object[]} startupSequence sequence of bundles to load/start
     *         {
     *              "bundleinstancename": "openlayers-default-theme",
     *              "bundlename": "openlayers-default-theme"
     *         }
     * @param  {Object}   config          configuration for bundles
     */
    const loader = function (startupSequence, config) {
        let sequence = [];
        if (startupSequence && typeof startupSequence.slice === 'function') {
            sequence = startupSequence.slice(0);
        } else {
            log.warn('No startupsequence given to loader or sequence is not an array');
        }
        const appConfig = config || {};

        // Listen to started bundles
        const result = {
            bundles: [],
            errors: []
        };
        o.on('bundle.start', function (details) {
            result.bundles.push(details.id);
        });
        o.on('bundle.err', function (details) {
            result.errors.push(details);
        });

        return {
            /**
             * @param  {Function} done callback
             */
            processSequence: function (done, suppressStartEvent = false) {
                const me = this;
                if (sequence.length === 0) {
                    // everything has been loaded
                    if (typeof done === 'function') {
                        done(result);
                    }
                    if (!suppressStartEvent) {
                        o.trigger('app.start', result);
                    }
                    return;
                }
                const seqToLoad = sequence.shift();
                if (typeof seqToLoad !== 'object') {
                    // log warning: block not object
                    log.warn('StartupSequence item is a ' + typeof seqToLoad + ' instead of object. Skipping');
                    // iterate to next
                    this.processSequence(done, suppressStartEvent);
                    return;
                }

                const bundleToStart = seqToLoad.bundlename;
                if (!bundleToStart) {
                    log.warn('StartupSequence item doesn\'t contain bundlename. Skipping ', seqToLoad);
                    // iterate to next
                    this.processSequence(done, suppressStartEvent);
                    return;
                }
                // if bundleinstancename is missing, use bundlename for config key.
                const configId = seqToLoad.bundleinstancename || bundleToStart;
                const config = appConfig[configId] || {};

                if (Oskari.bundle(bundleToStart)) {
                    log.debug('Bundle preloaded ' + bundleToStart);
                    me.startBundle(bundleToStart, config, configId);
                    this.processSequence(done, suppressStartEvent);
                    return;
                }
                const bundlePromise = loadDynamic(bundleToStart);
                if (!bundlePromise) {
                    log.warn('Bundle wasn\'t preloaded nor registered as dynamic. Skipping ', bundleToStart);
                    this.processSequence(done, suppressStartEvent);
                    return;
                }
                bundlePromise
                    .then(() => {
                        me.startBundle(bundleToStart, config, configId);
                        this.processSequence(done, suppressStartEvent);
                    })
                    .catch((err) => {
                        log.error('Error loading bundle ' + bundleToStart, err);
                        me.processSequence(done, suppressStartEvent);
                    });
            },
            startBundle: function (bundleId, config, instanceId) {
                const bundle = Oskari.bundle(bundleId);
                if (!bundle) {
                    throw new Error('Bundle not loaded ' + bundleId);
                }
                let instance;
                if (typeof bundle === 'function') {
                    instance = bundle();
                } else {
                    // assume old bundle def
                    instance = bundle.clazz.create();
                }
                if (!instance) {
                    throw new Error('Couldn\'t create an instance of bundle ' + bundleId);
                }
                instance.mediator = {
                    bundleId,
                    instanceId
                };
                // quick'n'dirty property injection
                for (const key in config) {
                    instance[key] = config[key];
                }
                log.debug('Starting bundle ' + bundleId);
                try {
                    instance.start(Oskari.getSandbox());
                    Oskari.trigger('bundle.start', { id: bundleId });
                } catch (err) {
                    Oskari.trigger('bundle.err', { id: bundleId, error: err });
                    log.error('Couldn\'t start bundle with id ' + bundleId + '. Error was: ', err);
                    throw err;
                }
            }
        };
    };

    // setup additional members
    loader.log = log;
    // accessible without calling loader() with loader.linkFile()
    loader.linkFile = linkFile;
    // attach to Oskari
    o.loader = loader;
}(Oskari));
