/**
 * @class Oskari.sample.bundle.helloworld.HelloWorldFlyout
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.sample.bundle.helloworld.HelloWorldFlyout',
/**
 * @static constructor function
 */
function() {

}, {
    /**
     * @method startPlugin
     * called by host to start flyout operations
     */
    startPlugin : function() {
        var el = this.getEl();
        
        /* this gets the flyout part */
        var loc  = this.getLocalization();
        var msg = loc.message ;
        
        el.append(msg);
          
    },
    
     /**
     * @method stopPlugin
     * called by host to stop flyout operations
     */
    stopPlugin : function() {
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultFlyout"]
});
