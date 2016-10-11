// So IE won't use a cached xhr result -> adds a _=timestamp param for each request...
jQuery.ajaxSetup({ cache: false });

(function(o){
    if(!o) {
        // can't add loader if no Oskari ref
        return;
    }
    /* legacy Bundle_facade */
    /**
     * @class Oskari.Bundle_facade
     * Highlevel interface to bundle management Work in progress
     *
     * @param {} bundleManager
     *
     */
    var Bundle_facade = function () {
        /**
         * @property appSetup
         * application startup sequence
         */
        this.appSetup = null;

        /**
         * @property appConfig
         * application configuration (state) for instances
         * this is injected to instances before 'start' is called
         *
         */
        this.appConfig = {};
    };

    /**
     * FACADE will have only a couple of methods which trigger alotta operations
     */
    Bundle_facade.prototype = {
        /**
         * @public @method getBundleInstanceConfigurationByName
         * Returns configuration for instance by bundleinstancename
         *
         * @param  {string} biid Bundle instance ID
         *
         * @return {Object}      Bundle instance configuration
         */
        getBundleInstanceConfigurationByName: function (biid) {
            return this.appConfig[biid];
        },

        /**
         * @public @method playBundle
         * Plays a bundle player JSON object by instantiating any required
         * bundle instances.
         *
         * @param {Object}           recData  Bundle player JSON
         * @param {function(Object)} callback Callback function
         *
         */
        playBundle: function (recData, config, callback) {
            if(typeof recData !== 'object') {
                throw new Error('Bundle def is not an object');
            }
            if(typeof config === 'function') {
                callback = config;
                config = undefined;
            }

            if(config) {
                // wrap to acceptable format
                var configName = recData.bundleinstancename || recData.bundlename;
                var tmp = {};
                tmp[configName] = config;
                config = tmp;
            }
            else {
                config = this.appConfig;
            }
            var loader = Oskari.loader([recData], config);
            loader.processSequence(callback);
        },
        /**
         * Convenience function to load appsetup from url with given params and startup the Oskari app.
         * @param  {String}   url       Url to load the appsetup json from
         * @param  {Object}   params    Optional parameters to pass for the request
         * @param  {Function} errorCB   Optional callback for handling error
         * @param  {Function} successCB Optional callback that is called when the application has started
         * @param  {Function} modifyCB  Optional callback that is called appsetup is loaded, but before it's used by Oskari
         */
        loadAppSetup : function(url, params, errorCB, successCB, modifyCB) {
            var me = this;
            jQuery.ajax({
                type : 'GET',
                dataType : 'json',
                data : params || {},
                url: url,
                success : function(setup) {
                    if(typeof modifyCB ==='function') {
                        modifyCB(setup);
                    }
                    me.setApplicationSetup(setup);
                    me.startApplication(successCB);
                },
                error : function(jqXHR) {
                    if(typeof errorCB === 'function') {
                        errorCB(jqXHR);
                    }
                }
            });
        },
        /**
         * @public @method setApplicationSetup
         * Each bundledef is of kind playable by method playBundle. callback:
         * property may be set to receive some feedback - as well as
         * registerLoaderStateListener
         *
         * @param {Object} setup JSON application setup {
         * startupSequence: [ <bundledef1>, <bundledef2>, <bundledef3>, ] }
         *
         */
        setApplicationSetup: function (setup) {
            this.appSetup = setup;
            if(setup.configuration) {
                this.setConfiguration(setup.configuration);
            }
            setup.env = setup.env || {};
            if(typeof Oskari.setLang === 'function') {
                Oskari.setLang(setup.env.lang || window.language);
            }
            if(typeof Oskari.setSupportedLocales === 'function') {
                Oskari.setSupportedLocales(setup.env.locales);
            }
            if(typeof Oskari.setDecimalSeparator === 'function') {
                Oskari.setDecimalSeparator(setup.env.decimalSeparator);
            }

            if(typeof Oskari.setMarkers === 'function') {
                Oskari.setMarkers(setup.env.svgMarkers || []);
            }
        },

        /**
         * @public @method getApplicationSetup
         * @return {Object} Application setup
         */
        getApplicationSetup: function () {
            return this.appSetup;
        },

        /**
         * @public @method setConfiguration
         * @param {Object} config Config
         */
        setConfiguration: function (config) {
            this.appConfig = config;
        },

        /**
         * @public @method getConfiguration
         * @return {Object}
         */
        getConfiguration: function () {
            return this.appConfig;
        },

        startApplication: function (callback) {
            var loader = Oskari.loader(this.appSetup.startupSequence, this.appConfig);
            loader.processSequence(callback);
        },

        /**
         * @method stopApplication
         * Might stop app if/when all stops implemented
         */
        stopApplication: function () {
            throw new Error('Not supported');
        }
    };
    o.app = new Bundle_facade();
}(Oskari));