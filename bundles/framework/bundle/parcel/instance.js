/**
 * @class Oskari.mapframework.bundle.parcel.DrawingToolInstance
 *
 * This bundle listens for events that provide feature ID for parcels or register units
 * and loads the requested feature data. Features are shown on the map. Also, tools are provided
 * to split the feature areas. Provides means to save feature data to server by using WFST.
 * Also, uses ParcelInfo bundle to show area information.
 *
 * This bundle requires configurations in application config.json.
 * For example:
 *     "parcel": {
 *         "conf": {
 *             "queryUrl": "https://ws.nls.fi/ktjkii/wfs/wfs",
 *             "parcelFeatureType": "PalstanTietoja",
 *             "registerUnitFeatureType": "RekisteriyksikonTietoja",
 *             "hideSomeToolbarButtons": "hide",
 *             "transactionUrl": "",
 *             "proxyUrl": "proxy.cgi?url="
 *         }
 *     }
 * Above parameters are for:
 * * queryUrl - URL that is used for loading feature data
 * * parcelFeatureType - feature type that is used when parcels are requested for features
 * * registerUnitFeatureType - feature type that is used when register units are requested for features
 * * hideSomeToolbarButtons - hide means that hide some buttons of other bundles that may not be usefull
 *                            for this bundel from toolbar. If this parameter is left out or 'false' it
 *                            means that show all buttons of other bundles. For more specific implementation,
 *                            see {Oskari.mapframework.bundle.parcel.handler.ButtonHandler} init -function.
 * * transactionUrl - URL that is used for WFST saving. If not defined, queryUrl is used for this.
 *                    Notice, if queryUrl and transactionUrl differ WFST uses INSERT, otherwise UPDATE.
 * * proxyUrl - If set, OpenLayers uses this for proxy.
 *
 * Listens for events of other bundles that have name:
 * 'ParcelSelector.ParcelSelectedEvent' and 'ParcelSelector.RegisterUnitSelectedEvent'.
 * Sends events for other bundles:
 * {Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerRegisterEvent}
 * and {Oskari.mapframework.bundle.parcel.event.ParcelInfoLayerUnregisterEvent}.
 */

