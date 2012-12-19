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
 *                            means that show all buttons of other bundles.
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
        var loc = this.getLocalization();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
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
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        this.sandbox = sandbox;

        var me = this;

        if (this.conf && this.conf.proxyUrl) {
            // Use proxy if requesting features cross-domain.
            // Also, proxy is required to provide application specific authorization for WFS data.
            // Notice, OpenLayers will automatically encode URL parameters.
            OpenLayers.ProxyHost = this.conf.proxyUrl;
        }

        // back end communication
        this.parcelService = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelService', this);
        this.sandbox.registerService(this.parcelService);
        // init loads the places
        this.parcelService.init();

        // handles parcels save form
        this.view = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.view.MainView", this);
        this.view.start();

        // handles selection events related to parcels
        this.parcelSelectorHandler = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.handler.ParcelSelectorHandler", this);
        this.parcelSelectorHandler.start();
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method - does nothing atm
     */
    stop : function() {
        this.sandbox = null;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.bundle.BundleInstance']
});
