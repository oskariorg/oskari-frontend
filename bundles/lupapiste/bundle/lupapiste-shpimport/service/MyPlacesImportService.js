/**
 * @class Oskari.lupapiste.bundle.shpimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.shpimport.MyPlacesImportService',
/**
 * @method create called automatically on construction
 * @static
 */
function(instance, importUrl) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
    this.layerName = "LupapisteVectors";
    this.importUrl = importUrl;
}, {
    __name: "ShpImport.MyPlacesImportService",
    __qname: "Oskari.lupapiste.bundle.shpimport.MyPlacesImportService",
    getQName : function() {
        return this.__qname;
    },
    getName: function() {
        return this.__name;
    },
    /**
     * Initializes the service (does nothing atm).
     * 
     * @method init
     */
    init: function() {
    },
    /**
     * Returns the url used to send the file data to.
     * 
     * @method getFileImportUrl
     * @return {String}
     */
    getFileImportUrl: function() {
        return this.importUrl;
    },
    /**
     * Adds one layer to the map layer service
     * and calls the cb with the added layer model if provided.
     * 
     * @method addLayerToService
     * @param {JSON} layerJson
     * @param {Function} cb (optional)
     */
    addUserDataToService: function (formValues, layerJson, cb) {
        var me = this;
        var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        if (mapModule == null)
            return;
        var map = mapModule.getMap();
        if (map == null)
            return;
        var layers = map.getLayersByName(this.layerName);
        if (layers == null || layers.length == 0)
            return;
        var layer = layers[0];

        var in_options = {
            'internalProjection': map.baseLayer.projection,
            'externalProjection': map.baseLayer.projection
            //'externalProjection': new OpenLayers.Projection('EPSG:4326')
        };

        //alert(map.baseLayer.projection);
        var deserializer = new OpenLayers.Format.GeoJSON(in_options);
        var features = deserializer.read(layerJson);
        
        me._addFeaturesAsPlaces(features, layer);
        //me._addFeaturesToLayer(features, layer);
        //me._notifyDataAdded(features);

        if (_.isFunction(cb))
            cb(features, formValues);
    },
    _addFeaturesToLayer : function(features, layer) {
        var toRemove = [];
        for (idx in features) {
            var item = features[idx];
            var itemsToRemove = layer.getFeaturesByAttribute("id", item.attributes.id);
            for (innerIdx in itemsToRemove) {
                toRemove.push(itemsToRemove[innerIdx]);
            }
        }
        layer.removeFeatures(toRemove);
        layer.addFeatures(features);
    },
    _notifyDataAdded : function (features) {
        var sandbox = this.sandbox;
        var eventBuilder = sandbox.getEventBuilder('Lupapiste.FeaturesAdded');
        var event = eventBuilder(features);
        sandbox.notifyAll(event);
    },
    _addFeaturesAsPlaces: function (features, layer) {
        var sandbox = this.sandbox;
        var service = sandbox.getService('Oskari.lupapiste.bundle.myplaces2.service.MyPlacesService');
        var me = this;
        var category = service.getDefaultCategory();
        var places = [];

        for (ix in features) {
            var feature = features[ix];
            var place = this._mapFeatureToPlace(feature);
            place.setCategoryID(category.getId());
            places.push(place);
        }

        var callback = function (success, list) {
            var featuresToSave = [];

            for (iy in list) {
                var placeObj = list[iy];
                var f = new OpenLayers.Feature.Vector();                    
                f.geometry = placeObj.getGeometry();
                f.attributes['id'] = placeObj.getId();
                f.attributes['name'] = placeObj.getName();
                f.attributes['link'] = placeObj.getLink();
                f.attributes['desc'] = placeObj.getDescription();
                f.attributes['height'] = placeObj.getHeight();
                f.attributes['category'] = placeObj.getCategoryID();
                f.attributes['area'] = placeObj.getArea();
                f.attributes['length'] = placeObj.getLength();

                featuresToSave.push(f);
            }

            me._addFeaturesToLayer(featuresToSave, layer);
        };

        service.saveMyPlaces(places, callback);
    },
    _mapFeatureToPlace: function(feature) {
        var place = Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.model.MyPlace');
        if(typeof feature.attributes.nimi !== 'undefined' && feature.attributes.nimi !== null && feature.attributes.nimi.length > 0) {
          place.setName(feature.attributes.nimi);
        } else {
          place.setName("---");
        }
        place.setGeometry(feature.geometry);

        return place;
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});