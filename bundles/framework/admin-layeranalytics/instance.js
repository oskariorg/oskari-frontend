/**
 * @class Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance
 *
 * See Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance',

    /**
    * @method create called automatically on construction
    * @static
    */
    function () {
        var conf = this.getConfiguration();
        conf.name = 'admin-layeranalytics';
        conf.flyoutClazz = 'Oskari.admin.bundle.admin-layeranalytics.Flyout';
    }, {
        __name: 'layeranalytics',
        afterStart: function () {
            this.createUi();
        },
        getName: function () {
            return this.__name;
        },
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createContent();
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
