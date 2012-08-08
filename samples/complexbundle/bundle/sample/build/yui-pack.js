/* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

Oskari.clazz.define("Oskari.mapframework.bundle.SampleBundleInstance",
/**
 * @constructor
 */
function() {


}, {
	/** class methods */
	"start" : function() {
		alert('Started!');

	},
	"update" : function() {
	},
	"stop" : function() {
		alert('Stopped!');
	}
}, {
	"protocol" : [ "Oskari.bundle.BundleInstance" ]
})
