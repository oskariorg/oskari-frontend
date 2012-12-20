/**
 * @class Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance
 *
 * Main component and starting point for the "parcel selector" functionality.
 * This bundle shows Tile in UI to open Flyout that asks for a parcel FID that is used
 * to send an event for another bundle. Then, another bundle may update the map with
 * the requested feature.
 *
 * This instance does not require any configurations in application config.json file.
 * 
 * This bundle does not listen for any events.
 * This bundle sends following events:
 * See, {Oskari.mapframework.bundle.parcelselector.event.ParcelSelectedEvent}
 * and {Oskari.mapframework.bundle.parcelselector.event.RegisterUnitSelectedEvent}.
 * 
 * See {Oskari.mapframework.bundle.parcelselector.ParcelSelector} for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.started = false;
    this.plugins = {}
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName" : function() {
        return 'ParcelSelector';
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox} Oskari sandbox.
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
     * implements BundleInstance protocol start method
     */
    "start" : function() {
        var me = this;

        if (me.started) {
            return;
        }

        me.started = true;

        var sandbox = Oskari.$("sandbox");
        me.sandbox = sandbox;

        sandbox.register(me);

        //Let's extend UI
        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        // draw ui
        me.createUi();
    },
    /**
     * @method init
     * implements Module protocol init method - does nothing atm
     */
    "init" : function() {
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    "update" : function() {
    },

    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop" : function() {
        var sandbox = this.sandbox();
        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
        sandbox.request(this, request);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     * Creates a flyout and a tile:
     * Oskari.mapframework.bundle.parcelselector.Flyout
     * Oskari.mapframework.bundle.parcelselector.Tile
     */
    startExtension : function() {
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.parcelselector.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.parcelselector.Tile', this);
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
     * @method createUi
     * (re)creates the UI for "all layers" functionality
     */
    createUi : function() {
        this.plugins['Oskari.userinterface.Flyout'].createUi();
        this.plugins['Oskari.userinterface.Tile'].refresh();
    },
    /**
     * @method showMessage
     * Shows user a message with ok button
     * @param {String} title popup title
     * @param {String} message popup message
     */
    showMessage : function(title, message) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(this.getLocalization('buttons').ok);
        okBtn.addClass('primary');
        okBtn.setHandler(function() {
            dialog.close(true);
        });
        dialog.show(title, message, [okBtn]);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
