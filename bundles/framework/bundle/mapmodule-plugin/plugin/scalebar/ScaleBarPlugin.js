/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin
 * Provides scalebar functionality for map
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginScaleBar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin';
        me._defaultLocation = 'bottom left';
        me._index = 3;
        me._name = 'ScaleBarPlugin';
        me._scalebar = null;
    }, {

        /**
         * @private @method _createControlElement
         * Constructs/initializes the indexmap  control for the map.
         *
         * @return {jQuery} element
         */
        _createControlElement: function () {
            var el = jQuery('<div class="mapplugin scalebar"></div>');
            return el;
        },

        /**
         * @private @method _createControlAdapter
         * Constructs/initializes the control adapter for the plugin
         *
         * @param {jQuery} el
         */
        _createControlAdapter: function (el) {
            // initialize control, pass container
            this._scalebar = new OpenLayers.Control.ScaleLine({
                div: el[0]
            });

            return this._scalebar;
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            return {
                'AfterMapMoveEvent': function (event) {
                    if (this._scalebar) {
                        this._scalebar.update();
                    }
                }
            };
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });