/* 
 * Oskari 1.x compatibility mode loader
 * 
 * This module will be deprecated for Oskari 2.0
 * 
 * This module implements Oskari 1.x loader which will
 * be replaced with requirejs.org require based implementation.
 * 
 * This implements Oskari 1.x loader with require calls.
 * 
 * This is free software. 
 *  
 */


define(['oskari', 'jquery', 'exports', 'css'], function(Oskari, $, exports) {

    var instTs = new Date().getTime();

    var basePathForBundles = null;

    var pathBuilders = {
        'default' : function(fn, bpath) {
            if (basePathForBundles) {
                return basePathForBundles + fn;
            }
            return fn;
        },
        'dev' : function(fn, bpath) {
            if (basePathForBundles) {
                return basePathForBundles + fn + "?ts=" + instTs;
            }
            return fn + "?ts=" + instTs;
        }
    };

    function buildPathForLoaderMode(fn, bpath) {
        var pathBuilder = pathBuilders[Oskari.getLoaderMode()];
        if (!pathBuilder) {
            if (basePathForBundles) {
                return basePathForBundles + fn;
            }
            return fn;
        }

        return pathBuilder(fn, bpath);
    }

    var isNotPackMode = {
        'dev' : true,
        'default' : true,
        'static' : true
    };

    function isPackedMode() {
        return !isNotPackMode[Oskari.getLoaderMode()];
    }

    function buildPathForPackedMode(bpath) {
        return bpath + "/build/" + Oskari.getLoaderMode() + ".js";
    }

    function buildBundlePathForPackedMode(bpath) {
        return bpath + "/build/bundle-" + Oskari.getLoaderMode() + ".js";
    }

    function buildLocalePathForPackedMode(bpath) {
        return bpath + "/build/" + Oskari.getLoaderMode() + "-locale-" + Oskari.bundle_locale.getLang() + ".js";
    }

    var bundle_loader_id = 0;

    var blMimeTypeToPlugin = {
        "text/javascript" : function(fn) {
            return fn;
        },
        "text/css" : function(fn) {
            return "css!" + fn;
        }
    };

	/**
	 * @class Oskari.BundleLoader
	 * 
	 * Oskari 1.x loader 
	 *  
	 */
    Oskari.clazz.define('Oskari.BundleLoader', function(manager, cb) {
        this.loader_identifier = ++bundle_loader_id;
        this.manager = manager;
        this.callback = cb;

        this.filesRequested = 0;
        this.filesLoaded = 0;
        this.files = {};
        this.fileList = [];
        this.metadata = {};
        this.mimeTypeToPlugin = blMimeTypeToPlugin;
    }, {
        add : function(fn, pdef) {
            var me = this;
            var mimeType = ( pdef ? pdef.type : null ) || "text/javascript";
            if (!me.files[fn]) {
                var def = {
                    src : me.mimeTypeToPlugin[mimeType](fn),
                    type : mimeType,
                    id : pdef ? pdef.id : null,
                    state : false

                };
                me.files[fn] = def;

                if ("text/javascript" === def.type) {
                    me.filesRequested++;
                }
                me.fileList.push(def);
            }
        },
        getState : function() {
            if (this.filesRequested == 0)
                return 1;

            return (this.filesLoaded / this.filesRequested);
        },
        config : function(conf) {
            require.config(conf);
        },
        /**
         * @method commit
         *
         * commits any script loading requests
         */
        commit : function() {
            var head = document.getElementsByTagName("head")[0];
            var fragment = document.createDocumentFragment();
            var me = this;
            var numFiles = this.filesRequested;
            if (numFiles == 0) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }
            if (Oskari.getPreloaded()) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }

            var reqs = [];
            for (var n = 0; n < me.fileList.length; n++) {
                var def = me.fileList[n];
                var fn = def.src;

                reqs.push(fn);
            }

            require(reqs, function() {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true)

            })
        }
    });

	/**
	 * a set of loader supporting methods for Oskari.BundleManager 
	 *  
	 */
    Oskari.clazz.category('Oskari.BundleManager', 'loader_1_x', {

        /**
         * @method loadBundleDefinition
         * @param implid
         * @param bundleSrc
         * @param c
         *
         * Loads Bundle Definition from JavaScript file JavaScript shall contain
         * install or installBundleClass call.
         */
        loadBundleDefinition : function(implid, bundleSrc, pbundlePath) {
            var me = this;
            var bundleImpl = implid;
            me.log("loadBundleDefinition called with " + bundleImpl);
            var defState = me.stateForBundleDefinitions[bundleImpl];
            if (defState) {
                if (defState.state == 1) {
                    me.log("bundle definition already loaded for " + bundleImpl);
                    me.postChange(null, null, "bundle_definition_loaded");
                    return;
                } else {
                    me.log("bundle definition already loaded OR WHAT?" + bundleImpl + " " + defState.state);
                    return;
                }

            } else {
                defState = {
                    state : -1
                };
                me.stateForBundleDefinitions[bundleImpl] = defState;
                me.log("set NEW state for DEFINITION " + bundleImpl + " to " + defState.state);
            }

            defState.bundleSrcPath = bundleSrc;
            var bundlePath = pbundlePath || (bundleSrc.substring(0, bundleSrc.lastIndexOf('/')));
            defState.bundlePath = bundlePath;

            var bl = Oskari.clazz.create('Oskari.BundleLoader', this, function() {
                me.log("bundle_def_loaded_callback");
            });
            bl.metadata['context'] = 'bundleDefinition';

            defState.loader = bl;

            bl.add(bundleSrc);
            bl.commit();
        },
        /**
         * @method loadBundleSources
         * @param implid
         * @param c
         *
         * Registers and commits JavaScript load request from bundle manifesst A
         * trigger is fired after all JavaScript files have been loaded.
         */
        loadBundleSources : function(implid) {
            // load any JavaScripts for bundle
            // MUST be done before createBundle
            var me = this;
            var bundleImpl = implid;

            me.log("loadBundleSources called with " + bundleImpl);
            var defState = me.stateForBundleDefinitions[bundleImpl];
            // log(defState);

            if (!defState) {
                throw "INVALID_STATE: bundle definition load not requested for " + bundleImpl;
            }
            if (defState) {
                me.log("- definition STATE for " + bundleImpl + " at load sources " + defState.state);
            }

            if (Oskari.getLoaderMode() == 'static') {
                me.postChange(null, null, "bundle_definition_loaded");
                return;
            }

            var srcState = me.stateForBundleSources[bundleImpl];

            if (srcState) {
                if (srcState.state == 1) {
                    me.log("already loaded sources for : " + bundleImpl);
                    return;
                } else if (srcState.state == -1) {
                    me.log("loading previously pending sources for " + bundleImpl + " " + srcState.state + " or what?");
                } else {
                    throw "INVALID_STATE: at " + bundleImpl;
                }
            } else {
                srcState = {
                    state : -1
                };
                me.stateForBundleSources[bundleImpl] = srcState;
                me.log("setting STATE for sources " + bundleImpl + " to " + srcState.state);
            }

            if (defState.state != 1) {
                me.log("pending DEFINITION at sources for " + bundleImpl + " to " + defState.state + " -> postponed");

                return;
            }

            me.log("STARTING load for sources " + bundleImpl);

            var srcFiles = {
                count : 0,
                loaded : 0,
                files : {},
                config : {},
                require : []
            };
            var me = this;
            var callback = function() {
                me.log("finished loading " + srcFiles.count + " files for " + bundleImpl + ".");
                me.stateForBundleSources[bundleImpl].state = 1;
                me.log("set NEW state post source load for " + bundleImpl + " to " + me.stateForBundleSources[bundleImpl].state);

                me.postChange(null, null, "bundle_sources_loaded");
            };
            var bundlePath = defState.bundlePath;

            var srcs = me.sources[bundleImpl];

            if (srcs) {

                me.log("got sources for " + bundleImpl);

                for (p in srcs) {
                    if (p == 'scripts') {

                        var defs = srcs[p];

                        for (var n = 0; n < defs.length; n++) {
                            var def = defs[n];

                            srcFiles.count++;

                            var fn = buildPathForLoaderMode(def.src, bundlePath);

                            var fnWithPath = null;
                            if (fn.indexOf('http') != -1) {
                                fnWithPath = fn;
                            } else {
                                fnWithPath = bundlePath + '/' + fn;
                            }

                            srcFiles.files[fnWithPath] = def;
                        }
                    } else if (p == 'locales') {
                        var requiredLocale = Oskari.bundle_locale.getLang();
                        var defs = srcs[p];

                        for (var n = 0; n < defs.length; n++) {
                            var def = defs[n];

                            if (requiredLocale && def.lang && def.lang != requiredLocale) {
                                continue;
                            }

                            srcFiles.count++;
                            var fn = buildPathForLoaderMode(def.src, bundlePath);

                            var fnWithPath = null;
                            if (fn.indexOf('http') != -1) {
                                fnWithPath = fn;
                            } else {
                                fnWithPath = bundlePath + '/' + fn;
                            }

                            srcFiles.files[fnWithPath] = def;

                        }

                    } else if (p == 'requirements') {
                        var defs = srcs[p];
                        var defRequire = defs.require;

                        srcFiles.config = defs.config || {};
                        if (!srcFiles.config.paths) {
                            srcFiles.config.paths = {};
                        }
                        if (defs.aliases) {
                            for (var a in defs.aliases ) {
                                srcFiles.config.paths[a] = bundlePath + '/' + defs.aliases[a];
                            }
                        }

                        for (var n = 0; n < defRequire.length; n++) {
                            var def = defRequire[n];

                            srcFiles.require.push(def);
                        }

                    }
                }
            } else {
                me.log("NO sources for " + bundleImpl);

            }

            var bl = Oskari.clazz.create('Oskari.BundleLoader', this, callback);
            bl.metadata['context'] = 'bundleSources';
            bl.metadata['bundleImpl'] = bundleImpl;
            srcState.loader = bl;

            /**
             * if using compiled javascript
             */
            if (isPackedMode()) {

                var fileCount = 0;
                for (js in srcFiles.files) {
                    fileCount++;
                }
                if (fileCount > 0) {

                    var srcsFn = buildPathForPackedMode(bundlePath);
                    bl.add(srcsFn, "text/javascript");
                    me.log("- added PACKED javascript source " + srcsFn + " for " + bundleImpl);

                    var localesFn = buildLocalePathForPackedMode(bundlePath);
                    bl.add(localesFn, "text/javascript");
                    me.log("- added PACKED locale javascript source " + localesFn + " for " + bundleImpl);
                }

                /**
                 * else load any files
                 */
            } else {

                for (js in srcFiles.files) {
                    bl.add(js, srcFiles.files[js]);
                    me.log("- added script source " + js + " for " + bundleImpl);

                }

                for (var rq = 0; rq < srcFiles.require.length; rq++) {
                    bl.add(srcFiles.require[rq], srcFiles.require[rq]);
                    me.log("- added require " + srcFiles.require[rq] + " for " + bundleImpl);

                }
            }

            bl.config(srcFiles.config);
            bl.commit();

        }
    });

	/**
	 * a set of loader supporting methods for Oskari.BundleFacade 
	 *  
	 */
    Oskari.clazz.category('Oskari.BundleFacade', 'loader_1_x', {

        /*
         * @method requireBundle executes callback after bundle sources have
         * been loaded an d bundle has been created
         *
         */
        requireBundle : function(implid, bundleid, cb) {
            var me = this;
            var b = me.manager.createBundle(implid, bundleid);

            cb(me.manager, b);

        },
        /**
         * @method require executes callback after any requirements in bundle
         *         manifest have been met Work In Progress
         *
         */
        require : function(config, cb, info) {

            var me = this;
            me.manager.on(config, cb, info);
            var imports = config['Import-Bundle'];
            for (p in imports) {
                var pp = p;
                var def = imports[p];

                var bundlePath = def.bundlePath || me.bundlePath;
                /*
                 * var bundleDefFilename = bundlePath + pp + "/bundle.js?ts=" +
                 * (new Date().getTime());
                 */
                if (isPackedMode()) {
                    var packedBundleFn = buildBundlePathForPackedMode(bundlePath + pp);
                    bundleDefFilename = buildPathForLoaderMode(packedBundleFn, bundlePath);
                } else {
                    bundleDefFilename = buildPathForLoaderMode(bundlePath + pp + "/bundle.js", bundlePath);
                }
                me.manager.log("FACADE requesting load for " + pp + " from " + bundleDefFilename);
                me.manager.loadBundleDefinition(pp, bundleDefFilename, bundlePath + pp);
                me.manager.loadBundleSources(pp);
            }
        },
        setBundlePath : function(p) {
            this.bundlePath = p;
        }, /*
         * @method loadBundleDeps
         */
        loadBundleDeps : function(deps, callback, manager, info) {
            var me = this;
            var bdep = deps["Import-Bundle"];
            var depslist = [];

            var hasPhase = false;

            for (p in bdep) {
                var name = p;
                var def = bdep[p];
                depslist.push({
                    name : name,
                    def : def,
                    phase : def.phase
                });
                hasPhase = hasPhase || def.phase;
            }

            depslist.sort(function(a, b) {
                if (!a.phase && !b.phase)
                    return 0;
                if (!a.phase)
                    return 1;
                if (!b.phase)
                    return -1;
                return a.phase < b.phase ? -1 : 1;
            });

            if (hasPhase || !Oskari.getSupportBundleAsync()) {
                me.loadBundleDep(depslist, callback, manager, info);
            } else {
                me.loadBundleDepAsync(deps, callback, manager, info);
            }
        },
        /**
         * @method loadBundleDep
         *
         * maintains some a sort of order in loading
         */
        loadBundleDep : function(depslist, callback, manager, info) {
            var me = this;
            var bundledef = depslist.pop();
            if (!bundledef) {
                callback(manager);
                return;
            }

            var def = bundledef.def;
            var bundlename = bundledef.name;

            var fcd = this;
            var bdep = {
                "Import-Bundle" : {}
            };
            bdep["Import-Bundle"][bundlename] = def;
            fcd.require(bdep, function(manager) {
                me.loadBundleDep(depslist, callback, manager, info);
            }, info);
        },
        /**
         * @method loadBundleDep
         *
         * load bundles regardless of order
         */
        loadBundleDepAsync : function(deps, callback, manager, info) {

            var me = this;
            var fcd = this;

            fcd.require(deps, callback, info);
        },
        /**
         * @method playBundle
         *
         * plays a bundle player JSON object by instantiating any
         * required bundle instances
         *
         */
        playBundle : function(recData, cb) {

            // alert(bundleRec.get('title'));
            var metas = recData['metadata'];
            var bundlename = recData['bundlename'];
            var bundleinstancename = recData['bundleinstancename'];
            var isSingleton = metas["Singleton"];
            var fcd = this;
            var me = this;
            var instanceRequirements = metas["Require-Bundle-Instance"] || [];
            var instanceProps = recData.instanceProps;

            me.loadBundleDeps(metas, function(manager) {
                for (var r = 0; r < instanceRequirements.length; r++) {
                    var implInfo = instanceRequirements[r];
                    /* implname */
                    var implid = ( typeof (implInfo) === 'object' ) ? implInfo.bundlename : implInfo;
                    /* bundlename */
                    var bundleid = ( typeof (implInfo) === 'object' ) ? implInfo.bundleinstancename : implInfo + "Instance";
                    var b = me.bundles[implid];
                    if (!b) {
                        b = manager.createBundle(implid, bundleid);
                        me.bundles[implid] = b;
                    }

                    var bi = me.bundleInstances[bundleid];
                    if (!bi || !isSingleton) {
                        bi = manager.createInstance(bundleid);
                        me.bundleInstances[bundleid] = bi;

                        var configProps = me.getBundleInstanceConfigurationByName(bundleid);
                        if (configProps) {
                            for (ip in configProps) {
                                bi[ip] = configProps[ip];
                            }
                        }
                        bi.start();
                    }
                }

                fcd.requireBundle(bundlename, bundleinstancename, function() {
                    var yy = manager.createInstance(bundleinstancename);

                    for (ip in instanceProps) {
                        yy[ip] = instanceProps[ip];
                    }

                    var configProps = me.getBundleInstanceConfigurationByName(bundleinstancename);
                    if (configProps) {
                        for (ip in configProps) {
                            yy[ip] = configProps[ip];
                        }
                    }

                    yy.start();
                    me.bundleInstances[bundleinstancename] = yy;

                    cb(yy);
                });
            }, fcd.manager, bundlename);
        },

        /**
         * @method startApplication
         *
         * Starts JSON setup (set with setApplicationSetup)
         *
         */
        startApplication : function(cb) {
            var me = this;
            var appSetup = this.appSetup;
            var appConfig = this.appConfig;
            var seq = this.appSetup.startupSequence.slice(0);
            var seqLen = seq.length;

            var startupInfo = {
                bundlesInstanceConfigurations : appConfig,
                bundlesInstanceInfos : {}
            };

            /**
             * Let's shift and playBundle until all done
             */

            var mediator = {
                facade : me,
                seq : seq,
                bndl : null,
                player : null,
                startupInfo : startupInfo
            };

            function schedule() {
                window.setTimeout(mediator.player, 0);
            }


            mediator.player = function() {

                mediator.bndl = mediator.seq.shift();
                if (mediator.bndl == null) {
                    if (cb) {
                        cb(startupInfo);
                    }
                    return;
                }

                mediator.facade.playBundle(mediator.bndl, function(bi) {

                    var bndlName = mediator.bndl.bundlename;
                    var bndlInstanceName = mediator.bndl.bundleinstancename;

                    mediator.startupInfo
                    .bundlesInstanceInfos[bndlInstanceName] = {
                        bundlename : bndlName,
                        bundleinstancename : bndlInstanceName,
                        bundleInstance : bi
                    };
                    if (mediator.bndl.callback) {
                        if ( typeof mediator.bndl.callback === "string") {
                            eval(mediator.bndl.callback);
                        }
                        mediator.bndl.callback.apply(this, [bi, bndl]);
                    }
                    schedule();
                });
            };
            schedule();

        },
        /**
         * @method stopApplication Might stop application if all stops implemented
         */
        stopApplication : function() {
            throw "NYI";
        },
        /*
         * @method setApplicationSetup @param setup JSON application setup {
         * startupSequence: [ <bundledef1>, <bundledef2>, <bundledef3>, ] }
         *
         * Each bundledef is of kind playable by method playBundle. callback:
         * property may be set to receive some feedback - as well as
         * registerLoaderStateListener
         */
        setApplicationSetup : function(setup) {
            this.appSetup = setup;
        },
        /**
         * @method getApplicationSetup
         * @return JSON application setup
         */
        getApplicationSetup : function() {
            return this.appSetup;
        }
    });

});
