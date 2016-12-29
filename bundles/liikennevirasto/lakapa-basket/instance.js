/**
 * @class Oskari.liikennevirasto.bundle.lakapa.BasketBundleInstance
 *
 */
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.BasketBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    this.sandbox = null;
    this.plugins = {};
    this._localization = null;

    /**
     * @property mediator
     * Loader sets this
     */
    this.mediator = null;

}, {
    /**
     * @static
     * @property __name
     */
    __name : 'LakapaBasketBundle',

    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.__name;
    },
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
     * @return {Oskari.Sandbox}
     */
    getSandbox : function() {
    	var me = this;
        return me.sandbox;
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
     * @method startExtension
     * Extension protocol method
     */
    startExtension : function() {
        var me = this;
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.BasketBundle.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.BasketBundle.Tile', this);
    },

    /**
     * @method stopExtension
     * Extension protocol method
     */
    stopExtension : function() {
        var me = this;
        for (var pluginType in me.plugins) {
            if (pluginType) {
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


    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        var conf = this.conf;
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        me.sandbox = Oskari.getSandbox(sandboxName);

        this.localization = Oskari.getLocalization(this.getName());

        // register to sandbox as a module
        me.sandbox.register(me);


        // register to listening events
        for (var p in me.eventHandlers) {
            if (p) {
                me.sandbox.registerForEventByName(me, p);
            }
        }
        //Let's extend UI with Flyout and Tile
        var request = me.sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        me.sandbox.request(this, request);

        // draw ui
        me._createUI();

        // request
    	this.requestHandlers = {
    		AddToBasketRequest : Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.AddToBasketRequestHandler', me.sandbox, me.plugins['Oskari.userinterface.Flyout'], me.plugins['Oskari.userinterface.Tile']),
    		ClearBasketRequest : Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.ClearBasketRequestHandler', me.sandbox, me.plugins['Oskari.userinterface.Flyout'], me.plugins['Oskari.userinterface.Tile']),
    		RefreshBasketRequest : Oskari.clazz.create('Oskari.liikennevirasto.bundle.lakapa.RefreshBasketRequestHandler', me.sandbox, me.plugins['Oskari.userinterface.Flyout'], me.plugins['Oskari.userinterface.Tile'])
    	};

    	me.sandbox.addRequestHandler('AddToBasketRequest', this.requestHandlers.AddToBasketRequest);
    	me.sandbox.addRequestHandler('ClearBasketRequest', this.requestHandlers.ClearBasketRequest);
    	me.sandbox.addRequestHandler('RefreshBasketRequest', this.requestHandlers.RefreshBasketRequest);

    	me.sandbox.registerAsStateful(me.mediator.bundleId, me);
    },

    /**
     * @method init
     * Module protocol method
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },

    /**
     * @method onEvent
     * Module protocol method/Event dispatch
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },

    /**
     * @static
     * @property eventHandlers
     * Best practices: defining which
     * events bundle is listening and how bundle reacts to them
     */
    eventHandlers : {
        // not listening to any events
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        // unregister from listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.unregisterFromEventByName(me, p);
            }
        }
        var request =
            sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(me);
        sandbox.request(me, request);
        // unregister module from sandbox
        me.sandbox.unregister(me);
    },
    /**
     * @method _createUI
     * @private
     *
     * Custom method, do what ever you like
     * Best practices: start internal/private methods with an underscore
     */
    _createUI : function() {
        var me = this;
        for (var pluginType in me.plugins) {
            if (pluginType) {
                me.plugins[pluginType].createUI();
            }
        }
    },
    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState: function (state) {
        var me = this;
        for (var pluginType in me.plugins) {
            if (pluginType) {
                me.plugins[pluginType].setState(state);
            }
        }
    }

}, {
    protocol : [ 'Oskari.bundle.BundleInstance',
                 'Oskari.mapframework.module.Module',
                 'Oskari.userinterface.Extension' ]
});
