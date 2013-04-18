/**
 * @class Oskari.mapframework.myplaces.event.FeedbackLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.myplaces.event.FeedbackLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "FeedbackLoadedEvent",
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