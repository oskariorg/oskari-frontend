/**
 * @class Oskari.sample.bundle.mysecondbundle.ModuleHelloWorldBundleInstance
 * 
 * This bundle demonstrates how bundle can react to events by 
 * registering itself to sandbox as a module.
 *
 * Add this to startupsequence to get this bundle started
 {
            title : 'mysecondbundle',
            fi : 'mysecondbundle',
            sv : '?',
            en : '?',
            bundlename : 'mysecondbundle',
            bundleinstancename : 'mysecondbundle',
            metadata : {
                "Import-Bundle" : {
                    "mysecondbundle" : {
                        bundlePath : '/<path to>/packages/sample/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }
 */
Oskari.clazz.define("Oskari.sample.bundle.mysecondbundle.ModuleHelloWorldBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'MySecondBundle',

    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.__name;
    },
        
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        
        // Should this not come as a param?
        	var conf = me.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
		this.sandbox = sandbox;
        
        // register to sandbox as a module
        sandbox.register(me);
        // register to listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.registerForEventByName(me, p);
            }
        }
    },
    
    /**
     * @method init
     * Module protocol method
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },
    
    /**
     * @method onEvent
     * Module protocol method/Event dispatch
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
    
    /**
     * @static
     * @property eventHandlers
     * Best practices: defining which 
     * events bundle is listening and how bundle reacts to them
     */
    eventHandlers : {
        /**
         * @method MapClickedEvent
         * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
         */
        'MapClickedEvent' : function(event) {
            alert('Map clicked');
        }
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        // unregister from listening events
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.unregisterFromEventByName(me, p);
            }
        }
        // unregister module from sandbox
        me.sandbox.unregister(me);
    }
}, {
    protocol : [ 'Oskari.bundle.BundleInstance', 
                 'Oskari.mapframework.module.Module']
});
