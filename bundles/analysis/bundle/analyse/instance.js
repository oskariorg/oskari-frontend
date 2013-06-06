/**
 * @class Oskari.analysis.bundle.analyse.AnalyseBundleInstance
 *
 * Main component and starting point for the analysis functionality. Analyse parameters dialog
 * is a layout down tool to configure analyse parameters .
 *
 * See Oskari.analysis.bundle.analyse.AnalyseBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.analysis.bundle.analyse.AnalyseBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = undefined;
    this.started = false;
    this.plugins = {};
    this.localization = undefined;
    this.analyse = undefined;
    this.buttonGroup = 'viewtools';
    this.ignoreEvents = false;
    this.dialog = undefined;
    this.analyseHandler = undefined;
    this.analyseService = undefined;
    this.isMapStateChanged = true;
    this.state = undefined;
    this.conf =  {};

}, {
    /**
     * @static
     * @property __name
     */
    __name : 'Analyse',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName" : function() {
        return this.__name;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
        if (!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method start
     * Implements BundleInstance protocol start method
     */
    "start" : function() {
        var me = this;

        if (me.started)
            return;

        me.started = true;
        var conf = this.conf;
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;

        this.localization = Oskari.getLocalization(this.getName());

        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        // requesthandler
        this.analyseHandler = Oskari.clazz.create('Oskari.analysis.bundle.analyse.request.AnalyseRequestHandler', me);       
        sandbox.addRequestHandler('analyse.AnalyseRequest', this.analyseHandler);
    
        this.analyseService = Oskari.clazz.create('Oskari.analysis.bundle.analyse.service.AnalyseService', me);
        sandbox.registerService(this.analyseService);

        this.mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        //Let's extend UI
        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

      
        // draw ui
        me._createUi();

        /* stateful */
        if(conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

    },
    /**
     * @method init
     * Implements Module protocol init method - does nothing atm
     */
    "init" : function() {
        return null;
    },
    /**
     * @method update
     * Implements BundleInstance protocol update method - does nothing atm
     */
    "update" : function() {

    },
    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'MapLayerVisibilityChangedEvent' : function(event) {
            if (this.analyse && this.analyse.isEnabled && this.isMapStateChanged) {
                this.isMapStateChanged = false;
                this.getSandbox().printDebug("ANALYSE REFRESH");
                this.analyse.refreshAnalyseData(true);
            }
        },
        'AfterMapMoveEvent' : function(event) {
            this.isMapStateChanged = true;
            if (this.analyse && this.analyse.isEnabled) {
                this.analyse.refreshAnalyseData(false);
            }
            this.isMapStateChanged = true;
        },
        'AfterMapLayerAddEvent' : function(event) {
            this.isMapStateChanged = true;
            if (this.analyse && this.analyse.isEnabled) {
                this.analyse.refreshAnalyseData(false);
            }
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.isMapStateChanged = true;
            if (this.analyse && this.analyse.isEnabled) {
                this.analyse.refreshAnalyseData(false);
            }
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.isMapStateChanged = true;
            if (this.analyse && this.analyse.isEnabled) {
                this.analyse.refreshAnalyseData(false);
            }
        },
        /**
         * @method MapLayerEvent
         * @param {Oskari.mapframework.event.common.MapLayerEvent} event
         */
        'MapLayerEvent' : function(event) {
            var layerId = event.getLayerId();
            // Let's show the user a dialog when the new analysislayer gets added to the map.
            if (event.getOperation() === 'add') {
                var layer = this.mapLayerService.findMapLayer(layerId);
                if (layer && layer.isLayerOfType('ANALYSIS')) {
                    this.showMessage('Taso "' + layer.getName() + '" lisätty!',
                        'Löydät tason Aineisto-paneelista.');
                }
            }
        },
        /**
         * @method userinterface.ExtensionUpdatedEvent
         */
        'userinterface.ExtensionUpdatedEvent' : function(event) {

            var me = this;

            if (event.getExtension().getName() != me.getName()) {
                // not me -> do nothing
                return;
            }

            var isOpen = event.getViewState() != "close";

            me.displayContent(isOpen);

        }
    },
    /**
     * @method stop
     * Implements BundleInstance protocol stop method
     */
    "stop" : function() {

        if (this.analyse) {
            this.analyse.destroy();
            this.analyse = undefined;
        }

        var sandbox = this.sandbox();
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.removeRequestHandler('analyse.AnalyseRequest', this.analyseHandler);
        this.analyseHandler = null;

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
        sandbox.request(this, request);

        this.sandbox.unregisterStateful(this.mediator.bundleId);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     * Creates a flyout
     * Oskari.analysis.bundle.analyse.Flyout
     */
    startExtension : function() {
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.analysis.bundle.analyse.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.analysis.bundle.analyse.Tile', this);
    },
    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     * Clears references to flyout and tile
     */
    stopExtension : function() {
        this.plugins['Oskari.userinterface.Flyout'] = null;
        this.plugins['Oskari.userinterface.Tile'] = null;
    },
    /**
     * @method getPlugins
     * implements Oskari.userinterface.Extension protocol getPlugins method
     * @return {Object} references to flyout and tile
     */
    getPlugins : function() {
        return this.plugins;
    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the component
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the component
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method _createUi
     * @private
     * (re)creates the UI for "analyse" functionality
     */
    _createUi : function() {
        var me = this;
        this.plugins['Oskari.userinterface.Flyout'].createUi();
        this.plugins['Oskari.userinterface.Tile'].refresh();
    },
    /**
     * @method setAnalyseMode
     * Starts analyse mode
     *
     * @param {Boolean} blnEnabled
     */
    setAnalyseMode : function(blnEnabled) {
        var me = this;
        var map = jQuery('#contentMap');
        var tools = jQuery('#maptools');

        if (blnEnabled == true) {

           // me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
             var request = me.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
                me.sandbox.request(me.getName(), request);

            // proceed with analyse view
            if (!this.analyse) {
                this.analyse = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.StartAnalyse', this, this.getLocalization('AnalyseView'));
                this.analyse.render(map);
            } else {
                // Update data UI
                this.analyse.refreshAnalyseData();
                this.analyse.refreshExtraParameters();
            }
            if (this.state) {
                this.analyse.setState(this.state);
            }
            this.analyse.show();
            this.analyse.setEnabled(true);

        } else {
            if (this.analyse) {
                this.analyse.setEnabled(false);
                this.analyse.hide();

            }
        }
    },
    displayContent : function(isOpen) {
        if (isOpen) {
            this.plugins['Oskari.userinterface.Flyout'].refresh();
        }
    },

    /**
     * @method setState
     * Sets the bundle state
     * bundle documentation for details.
     * @param {Object} state bundle state as JSON
     */
    setState : function(state) {
        this.state = state;
    },
    /**
     * @method getState
     * Returns bundle state as JSON. State is bundle specific, check the
     * bundle documentation for details.
     * @return {Object}
     */
    getState : function() {
        var state = this.state || {};

        if (this.analyse) {
            state = this.analyse.getState();
        }

        return state;
    },

    /**
     * @method showMessage
     * Shows user a message with ok button
     * @param {String} title popup title
     * @param {String} message popup message
     */
    showMessage : function(title, message) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(title, message);
        dialog.fadeout(5000);
    },
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension', 'Oskari.userinterface.Stateful']
});
