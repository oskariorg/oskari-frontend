/**
 * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension.
 *
 * @class Oskari.<mynamespace>.<bundle-identifier>.MyBundleInstance
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    // Best practice is to initialize instance variables here.
    this.myVar = undefined;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'hierarchical-layerlist',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    eventHandlers: {
        'MapClickedEvent': function (event) {
            console.log('Map clicked at', event.getLonLat());
        }
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     *
     * @method afterStart
     */
    afterStart: function (sandbox) {
        console.log('Bundle', this.getName(), 'started');
        this.myVar = 'foobar';
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});