/**
 * @class Oskari.digiroad.myplaces.event.NewRestrictionsLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.myplaces.event.NewRestrictionsLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "DigiroadMyPlaces.NewRestrictionsLoadedEvent",
        getName : function() {
            return this.__name;
        },

        getFeatures: function() {
            return this._features;
        }
    },
    {
        'protocol' : ['Oskari.mapframework.event.Event']
    }
);