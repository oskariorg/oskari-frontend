/**
 * @class Oskari.mapframework.bundle.parcelinfo.plugin.ParcelInfoPlugin
 * Provides information about the selected feature.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelinfo.plugin.ParcelInfoPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 *      JSON config with params needed to run the plugin
 */
function(config, locale) {
    this._conf = config;
    this._locale = locale;
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._elements = {};
    this.__templates = {};

}, {
    /** @static @property __name plugin name */
    __name : 'ParcelInfoPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        this.__templates['infodiv'] = jQuery('<div>' + '<table class="piMain">' + '<tr>' + '<td class="piHeaderLabel" colspan="2"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelName" infotype="name"></td>' + '<td class="piValue" infotype="name"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelArea" infotype="area"></td>' + '<td class="piValue" infotype="area"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelLength" infotype="length"></td>' + '<td class="piValue" infotype="length"></td>' + '</tr>' + '</table>' + '</div>');
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        this._createUI();
        for (p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for (p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        if (this._elements['display']) {
            this._elements['display'].remove();
            delete this._elements['display'];
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @method _createUI
     * @private
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     */
    _createUI : function() {
        var sandbox = this._sandbox;
        var me = this;
        // get div where the map is rendered from openlayers
        var parentContainer = jQuery(this._map.div);
        var el = me._elements['display'];
        if (!me._elements['display']) {
            el = me._elements['display'] = me.__templates['infodiv'].clone();
        }

        el.find('.piHeaderLabel').html(me._locale['header']);
        el.find('.piLabelName').html(me._locale['info']['name']);
        el.find('.piLabelArea').html(me._locale['info']['area']);
        el.find('.piLabelLength').html(me._locale['info']['length']);

        parentContainer.append(el);
        this.update();
        el.show();
    },
    /**
     * @method update
     * @param {Object} data contains information to show on UI
     * Updates the given information to the UI
     */
    update : function(data) {
        if (!data || !data.info) {
            data = {
                'info' : {
                    'name' : '',
                    'area' : '',
                    'length' : ''
                }
            };
        }
        var me = this;
        var info = data['info'];
        var el = me._elements['display'];
        var spanName = el.find('.piValue[infotype="name"]');
        var spanArea = el.find('.piValue[infotype="area"]');
        var spanLength = el.find('.piValue[infotype="length"]');
        if (spanName && spanArea && spanLength) {
            spanName.text(info.name);
            spanArea.text(info.area);
            spanLength.text(info.length);
        }
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */

    eventHandlers : {
        /**
         * @method MouseHoverEvent
         * See PorttiMouse.notifyHover
         */
        'MouseHoverEvent' : function(event) {
            this.update({
                'info' : {
                    'name' : 'todo',
                    'area' : 'todo',
                    'length' : 'todo'
                }
            });
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
