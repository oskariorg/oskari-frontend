
(function (o) {
    if (!o || !o.clazz) {
        // can't add loader if no Oskari ref
        return;
    }
    var log = Oskari.log('Oskari.BundleManager');
    /**
     * singleton instance of the class system
     */
    var cs = o.clazz;

    /* legacy Bundle_manager */

    /**
     * @singleton @class Oskari.Bundle_manager
     */
    var BundleManager = function () {
        this.clazz = o.clazz;
        var me = this;
        me.serial = 0;
        me.bundleDefinitions = {};
        me.sources = {};
        me.bundleInstances = {};
        me.bundles = {};

        /*
         * CACHE for lookups state management
         */
        me.bundleDefinitionStates = {};

        me.bundleSourceStates = {};

        /* CACHE for statuses */
        me.bundleStates = {};

        me.loaderStateListeners = [];
    };

    BundleManager.prototype = {

        /**
         * @private @method _getSerial
         *
         *
         * @return {number}
         */
        _getSerial: function () {
            this.serial += 1;
            return this.serial;
        },

        /**
         * @private @method _purge
         */
        _purge: function () {
            var p;
            var me = this;

            for (p in me.sources) {
                if (me.sources.hasOwnProperty(p)) {
                    delete me.sources[p];
                }
            }
            for (p in me.bundleDefinitionStates) {
                if (me.bundleDefinitionStates.hasOwnProperty(p)) {
                    delete me.bundleDefinitionStates[p].loader;
                }
            }
            for (p in me.bundleSourceStates) {
                if (me.bundleSourceStates.hasOwnProperty(p)) {
                    delete me.bundleSourceStates[p].loader;
                }
            }
        },

        /**
         * @private @method _install
         * installs bundle
         * DOES not INSTANTIATE only register bundleDefinition as function
         * declares any additional sources required
         *
         * @param {string}   biid             Bundle implementation id
         * @param {function} bundleDefinition Bundle registration function
         * @param {Object}   srcFiles         Source files
         * @param {Object}   bundleMetadata   Bundle metadata
         *
         */
        _install: function (biid, bundleDefinition, srcFiles, bundleMetadata) {
            var me = this;
            var defState = me.bundleDefinitionStates[biid];

            if (defState) {
                defState.state = 1;
                log.debug('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' existing state to ' + defState.state);
            } else {
                defState = {
                    state: 1
                };

                me.bundleDefinitionStates[biid] = defState;
                log.debug('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' NEW state to ' + defState.state);
            }
            defState.metadata = bundleMetadata;

            me.bundleDefinitions[biid] = bundleDefinition;
            me.sources[biid] = srcFiles;
            // postChange(null, null, 'bundle_definition_loaded');
        },

        /**
         * @public @method installBundleClass
         * Installs a bundle defined as Oskari native Class.
         *
         * @param {string} biid      Bundle implementation ID
         * @param {string} className Class name
         *
         */
        installBundleClass: function (biid, className) {
            var clazz = Oskari.clazz.create(className);
            if (clazz) {
                // Oskari.bundle is the new registry for requirejs loader
                Oskari.bundle(biid, {
                    clazz: clazz,
                    metadata: cs.getMetadata(className).meta
                });
            }
        },

        /**
         * @public @method installBundleClassInfo
         * Installs a bundle defined as Oskari native Class
         *
         * @param {string} biid      Bundle implementation ID
         * @param {Object} classInfo ClassInfo
         *
         */
        installBundleClassInfo: function (biid, classInfo) {
            var bundleDefinition = cs.getBuilderFromClassInfo(classInfo);
            var bundleMetadata = classInfo._metadata;
            var sourceFiles = {};

            if (biid === null || biid === undefined) {
                throw new TypeError('installBundleClassInfo(): Missing biid');
            }

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'installBundleClassInfo(): Missing classInfo'
                );
            }

            this._install(
                biid,
                bundleDefinition,
                sourceFiles,
                bundleMetadata
            );
        },

        /**
         * @public @method createBundle
         * Creates a Bundle (NOTE NOT an instance of bundle)
         * implid, bundleid most likely same value
         *
         * @param  {string} biid Bundle implementation ID
         * @param  {string} bid  Bundle ID
         *
         * @return {Object}      Bundle
         */
        createBundle: function (biid, bid) {
            var bundle;
            var bundleDefinition;
            var me = this;
            var bundleDefinitionState;

            if (biid === null || biid === undefined) {
                throw new TypeError('createBundle(): Missing biid');
            }

            if (bid === null || bid === undefined) {
                throw new TypeError('createBundle(): Missing bid');
            }

            bundleDefinitionState =
                me.bundleDefinitionStates[biid];

            if (!bundleDefinitionState) {
                throw new Error(
                    'createBundle(): Couldn\'t find a definition for' +
                        ' bundle ' + biid + '/' + bid +
                        ', check spelling and that the bundle has been' +
                        ' installed.'
                );
            }
            bundleDefinition = this.bundleDefinitions[biid];
            // FIXME no alerts please. Throw something or log something.
            if (!bundleDefinition) {
                alert('this.bundleDefinitions[' + biid + '] is null!');
                return;
            }
            bundle = bundleDefinition(bundleDefinitionState);
            this.bundles[bid] = bundle;
            this.bundleStates[bid] = {
                state: true,
                bundlImpl: biid
            };
            // postChange(bundle, null, 'bundle_created');
            return bundle;
        },

        /**
         * @public @method createInstance
         * Creates a bundle instance for previously installed and created bundle
         *
         * @param  {string} bid Bundle ID
         *
         * @return {Object}     Bundle instance
         */
        createInstance: function (bid) {
            // creates a bundle_instance
            // any configuration and setup IS BUNDLE / BUNDLE INSTANCE specific
            // create / config / start / process / stop / destroy ...
            var me = this;
            var bundle;
            var bundleInstance;
            var bundleInstanceId;

            if (bid === null || bid === undefined) {
                throw new TypeError('createInstance(): Missing bid');
            }

            if (!me.bundleStates[bid] ||
                    !me.bundleStates[bid].state) {
                throw new Error(
                    'createInstance(): Couldn\'t find a definition for' +
                        ' bundle ' + bid + ', check spelling' +
                        ' and that the bundle has been installed.'
                );
            }

            bundle = this.bundles[bid];
            if (bundle === null || bundle === undefined) {
                // TODO find out how this could happen, offer a solution
                throw new Error(
                    'createInstance(): Couldn\'t find bundle with id' + bid
                );
            }

            bundleInstance = bundle.create();
            if (bundleInstance === null || bundleInstance === undefined) {
                throw new Error(
                    'createInstance(): Couldn\'t create bundle ' + bid +
                        ' instance. Make sure your bundle\'s create function' +
                        ' returns the instance.'
                );
            }
            bundleInstanceId = me._getSerial().toString();

            this.bundleInstances[bundleInstanceId] = bundleInstance;

            // postChange(bundle, bundleInstance, 'instance_created');
            return bundleInstance;
        },

        /**
         * @private @method _destroyInstance
         * Destroys and unregisters bundle instance
         *
         * @param {string} biid Bundle instance ID
         *
         * @return
         */
        _destroyInstance: function (biid) {
            var bundleInstance;

            if (biid === null || biid === undefined) {
                throw new TypeError('_destroyInstance(): Missing biid');
            }

            bundleInstance = this.bundleInstances[biid];
            this.bundleInstances[biid] = null;
            bundleInstance = null;

            return bundleInstance;
        }
    };

    o.bundle_manager = new BundleManager();
}(Oskari));