Oskari.clazz.define("Oskari.mapframework.bundle.parcel.DrawingToolInstance",

    /**
     * @method create called automatically on construction
     * @static
     */
        function() {
        this._localization = null;
        this.sandbox = null;
        this.parcelService = undefined;
        this.idPrefix = 'parcel';
        this.base_pdf_template = 'template';
        this.pageMapRect = [];
        this.plugins = {};
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName : function() {
            return 'Parcel';
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
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization : function(key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                if (this._localization && this._localization[key]) {
                    return this._localization[key];
                } else {
                    return key;
                }
            }
            return this._localization;
        },
        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage : function(title, message) {
            var loc = this.getLocalization(),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(loc.buttons.ok);
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                dialog.close(true);
            });
            dialog.show(title, message, [okBtn]);
        },
        /**
         * @method getService
         * Returns the parcels main service
         * @return {Oskari.mapframework.bundle.parcel.service.ParcelService}
         */
        getService : function() {
            return this.parcelService;
        },
        /**
         * @method getDrawPlugin
         * Returns reference to the draw plugin
         * @return {Oskari.mapframework.bundle.parcel.plugin.DrawPlugin}
         */
        getDrawPlugin : function() {
            return this.view.drawPlugin;
        },
        /**
         * @method getMainView
         * Returns reference to the main view
         * @return {Oskari.mapframework.bundle.parcel.view.MainView}
         */
        getMainView : function() {
            return this.view;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update : function() {
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start : function() {
            var loc = this.getLocalization('links');
            this.templateLinks = jQuery('<a href="JavaScript:void(0);" class="language">' + loc.language +
                '</a>&nbsp;&nbsp;&nbsp;<a href="JavaScript:void(0);" class="guide">' + loc.guide + '</a>');
            // Should this not come as a param?
            var sandbox = Oskari.$('sandbox'),
                mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                me = this,
                i,
                layerId,
                p;
            this.sandbox = sandbox;
            if (me.conf && me.conf.proxyUrl) {
                // Use proxy if requesting features cross-domain.
                // Also, proxy is required to provide application specific authorization for WFS data.
                // Notice, OpenLayers will automatically encode URL parameters.
                OpenLayers.ProxyHost = me.conf.proxyUrl;
            }
            // Test
            // me.conf.wfstFeatureNS = 'http://www.oskari.org';
            // me.conf.wfstUrl =  '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=PreParcel';

            if(me.conf && me.conf.stickyLayerIds) {
                // Layer switch off disable
                for (i in me.conf.stickyLayerIds) {
                    layerId = me.conf.stickyLayerIds[i];
                    mapLayerService.makeLayerSticky(layerId,true);
                }
            }

            if(me.conf && me.conf.base_pdf_template) {
                me.base_pdf_template = me.conf.base_pdf_template
                }

            if(me.conf && me.conf.pageMapRect) {
                me.pageMapRect = me.conf.pageMapRect
                }

            // Testing
            me.pageMapRect = ["1.0,1.5,19.0,15.0",
                              "1.0,1.5,18.5,18.0",
                              "1,1.5,27.7,28",
                              "1,1.5,31,26.5"];
            
            // back end communication
            me.parcelService = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelService', me);
            me.sandbox.registerService(me.parcelService);
            // init loads the places
            me.parcelService.init();

            // handles parcels save form
            me.view = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.view.MainView", me);
            me.view.start();

            // handles selection events related to parcels
            me.parcelSelectorHandler = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.handler.ParcelSelectorHandler", me);
            me.parcelSelectorHandler.start();
            me.preparcelSelectorHandler = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.handler.PreParcelSelectorHandler", me);
            me.preparcelSelectorHandler.start();
            // predefined parcel id
            if (me.conf && me.conf.initRef) {
                me.parcelSelectorHandler.loadParcel(me.conf.initRef);
            }
            // predefined part parcel (preparcel) plot id
            else if (me.conf && me.conf.pid) {
                me.preparcelSelectorHandler.loadPreParcel(me.conf.pid);
            }
            // Language control
            var loginBar = jQuery("#loginbar");
            loginBar.empty();
            var userLinks = this.templateLinks.clone();

            userLinks.filter(".language").click(function(event){
                me._changeLanguage();
            });
            // Guide link
            var guideLink = userLinks.filter(".guide");
            guideLink.attr("href", me.conf.guideUrl+"?locale="+loc.guideLang);
            guideLink.click(function (event) {
                event.preventDefault();
                window.open(jQuery(this).attr("href"), "popupWindow", "width=800,height=600,scrollbars=yes");
            });

            loginBar.append(userLinks);
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            //Let's extend UI
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // Parcel print start ui
            me._createPrintStartUi();
        },
        /**
         * @method _changeLanguage
         * @private
         * Changes the application language between Finnish and Swedish.
         */
        _changeLanguage : function() {
            var me = this;
            var loc = me.getLocalization();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(loc.buttons.ok);
            okBtn.setHandler(function() {
                dialog.close();
                var language = Oskari.getLang();
                if (language === 'fi') {
                    window.open("?lang=sv","_self");
                } else {
                    window.open("?lang=fi","_self");
                }
            });
            var cancelBtn = dialog.createCloseButton(loc.buttons.cancel);
            cancelBtn.addClass('primary');
            var dialogText = loc.notification.language;
            dialog.show(dialogText.title, dialogText.confirm, [okBtn, cancelBtn]);
            dialog.makeModal();
        },
        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method setParcelPrintMode
         * Starts parcel print mode with 1st form
         *
         * @param {Boolean} blnEnabled
         */
        setParcelPrintMode: function (blnEnabled) {
            var me = this,
                map = jQuery('#contentMap'),
                tools = jQuery('#maptools');

            if (blnEnabled) {
                // Hide flyout, it's not needed...
                jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().hide();
                // proceed with parcel print view
                if (!this.parcelprint1) {
                    this.parcelprint1 = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.view.ParcelPrintForm1', this, this.getLocalization('ParcelPrintForm1'));
                    this.parcelprint1.render(map, me.getMainView());
                } else {
                    // Update data UI
                    this.parcelprint1.refreshData(me.getMainView());
                }
                // Disable keyboard arrow effects to map move
                this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');

                //Add parcel plot on a map for to see boundary monuments - not final
                // Callback handles the end of the asynchronous operation.
                var cb = function(blnSuccess) {
                    if (blnSuccess) {

                    }
                }
                this.getService().plotParcelWithoutPrint(this.getDrawPlugin().getDrawing(),this.parcelprint1.getValues().place , cb);

                this.parcelprint1.show();
                this.parcelprint1.setEnabled(true);

                // Show info
               // this.parcelprint1.showInfos();

            } else {
                if (this.parcelprint1) {
                    this.parcelprint1.setEnabled(false);
                    this.parcelprint1.hide();
                    this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                }
            }
        },
        /**
         * @method setParcelPrint2
         * Continue parcel print mode with 2nd form
         *
         * @param {Boolean} blnEnabled
         */
        setParcelPrint2: function (blnEnabled) {
            var me = this,
                map = jQuery('#contentMap'),
                tools = jQuery('#maptools');

            if (blnEnabled) {
                // Hide previous form
                if (this.parcelprint1) {
                    this.parcelprint1.setEnabled(false);
                    this.parcelprint1.hide();
                }
                // proceed with parcel print 2nd view
                if (!this.parcelprint2) {
                    this.parcelprint2 = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.view.ParcelPrintForm2', this, this.getLocalization('ParcelPrintForm2'));
                    this.parcelprint2.render(map, me.getMainView());
                } else {
                    // Update data UI
                    this.parcelprint2.refreshData(me.getMainView());
                }
                this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
                this.parcelprint2.show();
                this.parcelprint2.setEnabled(true);

                // Show info
                // this.parcelprint2.showInfos();

            } else {
                if (this.parcelprint2) {
                    this.parcelprint2.setEnabled(false);
                    this.parcelprint2.hide();
                    this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                }
            }
        },

        requestParcelPrintFinal: function () {
            var me = this,
                values = {};
            if (me.parcelprint2) {
                me.parcelprint2.setEnabled(false);
                me.parcelprint2.hide();
                this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            }
            values.place = this.parcelprint1.getValues().place
            values.tables = me.parcelprint2.getValues();

            // Start PTI printout
            var cb = function(blnSuccess) {
                if (blnSuccess) {

                }
            }
            this.getService().printPlace(this.getDrawPlugin().getDrawing(),this.getDrawPlugin().getFeatureType(), values , cb);


        },
        setParcelPrintBreak: function () {
            var me = this;
            if (me.parcelprint1) {
                me.parcelprint1.setEnabled(false);
                me.parcelprint1.hide();
            }
            if (me.parcelprint2) {
                me.parcelprint2.setEnabled(false);
                me.parcelprint2.hide();
            }
            this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            // ask toolbar to select default tool
            var toolbarRequest = me.getSandbox().getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.getSandbox().request(me.getMainView(), toolbarRequest);
            // Clear plot extra and put  parcel marker edit mode on
            this.getService().cancelPlotParcel();

        },
        setParcelPrintPrevious: function () {
            var me = this;
            if (me.parcelprint2) {
                me.parcelprint2.setEnabled(false);
                me.parcelprint2.hide();
            }
            me.parcelprint1.show();  //setParcelPrintMode(true);
        },
        _setPrintoutPrevious: function () {
            var me = this;
            if (me.parcelprint2) {
                me.parcelprint2.setEnabled(true);
                this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
                me.parcelprint2.show();
            }
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method - does nothing atm
         */
        stop : function() {
            this.sandbox = null;
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
             * @method Printout.PrintCanceledEvent
             */
            'Printout.PrintCanceledEvent': function (event) {

                var me = this;
               // Return to previous printout form
                if(event.getState() === 'previous')
                me._setPrintoutPrevious();
                else if (event.getState() === 'cancel')
                me.setParcelPrintBreak();

            }
        },
        /**
         *  Display parcel print info start
         * @param isOpen
         */
        displayContent: function (isOpen) {
            if (isOpen) {
                this.plugins['Oskari.userinterface.Flyout'].refresh();
            }
        },
        /**
         * @method _createPrintStartUi
         * @private
         * (re)creates the UI for parcelprint info
         */
        _createPrintStartUi: function () {
            var me = this;
            this.plugins['Oskari.userinterface.Flyout'].createUi();
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout
         * Oskari.mapframework.bundle.parcel.Flyout
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.Flyout', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol : ['Oskari.bundle.BundleInstance']
    });
