/**
 * @class Oskari.mapframework.bundle.parcel.DrawingToolInstance
 */

Oskari.clazz.define("Oskari.mapframework.bundle.parcel.DrawingToolInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._localization = null;
    this.sandbox = null;
    this.buttons = undefined;
    this.parcelService = undefined;
    this.idPrefix = 'parcel';
}, {
    __name : 'Parcel',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
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
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            if (this._localization &&
                this._localization[key]) {
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
        var loc = this.instance.getLocalization();
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
     * @method enableGfi
     * Enables/disables the gfi functionality
     * @param {Boolean} blnEnable true to enable, false to disable
     */
    enableGfi : function(blnEnable) {
        var gfiReqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
        if(gfiReqBuilder) {
            this.sandbox.request(this.buttons, gfiReqBuilder(blnEnable));
        }
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
        sandbox.printDebug("Initializing parcel module...");
        
        // handles toolbar buttons related to parcels 
        this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.handler.ButtonHandler", this);
        this.buttons.start();

        if(this.conf && this.conf.proxyUrl) {
            // Use proxy if requesting features cross-domain.
            // Also, proxy is required to provide application specific authorization for WFS data.
            // Notice, OpenLayers will automatically encode URL parameters.
            OpenLayers.ProxyHost = this.conf.proxyUrl;
        }

        // back end communication
        this.parcelService = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelService',
            this);
        // register service so personal data can access it
        this.sandbox.registerService(this.parcelService);
        // init loads the places
        this.parcelService.init();
        
        // handles parcels insert form etc
        this.view = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.view.MainView", this);
        this.view.start();
        
        this.editRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.EditRequestHandler', sandbox, me);
        sandbox.addRequestHandler('Parcel.EditPlaceRequest', this.editRequestHandler);
        
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