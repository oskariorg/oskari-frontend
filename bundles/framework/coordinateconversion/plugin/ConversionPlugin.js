Oskari.clazz.define('Oskari.mapframework.bundle.coordinateconversion.plugin.ConversionPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config, locale) {
        // FIXME see if the inherited ._loc would work...
        this._locale = locale;
        this._config = config;
        this._clazz =
            'Oskari.mapframework.bundle.coordinateconversion.plugin.ConversionPlugin';
        this._name = 'ConversionPlugin';
    }, {
        _createControlElement: function () {

        },
        refresh : function () {
            
        }

    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
