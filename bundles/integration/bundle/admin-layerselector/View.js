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
            
        },
        "AfterMapMoveEvent" : function(event) {

        },
        'MapLayerEvent' : function(event) {
            // trigger after interval since events are being spammed by backendstatus
            // this way browser doesn't crash
            var interval = 500;
            var me = this;
            if(this._previousLayerUpdateTimer) {
                clearTimeout(this._previousLayerUpdateTimer);
                this._previousLayerUpdateTimer = null;
            }
            this._previousLayerUpdateTimer = setTimeout(function() {
                me._layerUpdateHandler();
            }, interval);

            jQuery("body").css({cursor: "auto"});
        }
    },
    /**
     * @method _layerUpdateHandler
     * @private
     * Updates layers listing after layers has been changed/MapLayerEvent has been received.
     */
    _layerUpdateHandler : function() {
		//console.log("admin-layerselector/View.js:_layerUpdateHandler");
        // TODO! currently update, add and initial additions execute
        // the same code. This needs to be updated when mapLayerService
        // can handle updates better. 
        // (updates everything instead of layer.name)
        var sandbox = this.getSandbox();
        // populate layer list
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var layers = mapLayerService.getAllLayers();
        if(this.view != null){
            this.view.addToCollection(layers);
        } else {
            this.layers = layers;
        }
        /* TODO use this to _update_ the updated layer?
        // TODO: handle based on operation
        if(event.getOperation() === 'update') {
        }
        else if(event.getOperation() === 'add') {
        }
        */
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
            me._layerUpdateHandler();
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

        /*
         *****************
         * NORMAL LAYERS *
         *****************
         */
        // remove layer from mapLayerService
        if(e.command == "removeLayer") {
            if (e.baseLayerId) {
                // If this is a sublayer, remove it from its parent's sublayer array
                var parentLayerId = 'base_' + e.baseLayerId;
                mapLayerService.removeSubLayer(parentLayerId, e.modelId);
            } else {
                // otherwise just remove it from map layer service.
                mapLayerService.removeLayer(e.modelId);
            }
        } 
        // add layer into mapLayerService
        else if(e.command == "addLayer") {
            e.layerData.name = e.layerData.admin.nameFi;
            var mapLayer = mapLayerService.createMapLayer(e.layerData);
            mapLayer.admin = e.layerData.admin;

            if (e.baseLayerId) {
                // If this is a sublayer, add it to its parent's sublayer array
                var parentLayerId = 'base_' + e.baseLayerId;
                mapLayerService.addSubLayer(parentLayerId, mapLayer);
            } else {
                // Otherwise just add it to the map layer service.
                if(mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                    mapLayerService.addLayer(mapLayer);
                }
            }
        }
        // update layer info
        else if(e.command == "editLayer") {
			//console.log("Editing layer");
            e.layerData.name = e.layerData.admin.nameFi; //TODO this should be in mapLayerService
            mapLayerService.updateLayer(e.layerData.id, e.layerData);
        }

        /*
         ************************
         * BASE OR GROUP LAYERS *
         ************************
         */
        // load the map layers again
        else if(e.command == "addGroup") {
            mapLayerService.loadAllLayersAjax();
        }
        // Remove the base/group layer from mapLayerService
        // and load it again from backend, since we edited
        // the layer class and the changes will not be
        // reflected to the corresponding map layer directly.
        else if(e.command == "editGroup") {
            mapLayerService.removeLayer(e.id, true);
            mapLayerService.loadAllLayersAjax();
        }
        else if(e.command == "deleteGroup") {
            mapLayerService.removeLayer(e.id);
        }
    }


}, {
    "extend" : ["Oskari.integration.bundle.bb.View"]
});
