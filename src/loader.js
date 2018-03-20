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
 * File loader/startupsequence processor for Oskari.
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
 * Also provides file linking like:
 *
 *     Oskari.loader.linkFile('/my.css');
 *     Oskari.loader.linkFile('/my.html', 'import', 'text/html');
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

    // http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
    var absolute = function (base, relative) {
        var stack = base.split('/');
        var parts = relative.split('/');
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === '.') { continue; }

            if (parts[i] === '..') {
                stack.pop();
            } else { stack.push(parts[i]); }
        }
        return stack.join('/');
    };

    var getPath = function (base, src) {
        // handle case where src start with /
        var path = src;
        // handle relative ../../ case with src
        if (src.indexOf('/') !== 0) {
            path = absolute(base, src);
        }
        return path.split('//').join('/');
    };
    /**
     * Loader
     * @param  {Object[]} startupSequence sequence of bundles to load/start
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
             * {
                    "bundleinstancename": "openlayers-default-theme",
                    "bundlename": "openlayers-default-theme",
                    "metadata": {
                        "Import-Bundle": {
                            "openlayers-default-theme": {
                                "bundlePath": "../../../packages/openlayers/bundle/"
                            },
                            "openlayers-full-map": {
                                "bundlePath": "../../../packages/openlayers/bundle/"
                            }
                        }
                    }
                }
             * @param  {Object} sequence see above
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
                if (typeof seqToLoad.metadata !== 'object' ||
                    typeof seqToLoad.metadata['Import-Bundle'] !== 'object') {
                    // log warning: "Nothing to load"
                    log.warn('StartupSequence item doesn\'t contain the structure item.metadata["Import-Bundle"]. Skipping ', seqToLoad);
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
                var bundlesToBeLoaded = seqToLoad.metadata['Import-Bundle'];
                var paths = [];
                var bundles = [];
                for (var id in bundlesToBeLoaded) {
                    var value = bundlesToBeLoaded[id];
                    if (typeof value !== 'object' ||
                        typeof value.bundlePath !== 'string') {
                        // log warning: bundlePath not defined
                        log.warn('StartupSequence import doesn\'t contain bundlePath. Skipping! Item is ' + bundleToStart + ' import is ' + id);
                        continue;
                    }
                    var basepath = value.bundlePath + '/' + id;
                    var path = basepath + '/bundle.js';
                    paths.push(path.split('//').join('/'));
                    bundles.push({
                        id: id,
                        path: basepath
                    });
                }
                if (Oskari.bundle(bundleToStart)) {
                    log.debug('Bundle preloaded ' + bundleToStart);
                    me.startBundle(bundleToStart, config, configId);
                    this.processSequence(done);
                    return;
                }
                // load all bundlePaths mentioned in sequence-block
                require(paths, function () {
                    // if loaded undefined - find from Oskari.instalBundle register with id
                    for (var i = 0; i < arguments.length; ++i) {
                        if (typeof arguments[i] !== 'undefined') {
                            // this would be a bundle.js with amd support
                            log.warn('Support for AMD-bundles is not yet implemented', arguments[i]);
                        }
                    }
                    log.debug('Loaded bundles', bundles);
                    // the loaded files have resulted in calls to
                    // Oskari.bundle_manager.installBundleClass(id, "Oskari.mapframework.domain.Bundle");
                    // loop all bundles and require sources from installs
                    me.processBundleJS(bundles, function () {
                        me.startBundle(bundleToStart, config, configId);
                        me.processSequence(done);
                    });
                }, function (err) {
                    log.error('Error loading bundles for ' + bundleToStart, err);
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
            },
            processBundleJS: function (bundles, callback) {
                var me = this;
                var loading = [];
                var done = function (id) {
                    // remove id from loading array
                    var index = loading.indexOf(id);
                    loading.splice(index, 1);
                    // once loading is empty - call callback
                    if (loading.length === 0) {
                        callback();
                    }
                };
                bundles.forEach(function (item) {
                    var bundle = Oskari.bundle(item.id);
                    if (!bundle.clazz || !bundle.metadata || !bundle.metadata.source) {
                        return;
                    }
                    loading.push(item.id);
                    me.handleBundleLoad(item.path, bundle.metadata.source, item.id, function () {
                        done(item.id);
                    });
                });
            },
            handleBundleLoad: function (basePath, src, bundleId, callback) {
                var files = [];
                function registerGlobalExpose(expose, path) {
                    if (!expose) {
                        return;
                    }
                    globalExpose[path] = expose;
                }

                // src.locales
                if (src.locales) {
                    src.locales.forEach(function (file) {
                        if (file.lang && file.lang !== Oskari.getLang()) {
                            // dont load locale files that have declared language 
                            // and are not the language Oskari is started with.
                            return;
                        }
                        if (file.src.endsWith('.js')) {
                            var path = getPath(basePath, file.src);
                            files.push(path);
                            registerGlobalExpose(file.expose, path);
                        }
                    });
                }
                // src.resources
                if (src.resources) {
                    src.resources.forEach(function (file) {
                        if (file.src.endsWith('.js')) {
                            files.push(getPath(basePath, file.src));
                        }
                    });
                }
                // src.scripts
                if (src.scripts) {
                    src.scripts.forEach(function (file) {
                        var path = getPath(basePath, file.src);

                        if (file.src.endsWith('.js')) {
                            files.push(path);
                            registerGlobalExpose(file.expose, path);
                        } else if (file.src.endsWith('.css')) {
                            linkFile(path);
                        }
                    });
                }

                // src.links
                if (src.links) {
                    src.links.forEach(function (file) {
                        if (file.rel.toLowerCase() === 'import') {
                            linkFile(getPath(basePath, file.href), file.rel, 'text/html');
                        }
                    });
                }
                require(files, function () {
                    for (var i = 0; i < arguments.length; ++i) {
                        if (typeof arguments[i] !== 'undefined') {
                            // this would be a linked file.js with amd support
                            var key = globalExpose[files[i]];
                            if (key) {
                                if(typeof window[key] !== 'undefined') {
                                    log.error('Global variable ' + key + ' is being overwritten with new value as a result of bundle.js expose: ', files[i], ' by ' + bundleId);
                                }
                                window[key] = arguments[i];
                                log.info(bundleId + ' exposed ' + key + ' from ' + files[i]);
                            } else {
                                log.warn('Support for AMD-files is not yet implemented. Bundles need to have an "expose" statement in bundle.js to register libs as globals.', files[i]);
                            }
                        }
                    }
                    callback();
                }, function (err) {
                    log.error('Error loading files', files, err);
                    callback();
                });
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
