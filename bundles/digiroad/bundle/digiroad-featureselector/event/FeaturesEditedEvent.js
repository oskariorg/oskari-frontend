/**
 * @class Oskari.digiroad.featureselector.event.FeaturesEditedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.featureselector.event.FeaturesEditedEvent',
    function(feature) {
        this._feature = feature;
    },
    {
        __name : "FeaturesEditedEvent",
        getName : function() {
            return this.__name;
        },
        getFeature : function() {
            return this._feature;
        }
    },
    {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
    }
);