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
Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.View', function() {
}, {
    /**
     * @property eventHandlers
     * a set of event handling functions for this view
     * These will be registered/unregistered automagically
     *
     */
    "eventHandlers" : {
        "MapLayerVisibilityChangedEvent" : function(event) {
            console.log("YEP", event);
        },
        "AfterMapMoveEvent" : function(event) {

        },
        'MapLayerEvent' : function(event) {

            var sandbox = this.getSandbox();
            // populate layer list
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var layers = mapLayerService.getAllLayers();
            if(this.view != null){
debugger;
                this.view.addToCollection(layers);
            }
        
            // for(var i = 0; i < this.layerTabs.length; ++i) {
            //     var tab = this.layerTabs[i];
            //     // populate tab if it has grouping method
            //     if(tab.groupingMethod) {
            //         var layersCopy = layers.slice(0);
            //         var groups = this._getLayerGroups(layersCopy, tab.groupingMethod);
            //         tab.showLayerGroups(groups);
            //     }
            // }

            // var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            // var layerId = event.getLayerId();

            // if(event.getOperation() === 'add') {
            //     var layer = mapLayerService.findMapLayer(layerId);
            //     //this.plugins['Oskari.userinterface.Flyout'].handleLayerAdded(layer);
            //     // refresh layer count
            //     //this.plugins['Oskari.userinterface.Tile'].refresh();
            // }
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
            '_bundle' : '../../../Oskari/bundles/integration/bundle/admin-layerselector'
        }
    },


    init : function() {
/*
        var sandbox = this.getSandbox()
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        sandbox.registerAsStateful(this.instance.mediator.bundleId, this);
        
        var successCB = function() {
            // massive update so just recreate the whole ui
            //me.plugins['Oskari.userinterface.Flyout'].populateLayers();
            // added through maplayerevent
        };
        var failureCB = function() {
            alert(me.getLocalization('errors').loadFailed);
        };
        mapLayerService.loadAllLayersAjax(successCB, failureCB);
*/        
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
        container.addClass("admin-layerselector");

        var locale = this.getLocalization();
        var confRequirementsConfig = 
            (this.getConfiguration()||{}).requirementsConfig;
        var requirementsConfig = 
            confRequirementsConfig||this.requirementsConfig;

        require.config(requirementsConfig);
        require(["_bundle/views/layerSelectorView"], function(LayerSelectorView) {

            // Finally, we kick things off by creating the **App**.
            me.view = new LayerSelectorView({
                el : container,
                instance : me.instance,
                locale : me.locale
            });
        });
    },


}, {
    "extend" : ["Oskari.integration.bundle.bb.View"]
});
