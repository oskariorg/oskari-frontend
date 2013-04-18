/**
 * @class Oskari.mapframework.myplaces.event.EditedFeaturesLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.myplaces.event.EditedFeaturesLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "MyPlaces.EditedFeaturesLoadedEvent",
        getName : function() {
            return this.__name;
        },

        getFeatures: function() {
            return this._features;
        }
    }, {
        'protocol' : ['Oskari.mapframework.event.Event']
    }
);