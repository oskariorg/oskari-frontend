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
        console.log('initializing');
    }, {
        __name: 'admin-layeranalytics',
        afterStart: function () {
            console.log('starting up');
        },
        getName: function () {
            return this.__name;
        },
        createUi: function () {
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
