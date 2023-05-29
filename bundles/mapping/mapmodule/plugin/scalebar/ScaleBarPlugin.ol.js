import olControlScaleLine from 'ol/control/ScaleLine';

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
            const container = jQuery('<div class="mapplugin scalebar"></div>');
            const el = jQuery('<div></div>');
            container.append(el);
            // initialize control, pass container
            this._scalebar = new olControlScaleLine({
                target: el[0]
            });

            this.getMap().addControl(this._scalebar);
            return container;
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
