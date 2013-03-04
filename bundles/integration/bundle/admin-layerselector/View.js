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

    _mapLayerUrl : '/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetMapLayerClasses',

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

debugger;
        var me = this;
        var sandbox = me.getSandbox()
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

        jQuery.ajax({
            type : "GET",
            dataType: 'json',
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : 'http://www.paikkatietoikkuna.fi'+me._mapLayerUrl,
            success : function(pResp) {
//                me._loadAllLayersAjaxCallBack(pResp, callbackSuccess);
                me._loadAllLayersAjaxCallBack(pResp, null);
            },
            error : function(jqXHR, textStatus) {
                if(callbackFailure && jqXHR.status != 0) {
                    callbackFailure();
                }
            }
        }); 



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
// copy-paste
    _loadAllLayersAjaxCallBack : function(pResp, callbackSuccess) {
        var allLayers = pResp.layers;
        for(var i = 0; i < allLayers.length; i++) {
            
            var mapLayer = this.createMapLayer(allLayers[i]);
            if(this._reservedLayerIds[mapLayer.getId()] !== true) {
                this.addLayer(mapLayer, true);
            }
        }
        // notify components of added layer if not suppressed
        this._allLayersAjaxLoaded = true;
        var event = this._sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
        this._sandbox.notifyAll(event);
        if(callbackSuccess) {
            callbackSuccess();
        }
    },

    addLayer : function(layerModel, suppressEvent) {

        // throws exception if the id is reserved to existing maplayer
        // we need to check again here
        this.checkForDuplicateId(layerModel.getId(), layerModel.getName());
        
        this._reservedLayerIds[layerModel.getId()] = true;
        // everything ok, lets add the layer
        this._loadedLayersList.push(layerModel);

        if(suppressEvent !== true) {
            // notify components of added layer if not suppressed
            var event = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
            this._sandbox.notifyAll(event);
        }
    },

}, {
    "extend" : ["Oskari.integration.bundle.bb.View"]
});
