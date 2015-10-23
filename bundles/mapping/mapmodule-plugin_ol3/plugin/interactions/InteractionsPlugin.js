/**
 * @class Oskari.mapframework.mapmodule.InteractionsPlugin
 *
 * Adds mouse and keyboard controls to the map and adds tools controls
 * for zoombox and measurement (line/area). Also adds request handling for
 * ToolSelectionRequest, EnableMapKeyboardMovementRequest, DisableMapKeyboardMovementRequest,
 * EnableMapMouseMovementRequest and DisableMapMouseMovementRequest.
 * Overrides OpenLayers keyboard/mouse controls with PorttiKeyboard and PorttiMouse.
 *
 * default configuration for mouse as of 2012-12-05:
 *
 *
    {
               "id":"Oskari.mapframework.mapmodule.ControlsPlugin",
               "config" : {
                    "mouse" : {
                        "useCenterMapInWheelZoom" : false,
                        "useCenterMapInDblClickZoom": false
                    }
               }
     }
 *
 */

//-----------ol.control --> zoom, scaleLine, mousePosition
//----> toteuta measurementit drawPluginissa: http://openlayers.org/en/v3.6.0/examples/measure.html, http://openlayers.org/en/v3.1.0/examples/measure.js
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.InteractionsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.InteractionsPlugin';
        me._name = 'InteractionsPlugin';
    }, {
    /** @static @property __name plugin name */
    __name : 'InteractionsPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
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
     * @private @method _startPluginImpl
     * Interface method for the plugin protocol
     *
     *
     */
    _startPluginImpl: function() {
        this._createMapInteractions();
    },

    _createRequestHandlers: function () {
        var me = this;
        var mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementInteractionsRequestHandler', me.getMapModule());
        return {
            'EnableMapKeyboardMovementRequest' : mapMovementHandler,
            'DisableMapKeyboardMovementRequest' : mapMovementHandler,
            'EnableMapMouseMovementRequest' : mapMovementHandler,
            'DisableMapMouseMovementRequest' : mapMovementHandler
        };
    },

    /**
     * @private @method _createMapControls
     * Constructs/initializes necessary controls for the map. After this they can be added to the map
     * with _addMapControls().
     *
     */
    _createMapInteractions: function () {
        var me = this,
            conf = me.getConfig(),
            geodesic = conf.geodesic === undefined ? true : conf.geodesic,
            sandbox = me.getSandbox(),
            key;

            //TODO: add Esc button handler

            // Map movement/keyboard control
            if (conf.keyboardControls === false) {
                me.getMap().removeInteraction(ol.interaction.KeyboardPan);
                me.getMap().removeInteraction(ol.interaction.KeyboardZoom);
            }

            // mouse control
            if (conf.mouseControls === false) {
                me.getMap().removeInteraction(ol.interaction.DragPan);
                me.getMap().removeInteraction(ol.interaction.MouseWheelZoom);
                me.getMap().removeInteraction(ol.interaction.DoubleClickZoom);
                me.getMap().removeInteraction(ol.interaction.DragZoom);
            }
        }
}, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
