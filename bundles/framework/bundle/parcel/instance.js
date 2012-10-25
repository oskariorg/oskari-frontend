/**
 * @class Oskari.framework.bundle.parcel.DrawingToolInstance
 */

Oskari.clazz.define("Oskari.framework.bundle.parcel.DrawingToolInstance",

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
		alert('Hello World for Parcel Drawing Tool \\o/');
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
