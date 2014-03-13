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
Oskari.clazz.define('Oskari.integration.bundle.admin-layerselector.View', function () {}, {

    /**
     * @property eventHandlers
     * a set of event handling functions for this view
     * These will be registered/unregistered automagically
     *
     */
    "eventHandlers": {
        "MapLayerVisibilityChangedEvent": function (event) {

        },
        "AfterMapMoveEvent": function (event) {

        },
        'MapLayerEvent': function (event) {
            if(event.getOperation() === 'update' || 
                event.getOperation() === 'add') {
                // schedule to be updated
                this._scheduleUpdateForLayer(event.getLayerId())
                this._triggerLayerUpdateCountdown();
            }
            else if(event.getOperation() === 'remove') {
                if(this.view) {
                    // check that view has been initialized before calling remove
                    this.view.removeLayer(event.getLayerId());
                }
            }

            jQuery("body").css({
                cursor: "auto"
            });
        }
    },
    _triggerLayerUpdateCountdown : function() {
        // trigger after interval since events are being spammed by backendstatus
        // this way browser doesn't crash
        var interval = 500,
            me = this;

        if (me._previousLayerUpdateTimer) {
            clearTimeout(me._previousLayerUpdateTimer);
            me._previousLayerUpdateTimer = null;
        }
        me._previousLayerUpdateTimer = setTimeout(function () {
            if(!me._layerUpdateHandler()) {
                // try again if not successful - accessed too quickly etc
                me._triggerLayerUpdateCountdown();
            }
        }, interval);
    },
    _scheduleUpdateForLayer : function(layerId) {
        if(!this._scheduledLayers) {
            this._scheduledLayers = [];
        }
        var sandbox = this.getSandbox(),
            mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        // TODO: maybe check layer type and not update if myplaces etc?
        if(layerId) {
            // single layer
            var layer = mapLayerService.findMapLayer(layerId);
            if (layer) {
                // layer found -> schedule for update
                this._scheduledLayers.push(layer);
            }
        }
        else {
            this._scheduledLayers = mapLayerService.getAllLayers();
        }
    },
    /**
     * @method _layerUpdateHandler
     * @private
     * Updates layers listing after layers has been changed/MapLayerEvent has been received.
     */
    _layerUpdateHandler: function () {
        //console.log("admin-layerselector/View.js:_layerUpdateHandler");
        // TODO! currently update, add and initial additions execute
        // the same code. This needs to be updated when mapLayerService
        // can handle updates better. 
        // (updates everything instead of layer.name)
        var sandbox = this.getSandbox(),
            // populate layer list
            mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var success = false;
        if (this.view !== null && this.view !== undefined) {
            if(!this._scheduledLayers || this._scheduledLayers.length > 30) {
                // if more than 30 layers require update -> make full re-render
                success = this.view.createUI(mapLayerService.getAllLayers());
            }
            else {
                success = this.view.addToCollection(this._scheduledLayers);
            }
            if(success) {
               // clear schedule layer updates
               this._scheduledLayers = [];
            }
        }
        return success;
    },

    /**
     * @property requirementsConfig
     *
     * requirejs requirements config to fix paths
     *
     */
    "requirementsConfig": {
        "waitSeconds": 15,
        "paths": {
            '_bundle': '../../../Oskari/bundles/integration/bundle/admin-layerselector'
        }
    },


    /**
     * @method init
     * This is called when flyout is ready and something needs to be executed
     * before Backbone is rendered
     */
    init: function () {
        // if something needs to be initiated.
    },

    /**
     * @method render
     * This is called when *everything* is ready for Backbone to be started
     * Called with requirements from above as arguments to method in
     * defined order.
     */
    "render": function () {
        var me = this,
            container = me.getEl();
        // admin-layerselector is rendered under this container
        container.addClass("admin-layerselector");
        // backbone will fire adminAction events if they need to be 
        // passed to other bundles
        container.on("adminAction", {
            me: me
        }, me.handleAction);

        var locale = me.getLocalization(),
            confRequirementsConfig =
                (this.getConfiguration() || {}).requirementsConfig,
            requirementsConfig =
                confRequirementsConfig || this.requirementsConfig;

        require.config(requirementsConfig);
        require(["_bundle/views/layerSelectorView"], function (LayerSelectorView) {

            // Finally, we kick things off by creating the **App**.
            // We need to pass container element for the view and
            // instance. 
            me.view = new LayerSelectorView({
                el: container,
                instance: me.instance,
                locale: me.locale
            });
            // If call for layers is ready before backbone is created,
            // we'll instantiate our view with that data 
            me._scheduleUpdateForLayer();
            me._layerUpdateHandler();
        });
    },



    /**
     * @method handleAction
     * This is called when backbone fires an event that needs to be passed
     * to other bundles. Event should contain a member called *command*
     */
    handleAction: function (e) {
        e.stopPropagation();
        var me = e.data.me,
            sandbox = me.getSandbox(),
            mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
            parentLayerId;
        /*
         *****************
         * NORMAL LAYERS *
         *****************
         */
        if (e.command === "removeLayer") {
            // remove layer from mapLayerService
            mapLayerService.removeLayer(e.modelId);
        } else if (e.command === "addLayer") {
            // add layer into mapLayerService
            var mapLayer = mapLayerService.createMapLayer(e.layerData);

            if (e.baseLayerId) {
                // If this is a sublayer, add it to its parent's sublayer array
                mapLayerService.addSubLayer(e.baseLayerId, mapLayer);
            } else {
                // Otherwise just add it to the map layer service.
                if (mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                    mapLayerService.addLayer(mapLayer);
                }
                else {
                    alert('Error!! Inserted a new layer but a layer with same id already existed!!');
                    // should we update if layer already exists??? mapLayerService.updateLayer(e.layerData.id, e.layerData); 
                }
            }
        } else if (e.command === "editLayer") {
            // update layer info
            mapLayerService.updateLayer(e.layerData.id, e.layerData);
        }
    }
}, {
    "extend": ["Oskari.integration.bundle.bb.View"]
});