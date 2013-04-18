/**
 * @class Oskari.mapframework.mapmodule-plugin.event.FeaturesAddedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.event.FeaturesAddedEvent',
    function(layerName, features) {
        this._layerName = layerName;
        this._features = features;
    },
    {
        __name : "FeaturesAddedEvent",
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