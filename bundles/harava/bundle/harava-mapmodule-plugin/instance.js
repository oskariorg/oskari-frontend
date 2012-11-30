/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance
 *
 * Registers and starts the
 * Oskari.harava.bundle.haravagetinfo.plugin.HaravaGetInfoPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.harava.bundle.MapModulePluginBundleInstance",

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
        //alert('Hello World');
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