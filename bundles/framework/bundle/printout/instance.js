/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.printout.PrintoutBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = undefined;
        this.started = false;
        this.plugins = {};
        this.localization = undefined;
        this.printout = undefined;
        this.buttonGroup = 'viewtools';
        this.ignoreEvents = false;
        this.dialog = undefined;
        this.printoutHandler = undefined;
        this.isMapStateChanged = true;
        this.state = undefined;
        this.geoJson = undefined;
        this.tableJson = undefined;
        // Additional data for each printable layer
        this.tileData = undefined;
        this.printService = undefined;
        this.legendPlugin = undefined;
        //  Format producers
        this.backendConfiguration = {
            formatProducers: {
                "application/pdf": "",
                "image/png": ""
            }
        };

    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Printout',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
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
         * @method start
         * Implements BundleInstance protocol start method
         */
        "start": function () {
            var me = this;

            if (me.started) {
                return;
            }

            me.started = true;
            var conf = this.conf;
            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);
            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            var p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            me.backendConfiguration.formatProducers["application/pdf"] = (conf ? conf.backendConfiguration.formatProducers["application/pdf"] : null) || '';
            me.backendConfiguration.formatProducers["image/png"] = (conf ? conf.backendConfiguration.formatProducers["image/png"] : null) || '';

            // requesthandler
            this.printoutHandler = Oskari.clazz.create('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', sandbox, function () {
                me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
            });
            sandbox.addRequestHandler('printout.PrintMapRequest', this.printoutHandler);
            // request toolbar to add buttons
            var addBtnRequestBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            var btns = {
                'print': {
                    iconCls: 'tool-print',
                    tooltip: this.localization.btnTooltip,
                    sticky: true,
                    callback: function () {
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
                    }
                }
            };
            var tool;
            for (tool in btns) {
                if (btns.hasOwnProperty(tool)) {
                    sandbox.request(this, addBtnRequestBuilder(tool, this.buttonGroup, btns[tool]));
                }
            }

            // create the PrintService for handling ajax calls
            // and common functionality.
            var printService = Oskari.clazz.create('Oskari.mapframework.bundle.printout.service.PrintService', me);
            sandbox.registerService(printService);
            this.printService = printService;

            var locale = me.getLocalization();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var pluginConfig = this.conf.legend;
            var legendPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.printout.plugin.LegendPlugin', me, pluginConfig, locale);
            mapModule.registerPlugin(legendPlugin);
            mapModule.startPlugin(legendPlugin);
            this.legendPlugin = legendPlugin;

            //Let's extend UI
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            //sandbox.registerAsStateful(this.mediator.bundleId, this);
            // draw ui
            me._createUi();

            sandbox.registerAsStateful(this.mediator.bundleId, this);

            this.tileData = {};
        },
        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
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
        eventHandlers: {
            'MapLayerVisibilityChangedEvent': function (event) {
                /* we might get 9 of these if 9 layers would have been selected */
                if (this.printout && this.printout.isEnabled && this.isMapStateChanged) {
                    this.isMapStateChanged = false;
                    this.getSandbox().printDebug("PRINTOUT REFRESH");
                    this.printout.refresh(true);
                }
            },
            'AfterMapMoveEvent': function (event) {
                this.isMapStateChanged = true;
                if (this.printout && this.printout.isEnabled) {
                    this.printout.refresh(false);
                }
                this.isMapStateChanged = true;
            },
            'AfterMapLayerAddEvent': function (event) {
                this.isMapStateChanged = true;
                if (this.printout && this.printout.isEnabled) {
                    this.printout.refresh(false);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this.isMapStateChanged = true;
                if (this.printout && this.printout.isEnabled) {
                    this.printout.refresh(false);
                }
            },
            'AfterChangeMapLayerStyleEvent': function (event) {
                this.isMapStateChanged = true;
                if (this.printout && this.printout.isEnabled) {
                    this.printout.refresh(false);
                }
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {

                var me = this;

                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isOpen = event.getViewState() !== "close";
                me.displayContent(isOpen);

            },

            /**
             * Bundles interested to get printed send their data via this event.
             * The event listener saves the GeoJSON (if given) for use in printing
             * and the tile data (if given) for a given layer.
             *
             * @method Printout.PrintableContentEvent
             * @param {Object} event
             */
            'Printout.PrintableContentEvent': function (event) {
                var contentId = event.getContentId(),
                    layer = event.getLayer(),
                    layerId = ((layer && layer.getId) ? layer.getId() : null),
                    tileData = event.getTileData(),
                    geoJson = event.getGeoJsonData();

                // Save the GeoJSON for later use if provided.
                // TODO:
                // Save the GeoJSON for each contentId separately.
                // view/BasicPrintOut.js should be changed as well
                // to parse the geoJson for the backend.
                if (geoJson) {
                    this.geoJson = geoJson;
                }
                // Save the tile data per layer for later use.
                if (tileData && layerId) {
                    this.tileData[layerId] = tileData;
                }
            },
            /**
             * Bundles could plot directly via this event
             * @method Printout.PrintWithoutUIEvent
             * @param {Object} event
             */
            'Printout.PrintWithoutUIEvent': function (event) {
                var me= this;
                var contentId = event.getContentId(),
                    printParams = event.getPrintParams(),
                    geoJson = event.getGeoJsonData();
                if (geoJson) {
                    me.geoJson = geoJson;
                }
                //Request pdf
                if (!me.printout) {
                    var map = jQuery('#contentMap');
                    me.printout = Oskari.clazz.create('Oskari.mapframework.bundle.printout.view.BasicPrintout', this, this.getLocalization('BasicView'), this.backendConfiguration);
                    me.printout.render(map);
                    me.printout.setEnabled(false);
                    me.printout.hide();
                }
                me.printout.printMap(printParams);
            },
            /**
             * Bundles could plot with prespcefied parcel conf
             * @method Printout.PrintWithParcelUIEvent
             * @param {Object} event
             */
            'Printout.PrintWithParcelUIEvent': function (event) {
                var me= this;
                var contentId = event.getContentId(),
                    printParams = event.getPrintParams(),
                    geoJson = event.getGeoJsonData(),
                    tableJson = event.getTableData();

                if(geoJson) me.geoJson = geoJson;
                if(tableJson) me.tableJson = tableJson;
                me.setPublishMode(true);
                // configure UI
                me.printout.modifyUIConfig4Parcel(printParams);
                me.printout.setLayoutParams(printParams);
            }
        },



        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        "stop": function () {

            if (this.printout) {
                this.printout.destroy();
                this.printout = undefined;
            }

            this.geoJson = null;
            this.tileData = null;

            var sandbox = this.sandbox(),
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.removeRequestHandler('printout.PrintMapRequest', this.printoutHandler);
            this.printoutHandler = null;
//            console.log("Stoppetystop");
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
         * Oskari.mapframework.bundle.printout.Flyout
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.printout.Flyout', this);
            /*this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.printout.Tile', this);*/
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            /*this.plugins['Oskari.userinterface.Tile'] = null;*/
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method _createUi
         * @private
         * (re)creates the UI for "printout" functionality
         */
        _createUi: function () {
            var me = this;
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            /*this.plugins['Oskari.userinterface.Tile'].refresh();*/
        },
        /**
         * @method setPublishMode
         * Transform the map view to printout mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled
         */
        setPublishMode: function (blnEnabled) {
            var me = this;
            var map = jQuery('#contentMap');
            var tools = jQuery('#maptools'),
                i;

            // check if statsgrid mode is on
            // -> disable statsgrid mode
            var selectedLayers = me.sandbox.findAllSelectedMapLayers(),
                layer,
                request;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === "stats") {
                    request = me.sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, layer);
                    me.sandbox.request(me.getName(), request);
                    break;
                }
            }
            if (blnEnabled) {

                //me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
                jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', 'none');


                // proceed with printout view
                if (!this.printout) {
                    this.printout = Oskari.clazz.create('Oskari.mapframework.bundle.printout.view.BasicPrintout', this, this.getLocalization('BasicView'), this.backendConfiguration);
                    this.printout.render(map);
                }
                if (this.state && this.state.form) {
                    this.printout.setState(this.state.form);
                }
                this.printout.show();
                this.printout.setEnabled(true);
                this.printout.refresh(false);
                this.printout.refresh(true);
            } else {
                if (this.printout) {
                    jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', '');
                    request = me.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
                    me.sandbox.request(me.getName(), request);
                    this.printout.setEnabled(false);
                    this.printout.hide();
                    // clean legend
                    if (this.printout) {
                        this.legendPlugin.clearLegendLayers();
                    }

                }
            }
        },
        displayContent: function (isOpen) {
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
        setState: function (state) {
            this.state = state;
        },
        /**
         * @method getState
         * Returns bundle state as JSON. State is bundle specific, check the
         * bundle documentation for details.
         * @return {Object}
         */
        getState: function () {
            var state = this.state || {};

            if (this.printout) {
                var formState = this.printout.getState();
                state.form = formState;
            }

            return state;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension', 'Oskari.userinterface.Stateful']
    });