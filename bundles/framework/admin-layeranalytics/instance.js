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
        console.log('initializing');
    }, {
        __name: 'admin-layeranalytics',
        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            console.log('kukkuu');
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },
        afterStart: function () {
            console.log('starting up' + this.getName());
        },
        getName: function () {
            return this.__name;
        },
        createUi: function () {
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
