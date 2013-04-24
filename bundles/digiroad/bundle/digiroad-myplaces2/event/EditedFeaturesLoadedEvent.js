/**
 * @class Oskari.digiroad.myplaces.event.EditedFeaturesLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.myplaces.event.EditedFeaturesLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "DigiroadMyPlaces.EditedFeaturesLoadedEvent",
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