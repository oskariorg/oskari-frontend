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

//    _mapLayerUrl : '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetMapLayerClasses',
    _mapLayerUrl : '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetAdminMapLayers',

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

            // TODO! currently update, add and initial additions execute
            // the same code. This needs to be updated when mapLayerService
            // can handle updates better. 
            // (updates everything instead of layer.name)
            if(event.getOperation() === 'update') {

                var sandbox = this.getSandbox();
                // populate layer list
                var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var layers = mapLayerService.getAllLayers();
                if(this.view != null){
                    this.view.addToCollection(layers);
                } else {
                    this.layers = layers;
                }

            }
            else if(event.getOperation() === 'add') {

                var sandbox = this.getSandbox();
                // populate layer list
                var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var layers = mapLayerService.getAllLayers();
                if(this.view != null){
                    this.view.addToCollection(layers);
                } else {
                    this.layers = layers;
                }

            } else {
                // this section is executed when initial addition is made (all layer added)
                var sandbox = this.getSandbox();
                // populate layer list
                var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var layers = mapLayerService.getAllLayers();
                if(this.view != null){
                    this.view.addToCollection(layers);
                } else {
                    this.layers = layers;
                }
            }


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


    /**
     * @method init
     * This is called when flyout is ready and something needs to be executed
     * before Backbone is rendered
     */
    init : function() {
        // if something needs to be initiated.

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
        // admin-layerselector is rendered under this container
        container.addClass("admin-layerselector");
        // backbone will fire adminAction events if they need to be 
        // passed to other bundles
        container.on("adminAction", {me: this}, me.handleAction);

        var locale = this.getLocalization();
        var confRequirementsConfig = 
            (this.getConfiguration()||{}).requirementsConfig;
        var requirementsConfig = 
            confRequirementsConfig||this.requirementsConfig;

        require.config(requirementsConfig);
        require(["_bundle/views/layerSelectorView"], function(LayerSelectorView) {

            // Finally, we kick things off by creating the **App**.
            // We need to pass container element for the view and
            // instance. 
            me.view = new LayerSelectorView({
                el : container,
                instance : me.instance,
                locale : me.locale
            });
            // If call for layers is ready before backbone is created,
            // we'll instantiate our view with that data 
            if(me.layers != null) {
                me.view.addToCollection(me.layers);
            }
        });
    },



    /**
     * @method handleAction
     * This is called when backbone fires an event that needs to be passed
     * to other bundles. Event should contain a member called *command*
     */
    handleAction: function(e) {
        e.stopPropagation();
        var me = e.data.me;
        var sandbox = me.getSandbox()
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        // remove layer from mapLayerService
        if(e.command == "removeLayer") {
            mapLayerService.removeLayer(e.modelId);
        } 
        // add layer into mapLayerService
        else if(e.command == "addLayer") {
            e.layerData.name = e.layerData.admin.nameFi;
            var mapLayer = mapLayerService.createMapLayer(e.layerData);
            mapLayer.admin = e.layerData.admin;
            if(mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                mapLayerService.addLayer(mapLayer);
            }
        }
        // update layer info
        else if(e.command == "editLayer") {
            e.layerData.name = e.layerData.admin.nameFi; //TODO this should be in mapLayerService
            mapLayerService.updateLayer(e.layerData.id, e.layerData);
        }
    }


}, {
    "extend" : ["Oskari.integration.bundle.bb.View"]
});
