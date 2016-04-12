
Oskari.bundle = function(bundleId, value) {
    if(!Oskari.samiRegistry) {
        Oskari.samiRegistry = {};
    }
    if(value) {
        Oskari.samiRegistry[bundleId] = value;
    }
    return Oskari.samiRegistry[bundleId];
};
/**
 * Loader
 * @param  {[type]} startupSequence [description]
 * @param  {[type]} config          [description]
 * @return {[type]}                 [description]
 */
Oskari.loader = function(startupSequence, config) {
    var sequence = startupSequence.slice(0);
    var appConfig = config;

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
         * @param  {[type]} sequence [description]
         * @return {[type]}          [description]
         */
        processSequence : function(done) {
            var me = this;
            if(sequence.length === 0) {
                // everything has been loaded
                done();
                return;
            }
            var seqToLoad = sequence.shift();
            if(typeof seqToLoad !== 'object') {
                // log error: block not object
                // iterate to next
                this.processSequence(done);
                return;
            }
            if(typeof seqToLoad.metadata !== 'object' ||
                typeof seqToLoad.metadata['Import-Bundle']  !== 'object') {
                // log error: "Nothing to load"
                // iterate to next
                this.processSequence(done);
                return;
            }

            var bundleToStart = seqToLoad.bundlename;
            // if bundleinstancename is missing, use bundlename for config key.
            var configId = seqToLoad.bundleinstancename || bundleToStart;
            var config = appConfig[configId] || {};
            var bundlesToBeLoaded = seqToLoad.metadata['Import-Bundle'];
            var paths = [];
            var bundles = [];
            for(var id in bundlesToBeLoaded) {
                var value = bundlesToBeLoaded[id];
                if(typeof value !== 'object' ||
                    typeof value.bundlePath !== 'string') {
                    // log error: bundle object not defined
                    continue;
                }
                var basepath = value.bundlePath + '/' + id;
                var path = basepath + '/bundle.js';
                paths.push(path.split('//').join('/'));
                bundles.push({
                    id : id,
                    path : basepath
                });
            }
            if(Oskari.bundle(bundleToStart)) {
                console.log('Bundle preloaded ' + bundleToStart);
                me.startBundle(bundleToStart, config);
                this.processSequence(done);
                return;
            }
            console.log('Loading bundles');
            // load all bundlePaths mentioned in sequence-block
            require(paths, function() {
                // if loaded undefined - find from Oskari.instalBundle register with id
                for(var i = 0; i < arguments.length; ++i) {
                    if(typeof arguments[i] !== 'undefined') {
                        // this would be a bundle.js with amd support
                        debugger;
                    }
                }
                console.log('Loaded bundles', bundles);
                // the loaded files have resulted in calls to
                // Oskari.bundle_manager.installBundleClass(id, "Oskari.mapframework.domain.Bundle");
                // TODO: loop all bundles and require sources from installs
                me.processBundleJS(bundles, function() {
                    me.startBundle(bundleToStart, config);
                    me.processSequence(done);
                });
            });
        },
        startBundle : function(bundleId, config) {
            var bundle = Oskari.bundle(bundleId);
            if(!bundle) {
                throw new Error('Bundle not loaded ' + bundleId);
            }
            var instance = bundle.clazz.create();
            if(!instance) {
                throw new Error('Couldnt start bundle with id ' + bundleId);
            }
            instance.mediator = {
                bundleId : bundleId
            }
            // quick'n'dirty property injection
            for(var key in config) {
                instance[key] = config[key];
            }
            console.log('Starting bundle ' + bundleId);
            try {
                instance.start();
            } catch(err) {
                throw new Error('Couldnt start bundle with id ' + bundleId);
            }
        },
        processBundleJS : function(bundles, callback) {
            var me = this;
            var loading = [];
            var done = function(id) {
                // remove id from loading array
                var index = loading.indexOf(id);
                loading.splice(index, 1);
                // once loading is empty - call callback
                if(loading.length === 0) {
                    callback();
                }

            };
            bundles.forEach(function(item) {
                var bundle = Oskari.bundle(item.id);
                if(!bundle.clazz || !bundle.metadata || !bundle.metadata.source) {
                    return;
                }
                loading.push(item.id);
                me.handleBundleLoad(item.path, bundle.metadata.source, function() {
                    done(item.id);
                });
            });
        },
        handleBundleLoad : function(basePath, src, callback) {
            var me = this;
            var files = [];

            // http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
            var absolute = function(base, relative) {
                var stack = base.split("/"),
                    parts = relative.split("/");
                stack.pop(); // remove current file name (or empty string)
                             // (omit if "base" is the current folder without trailing slash)
                for (var i=0; i<parts.length; i++) {
                    if (parts[i] == ".")
                        continue;
                    if (parts[i] == "..")
                        stack.pop();
                    else
                        stack.push(parts[i]);
                }
                return stack.join("/");
            }

            var getPath = function(base, src) {
                // handle case where src start with /
                var path = src;
                // handle relative ../../ case with src
                if (src.indexOf('/') !== 0) {
                    path = absolute(base, src);
                }
                return path.split('//').join('/');

            };
            // src.locales
            if(src.locales) {
                src.locales.forEach(function(file) {
                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                });
            }
            // src.resources
            if(src.resources) {
                src.resources.forEach(function(file) {
                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                });
            }
            // src.scripts
            if(src.scripts) {
                src.scripts.forEach(function(file) {

                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                    else if (file.src.endsWith('.css')) {
                        me.linkFile(getPath(basePath, file.src));
                    }
                });
            }

            // src.links
            if(src.links) {
                src.links.forEach(function(file) {
                    if(file.rel.toLowerCase() === 'import') {
                        me.linkFile(getPath(basePath, file.href), file.rel, 'text/html');
                    }
                });
            }
            require(files, function() {
                callback();
            });
        },
        linkFile : function(href, rel, type) {
            var importParentElement = document.head || document.body;
            var linkElement = document.createElement('link');
            linkElement.rel = rel || 'stylesheet';
            linkElement.type = type || 'text/css';
            linkElement.href = href;
            importParentElement.appendChild(linkElement);
        }

    }
    return loader;
};