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
    this._mapModule = null;
    this._sandbox = null;
    this._map = null;
    this._elements = {};
    this._templates = {};
    this._layers = [];
    this._selectedFeature = null;

}, {
    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return 'ParcelInfoPlugin';
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this._mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this._mapModule = mapModule;
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
        this._templates['infodiv'] = jQuery('<div>' + '<table class="piMain">' + '<tr>' + '<td class="piHeaderLabel" colspan="3"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelName" infotype="name"></td>' + '<td class="piLabelValue" infotype="name" colspan="2"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelArea" infotype="area"></td>' + '<td class="piValue" infotype="area"></td>' + '<td class="piUnit" infotype="area"></td>' + '</tr>' + '<tr>' + '<td class="piLabel piLabelLength" infotype="length"></td>' + '<td class="piValue" infotype="length"></td>' + '<td class="piUnit" infotype="length"></td>' + '</tr>' + '</table>' + '</div>');
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
            el = me._elements['display'] = me._templates['infodiv'].clone();
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
        var spanName = el.find('.piLabelValue[infotype="name"]');
        var spanArea = el.find('.piValue[infotype="area"]');
        var spanAreaUnit = el.find('.piUnit[infotype="area"]');
        var spanLength = el.find('.piValue[infotype="length"]');
        var spanLengthUnit = el.find('.piUnit[infotype="length"]');
        if (spanName && spanArea && spanLength) {
            spanName.text(info.name);
            spanArea.text(info.area);
            spanAreaUnit.html(me._map.units + "&sup2;");
            spanLength.text(info.length);
            spanLengthUnit.text(me._map.units);
        }
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */

    eventHandlers : {
        /**
         * @method
         */
        'ParcelInfo.ParcelLayerRegisterEvent' : function(event) {
            var me = this;
            if (event && event.getLayer()) {
                me._registerLayer(event.getLayer());
            }
        },
        'ParcelInfo.ParcelLayerUnregisterEvent' : function(event) {
            var me = this;
            if (event && event.getLayer()) {
                me._unregisterLayer(event.getLayer());
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
     *
     */
    _registerLayer : function(layer) {
        var me = this;
        if (jQuery.inArray(layer, me._layers) === -1) {
            layer.events.register("featureselected", me, me._updateInfoSelected);
            layer.events.register("featureunselected", me, me._updateInfoUnselected);
            layer.events.register("featuremodified", me, me._updateInfo);
            layer.events.register("vertexmodified", me, me._updateInfo);
            this._layers.push(layer);
        }
    },
    /**
     *
     */
    _unregisterLayer : function(layer) {
        var me = this;
        var index = jQuery.inArray(layer, me._layers);
        if (index != -1) {
            layer.events.unregister("featureselected", me, me._updateInfoSelected);
            layer.events.unregister("featureunselected", me, me._updateInfoUnselected);
            layer.events.unregister("featuremodified", me, me._updateInfo);
            layer.events.unregister("vertexmodified", me, me._updateInfo);
            this_layers.splice(index, 1);
        }
    },
    _updateInfoSelected : function(event) {
        this._selectedFeature = null;
        if (event) {
            this._selectedFeature = event.feature;
        }
        // Update info for the given feature if any.
        this._updateInfo(event);
    },
    _updateInfoUnselected : function(event) {
        this._selectedFeature = null;
        // Set to default values because none is selected.
        this.update();
    },
    /**
     *
     */
    _updateInfo : function(event) {
        var me = this;
        // Update the info only for the selected feature.
        if (event && event.feature && event.feature.geometry && event.feature === me._selectedFeature) {
            me.update({
                'info' : {
                    'name' : event.feature.attributes.nimi || event.feature.attributes.name || '',
                    'area' : event.feature.geometry.getArea().toFixed(0),
                    'length' : event.feature.geometry.getLength().toFixed(0)
                }
            });
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
