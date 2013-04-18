/**
 * @class Oskari.mapframework.mapmodule-plugin.event.FeaturesRemovedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.event.FeaturesRemovedEvent',
    function(layerName, features) {
        this._layerName = layerName;
        this._features = features;
    },
    {
        __name : "FeaturesRemovedEvent",
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