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
