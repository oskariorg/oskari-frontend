/**
 * @class Oskari.userinterface.extension.DefaultExtension
 *
 *
 */
Oskari.clazz.define("Oskari.userinterface.extension.DefaultExtension",

/**
 * @method create called automatically on construction
 * @static
 * @param name {String} bundle name to be used for communication with sandbox
 * @param tileClazz {String} an optional class name for
 *
 */
function(name, flyoutClazz, tileClazz) {
    this.sandbox = null;
    this.plugins = {};
    this._localization = null;
    this.conf = {
        "name" : name,
        "tileClazz" : tileClazz || 'Oskari.userinterface.extension.DefaultTile',
        "flyoutClazz" : flyoutClazz || 'Oskari.userinterface.extension.DefaultFlyout'
    };
}, {
    /**
     * @method getTitle
     * Extension protocol method
     * @return {String} localized text for the title of the component
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription
     * Extension protocol method
     * @return {String} localized text for the description of the component
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method getSandbox
     * Convenience method to call from Tile and Flyout
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        var sandbox = Oskari.$("sandbox");

        me.sandbox = sandbox;
        sandbox.register(this);

        /* stateful */
        sandbox.registerAsStateful(this.mediator.bundleId, this);

        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

        sandbox.request(this, request);

    },
    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var sandbox = this.sandbox;

        /* sandbox cleanup */

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
        sandbox.request(this, request);

        sandbox.unregisterStateful(this.mediator.bundleId);
        sandbox.unregister(this);
        this.sandbox = null;
        this.started = false;
    },
    /**
     * @method startExtension
     * Extension protocol method
     */
    startExtension : function() {
        var me = this;
        var sandbox = me.sandbox;

        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        var locFlyout = me.getLocalization('flyout');
        if(locFlyout && me.conf.flyoutClazz) {
            me.plugins['Oskari.userinterface.Flyout'] = 
            Oskari.clazz.create(me.conf.flyoutClazz, me, locFlyout);
        }

        var locTile = me.getLocalization('tile');
        if(locTile && me.conf.tileClazz) {
            me.plugins['Oskari.userinterface.Tile'] = 
            Oskari.clazz.create(me.conf.tileClazz, me, locTile);
        }
    },
    /**
     * @method stopExtension
     * Extension protocol method
     */
    stopExtension : function() {
        var me = this;
        var sandbox = me.sandbox;
        for(p in me.eventHandlers) {
            sandbox.unregisterFromEventByName(me, p);
        }
        for(var pluginType in me.plugins) {
            if(pluginType) {
                me.plugins[pluginType] = null;
            }
        }
    },
    /**
     * @method getPlugins
     * Extension protocol method
     */
    getPlugins : function() {
        return this.plugins;
    },
    "init" : function() {
        return null;
    },
    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.conf.name;
    },
    /**
     * @method getConfiguration
     */
    getConfiguration : function() {
        return this.conf;
    },
    
    /**
     * @property eventHandlers
     * may be overridden in derived classes to get some events
     */
    "eventHandlers" : {
        
    },
    
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
     /**
     * @method getLang
     * helper to get current language from Oskari
     * 
     */
    "getLang" : function()  {
        return Oskari.getLang();
    }
}, {
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
