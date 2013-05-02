/**
 * @class Oskari.integration.bundle.todo.View
 *
 * This is an reference implementation View which implements functionality
 *  with BackboneJS within Oskari flyouts.
 *
 * THIS WILL DECLARE FOLLOWING
 *
 * - eventHandlers  which will receive notifications from Oskari
 * - requirementsConfig to support loading with require - This might change though
 * - requirements - INITIAL REQUIREMENTS
 *
 * This example is based on ToDO app from BackboneJS which required *some*
 * modifications to fit into model/collection/view/template form.
 * Sample was not fully fixed but will do as an example.
 *
 *
 */
Oskari.clazz.define('Oskari.integration.bundle.todo.View', function() {
}, {
    /**
     * @property eventHandlers
     * a set of event handling functions for this view
     * These will be registered/unregistered automagically
     *
     */
    "eventHandlers" : {
        "MapLayerVisibilityChangedEvent" : function(event) {
            
        },
        "AfterMapMoveEvent" : function(event) {

        }
    },

    /**
     * @property requirementsConfig
     *
     * requirejs requirements config to fix paths
     *
     */
    "requirementsConfig" : {
        "waitSeconds" : 15,
        "paths" : {
            '_bundle' : '../../../Oskari/bundles/integration/bundle/todo'
        }
    },
   
    /**
     * @method render
     * This is called when *everything* is ready for Backbone to be started
     * Called with requirements from above as arguments to method in
     * defined order.
     */
    "render" : function() {
        var me = this;
        var container = this.getEl();
        container.addClass("todo");

        var locale = this.getLocalization();

        /* _bundle - path conf is set in bundle loader based on bundle.js */
        
        require(["_bundle/views/todoView"], function(ToDoView) {

            // Finally, we kick things off by creating the **App**.
            me.view = new ToDoView({
                el : container
            });
        });
    }
}, {
    "extend" : ["Oskari.integration.bundle.backbone.View"]
});
