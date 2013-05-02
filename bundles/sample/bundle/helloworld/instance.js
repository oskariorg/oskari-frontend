/**
 * @class Oskari.sample.bundle.helloworld.HelloWorldBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.sample.bundle.helloworld.HelloWorldBundleInstance',
/**
 * @static constructor function
 */
function() {

}, {

    "eventHandlers" : {
        "AfterMapMoveEvent" : function() {
//            console.log("AfterMapMoveEvent");
        }
    }

}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
