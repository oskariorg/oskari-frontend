/**
 * @class Oskari.mapframework.myplaces.event.NewRestrictionsLoadedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.myplaces.event.NewRestrictionsLoadedEvent',
    function(features) {
        this._features = features;
    }, {
        __name : "NewRestrictionsLoadedEvent",
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