/**
 * @class Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundleInstance
 * 
 * This bundle demonstrates a simplest possible bundle 
 * that will just alert a Hello World message on startup.
 * 
 * Add this to startupsequence to get this bundle started
 {
            title : 'myfirstbundle',
            fi : 'myfirstbundle',
            sv : '?',
            en : '?',
            bundlename : 'myfirstbundle',
            bundleinstancename : 'myfirstbundle',
            metadata : {
                "Import-Bundle" : {
                    "myfirstbundle" : {
                        bundlePath : '/<path to>/packages/sample/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }
 */
Oskari.clazz.define("Oskari.sample.bundle.myfirstbundle.SimpleHelloWorldBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        //  **************************************
        //    Your code here
        //  **************************************
        alert('Hello World');
        //  **************************************
        //    Your code ends
        //  **************************************
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
    },
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    }
}, {
    protocol : ['Oskari.bundle.BundleInstance']
});
