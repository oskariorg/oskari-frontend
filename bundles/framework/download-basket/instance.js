/**
* @class Oskari.mapframework.bundle.downloadBasket.BundleInstance
*
* Oskari.mapframework.bundle.downloadBasket.
*/
Oskari.clazz.define("Oskari.mapframework.bundle.downloadBasket.BundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this._localization = null;
        this.cropping = null;
        this.basket = null;
        this.mapModule = null;
        this.startedTabs = false;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'download-basket',
        /**
         * @method getName
         * @public
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * Sets the sandbox reference to this component
         * @method setSandbox
         * @public
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * Gets sandbox
         * @method getSandbox
         * @public
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         * @method getLocalization
         * @public
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * Implements BundleInstance protocol start methdod
         * @method start
         * @public
         */
        start: function () {
            if (this.started) {
                return;
            }

            var me = this,
                conf = me.conf,
                sandboxName = conf ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.started = true;
            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            me.cropping = Oskari.clazz.create('Oskari.mapframework.bundle.downloadBasket.Cropping',
                this._localization.flyout['download-basket-cropping-tab'], me);
            me.cropping.setId('download-basket-cropping-tab');
            me.basket = Oskari.clazz.create('Oskari.mapframework.bundle.downloadBasket.Basket',
                this._localization.flyout['download-basket-tab'], me);
            me.basket.setId('download-basket-tab');

            me.cropping.setBasket(me.basket);

            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(me);
                sandbox.request(me, request);

            this.mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

        },
        /**
         * Implements Module protocol init method - does nothing atm
         * @method init
         * @public
         */
        init: function () {
            return null;
        },
        /**
         * Implements BundleInstance protocol update method - does nothing atm
         * @method update
         * @public
         */
        update: function () {

        },
        /**
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @method onEvent
         * @public
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            this.plugins['Oskari.userinterface.Flyout'].onEvent(event);

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Fetch channel when flyout is opened
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    doOpen = event.getViewState() !== 'close',
                    p;
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (doOpen) {
                    this.plugins['Oskari.userinterface.Flyout'].createUI();
                    if(!me.startedTabs){
                        me.cropping.createUi();
                        me.basket.createUi();
                        me.startedTabs = true;
                    }
                    // flyouts eventHandlers are registered
                    for (p in this.plugins['Oskari.userinterface.Flyout'].getEventHandlers()) {
                        if (!this.eventHandlers[p]) {
                            this.sandbox.registerForEventByName(this, p);
                        }
                    }

                }
            },
            'MapClickedEvent' : function(evt) {
                var me = this,
                x = evt.getMouseX(),
                y = evt.getMouseY();
                me.cropping.croppingLayersHighlight(x, y);
            },
            'AfterMapLayerAddEvent' : function(event) {
                var me = this;
                var map = me.mapModule.getMap();
            },
            'DrawingEvent': function(event) {
                if(event.getId() === this.cropping.DOWNLOAD_BASKET_DRAW_ID) {
                    this.cropping.handleDrawingEvent(event);
                }
            }
        },

        /**
         * Implements BundleInstance protocol stop method
         * @method stop
         */
        stop: function () {
            var sandbox = this.sandbox,
                p,
                request;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * Implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerselection2.Flyout
         * Oskari.mapframework.bundle.layerselection2.Tile
         * @method startExtension
         * @public
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.downloadBasket.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.downloadBasket.Tile', this);
        },
        /**
         * Implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         * @method stopExtension
         * @public
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * Implements Oskari.userinterface.Extension protocol getPlugins method
         * @method getPlugins
         * @public
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * Gets title
         * @method getTitle
         * @public
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * Gets description
         * @method getDescription
         * @public
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * Adds basket notify
         * @method addBasketNotify
         * @public
         */
        addBasketNotify:function(){
            this.plugins['Oskari.userinterface.Tile'].refresh();
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
