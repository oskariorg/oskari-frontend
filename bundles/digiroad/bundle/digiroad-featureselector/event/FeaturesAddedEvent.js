/**
 * @class Oskari.digiroad.featureselector.event.FeaturesAddedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.featureselector.event.FeaturesAddedEvent',
    function(layerName, features) {
        this._layerName = layerName;
        this._features = features;
    },
    {
        __name : "FeatureSelector.FeaturesAddedEvent",
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