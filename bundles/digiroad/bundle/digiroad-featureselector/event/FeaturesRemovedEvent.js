/**
 * @class Oskari.digiroad.featureselector.event.FeaturesRemovedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.featureselector.event.FeaturesRemovedEvent',
    function(layerName, features) {
        this._layerName = layerName;
        this._features = features;
    },
    {
        __name : "FeatureSelector.FeaturesRemovedEvent",
        getName : function() {
            return this.__name;
        },
        getLayerName : function() {
            return this._layerName;
        },
        getFeatures : function() {
            return this._features;
        }
    },
    {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
    }
);