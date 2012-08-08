/**
 * @class Oskari.mapframework.bundle.myplaces2.CategoryHandler
 * 
 * Handles category related functionality for my places (map layers etc)
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.CategoryHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    // init layers from link (for printing) on initial load
    this.initialLoad = true;
}, {
    __name : 'MyPlacesCategoryHandler',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = this.instance.sandbox;
        var user = sandbox.getUser();
        
        if(user.isLoggedIn()) {
            sandbox.register(me);
            for(p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }
        }
    },
        
    /**
     * @method stop
     * implements Module protocol stop method
     */
    stop : function() {
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method MyPlaces.MyPlacesChangedEvent
         * Checks if categories have been changed and updates corresponding maplayers accordingly
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
            this._handlePlacesChanged();
        }
    },
    /**
     * @method _handlePlacesChanged
     * Called when a place or category is added, updated or deleted (and on initial load)
     */
    _handlePlacesChanged : function() {
        var sandbox = this.instance.sandbox;
        // check map layers for categorychanges
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var categories = this.instance.getService().getAllCategories();
        
        var mapLayers = mapLayerService.getAllLayersByMetaType(this.instance.idPrefix);
        
        // check for removal
        for(var i = 0; i < mapLayers.length; ++i) {
            var layer = mapLayers[i];
            var found = false;
            for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
                var cat = categories[catIdx];
                if(this._getMapLayerId(cat.getId()) === layer.getId()) {
                    found = true;
                }
            }
            // remove map layer if the category is no longer available
            if(!found) {
                // remove maplayer from selected
                // TODO: do we need to check if the layer is selected or just send this out every time?
                sandbox.requestByName(this.getName(), "RemoveMapLayerRequest", [layer.getId()]);
                // remove maplayer from all layers
                mapLayerService.removeLayer(layer.getId());
                
                // remove grid tab for category
                //var catID = layer.getId().substring(this.instance.idPrefix.length + 1);
                //this.uiItems.gridPanel.removeCategory(catID);
            }
        }
        
        // check for update or add
        for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
            var cat = categories[catIdx];
            var found = false;
            for(var i = 0; i < mapLayers.length; ++i) {
                if(this._getMapLayerId(cat.getId()) === mapLayers[i].getId()) {
                    // found matching maplayer
                    found = true;
                    // check name change
                    if(cat.getName() !== mapLayers[i].getName()) {
                        var layerConf = {
                            name: cat.getName()
                        };
                        // update maplayer name if category name has changed
                        mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
                    }
                }
            }
            if(!found) {
                // add maplayer
                var json = this._getMapLayerJson(cat);
                var myplacesLayer = mapLayerService.createMapLayer(json);
                mapLayerService.addLayer(myplacesLayer);
            }
            //this.uiItems.gridPanel.addOrUpdateCategory(cat);
        }
        
        if(this.initialLoad) {
            // add the myplaces layers programmatically since normal link processing 
            // cant do this (run before the bundle adds the layers)
            this._processStartupLinkLayers(sandbox);
            // done here because layers aren't added to the service before this
            this.initialLoad = false;
        
            // preselect the first category
            //this.uiItems.gridPanel.showCategory();
        }
    },
    /**
     * @method addLayerToMap
     * Adds the my places map layer to selected if it is not there already
     */
    addLayerToMap : function(categoryId) {
        var layerId = this._getMapLayerId(categoryId);
        var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
            var request = this.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
            // FIXME: not a registered module so this should fail?
            this.sandbox.request(this.getName(), request);
        }
    },
    /**
     * @method addLayerToService
     * Adds the my places map layer service
     */
    addLayerToService : function(category) {
        // add maplayer to Oskari
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var json = this._getMapLayerJson(category);
        var myplacesLayer = mapLayerService.createMapLayer(json);
        mapLayerService.addLayer(myplacesLayer);
    },
    _getMapLayerId : function(categoryId) {
        if(!categoryId) {
            // default to default category id(?)
            var defCat = this.myPlacesService.getDefaultCategory();
            if(defCat) {
                
                categoryId = defCat.getId();
            }
            else {
                categoryId = '-99';
            }
        }
        return this.instance.idPrefix + '_' + categoryId;
    },
    /**
     * @method _getMapLayerJson
     * Populates the category based data to the base maplayer json
     * @private 
     * @return maplayer json for the category
     */
    _getMapLayerJson : function(categoryModel) {
        var baseJson = this._getMapLayerJsonBase();
        // wmsurl = "/karttatiili/myplaces?myCat="
        // FIXME: wmsurl from conf - live version gets from portal-ext.properties?
        //baseJson.wmsUrl = this.instance.conf.wmsUrl + categoryModel.getId() + "&";
        baseJson.wmsUrl = "/karttatiili/myplaces?myCat=" + categoryModel.getId() + "&";
        baseJson.name = categoryModel.getName();
        
        //wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?CQL_FILTER=uuid='"+userKey+"'"
        baseJson.id = this._getMapLayerId(categoryModel.getId());
        return baseJson;
    },
    /**
     * @method _getMapLayerJsonBase
     * Returns a base model for maplayer json to create my places map layer
     * @private 
     * @return {Object}
     */
    _getMapLayerJsonBase : function() {
        var catLoc = this.instance.getLocalization('category');
        var json = {
            wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            type: "wmslayer",
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity:75,
            metaType: this.instance.idPrefix,
            orgName: catLoc.organization,
            inspire: catLoc.inspire,
            maxScale:1
        };
        return json;
    },
    /**
     * 
     */
    _processStartupLinkLayers: function(sandbox) {
        var mapLayers = sandbox.getRequestParameter('mapLayers');
        
        if(mapLayers === null || mapLayers === "") {
            // no linked layers
            return;
        }
        var layerStrings = mapLayers.split(",");
        var keepLayersOrder = true;

        for(var i = 0; i < layerStrings.length; i++) {
            var splitted = layerStrings[i].split("+");
            var layerId = splitted[0];
            var opacity = splitted[1];
            //var style = splitted[2];
            if(layerId !== null && layerId.indexOf(this.instance.idPrefix) !== -1) {
                var rb = null;
                var r = null;
                rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                r = rb(layerId, keepLayersOrder);
                sandbox.request(this.getName(), r);
                rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                r = rb(layerId, opacity);
                sandbox.request(this.getName(), r);
            } 
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
