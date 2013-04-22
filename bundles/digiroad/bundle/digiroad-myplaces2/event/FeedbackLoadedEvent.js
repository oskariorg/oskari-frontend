/**
 * @class Oskari.digiroad.myplaces.event.FeedbackLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.myplaces.event.FeedbackLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "DigiroadMyPlaces.FeedbackLoadedEvent",
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