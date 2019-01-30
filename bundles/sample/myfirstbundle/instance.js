/**
 * @class Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundleInstance
 *
 * This bundle demonstrates a simplest possible bundle
 * that will just alert a Hello World message on startup.
 *
 * Add this to startupsequence to get this bundle started
 {
            bundlename : 'myfirstbundle',
            bundleinstancename : 'myfirstbundle'
        }
 */
Oskari.clazz.define('Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            //  **************************************
            //    Your code here
            //  **************************************
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(null, 'Hello World');
            dialog.makeModal();
            dialog.fadeout();
            //  **************************************
            //    Your code ends
            //  **************************************
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {},
        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {}
    }, {
        protocol: ['Oskari.bundle.BundleInstance']
    });
