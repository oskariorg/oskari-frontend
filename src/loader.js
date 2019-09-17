/**
 * Bundle register.
 * Usage:
 *
 *     // get
 *     var bundledetails = Oskari.bundle('mybundle');
 *     // set
 *     Oskari.bundle('mybundle', bundledetails);
 *
 * Details contain an object with:
 *    {
 *        clazz : instance of class defined in packages/.../bundle.js,
 *        metadata : metadata for above bundle.js including scripts to load for the bundle
 *    }
 *
 */
(function (o) {
    if (!o) {
        // can't add bundle if no Oskari ref
        return;
    }
    var _bundleRegistry = {};
    // Add the bundle method to Oskari
    o.bundle = function (bundleId, value) {
        if (value) {
            _bundleRegistry[bundleId] = value;
        }
        return _bundleRegistry[bundleId];
    };
}(Oskari));
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
    var log = Oskari.log('Loader');
    var linkFile = function (href, rel, type) {
        var importParentElement = document.head || document.body;
        var linkElement = document.createElement('link');
        linkElement.rel = rel || 'stylesheet';
        linkElement.type = type || 'text/css';
        linkElement.href = href;
        importParentElement.appendChild(linkElement);
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
    var loader = function (startupSequence, config) {
        var sequence = [];
        if (startupSequence && typeof startupSequence.slice === 'function') {
            sequence = startupSequence.slice(0);
        } else {
            log.warn('No startupsequence given to loader or sequence is not an array');
        }
        var appConfig = config || {};

        var globalExpose = {};
        // Listen to started bundles
        var result = {
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
            processSequence: function (done) {
                var me = this;
                if (sequence.length === 0) {
                    // everything has been loaded
                    if (typeof done === 'function') {
                        done(result);
                    }
                    o.trigger('app.start', result);
                    return;
                }
                var seqToLoad = sequence.shift();
                if (typeof seqToLoad !== 'object') {
                    // log warning: block not object
                    log.warn('StartupSequence item is a ' + typeof seqToLoad + ' instead of object. Skipping');
                    // iterate to next
                    this.processSequence(done);
                    return;
                }

                var bundleToStart = seqToLoad.bundlename;
                if (!bundleToStart) {
                    log.warn('StartupSequence item doesn\'t contain bundlename. Skipping ', seqToLoad);
                    // iterate to next
                    this.processSequence(done);
                    return;
                }
                // if bundleinstancename is missing, use bundlename for config key.
                var configId = seqToLoad.bundleinstancename || bundleToStart;
                var config = appConfig[configId] || {};

                if (Oskari.bundle(bundleToStart)) {
                    log.debug('Bundle preloaded ' + bundleToStart);
                    me.startBundle(bundleToStart, config, configId);
                    this.processSequence(done);
                    return;
                }
                let bundlePromise = Oskari.bundle_manager.loadDynamic(bundleToStart);
                if (!bundlePromise) {
                    log.warn('Bundle wasn\'t preloaded nor registered as dynamic. Skipping ', bundleToStart);
                    this.processSequence(done);
                    return;
                }
                bundlePromise
                    .then(() => {
                        me.startBundle(bundleToStart, config, configId);
                        this.processSequence(done);
                    })
                    .catch((err) => {
                        log.error('Error loading bundle ' + bundleToStart, err);
                        me.processSequence(done);
                    });
            },
            startBundle: function (bundleId, config, instanceId) {
                var bundle = Oskari.bundle(bundleId);
                if (!bundle) {
                    throw new Error('Bundle not loaded ' + bundleId);
                }
                var instance = bundle.clazz.create();
                if (!instance) {
                    throw new Error('Couldn\'t create an instance of bundle ' + bundleId);
                }
                instance.mediator = {
                    bundleId: bundleId,
                    instanceId: instanceId
                };
                // quick'n'dirty property injection
                for (var key in config) {
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
