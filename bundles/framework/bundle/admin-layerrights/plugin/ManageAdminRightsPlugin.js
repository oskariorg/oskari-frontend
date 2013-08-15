/**
 * @class Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin
 * Creates role selection ui and the actual grid where the role rights are displayed.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
/**
 * @method create called automatically on construction
 * @params {Object} config
 *  {
 *   'published': {Boolean}, // optional, defaults to false
 *   'state':     {Object},  // optional, defaults to an empty object
 *   'layer':     {Object}   // optional, can be set later with #setLayer
 *  }
 * @params {Object} locale   localization strings
 *
 * @static
 */
function(config, locale) {
    this.pluginName = null;
    this._sandbox = null;
    this._layer = null;

    // indicators (meta data)
    this.indicators = [];
    this.selectedMunicipalities = {};
    defaults = {};


    this.conf = jQuery.extend(true, config, defaults);
    this._locale = locale || {};
    this.templates = {}

}, {
    /** 
     * @property __name module name
     * @static 
     */
    __name: 'ManageAdminRightsPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },

    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
    },

    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
    },

    /**
     * @method init
     * Interface method for the module protocol. Initializes the request
     * handlers/templates.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
    },

    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Should registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

    },

    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Should unregisters requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        // remove ui
        if (this.element) {
            this.element.remove();
            this.element = undefined;
            delete this.element;
        }
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'MapStats.FeatureHighlightedEvent': function(event) {
            if(this.selectMunicipalitiesMode) {
                this._featureSelectedEvent(event);
            } else {
                this._featureHighlightedEvent(event);
            }
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },

    /**
     * @method createAdminRights
     * Create admin rights table
     * @param {Object} container to where slick grid and pull downs will be appended
     */
    createAdminRights : function(container) {
        //TODO create admin rights tabel

        // stop events so that they don't affect other parts of the site (i.e. map)
        container.on("keyup", function(e) {
            e.stopPropagation();
        });
        container.on("keydown", function(e) {
            e.stopPropagation();
        });

    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
