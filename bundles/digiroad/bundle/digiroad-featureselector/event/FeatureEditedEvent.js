/**
 * @class Oskari.digiroad.featureselector.event.FeatureEditedEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.featureselector.event.FeatureEditedEvent',
    function(layerName, feature, callback) {
        this._layerName = layerName;
        this._feature = feature;
        this._callback = callback;
    },
    {
        __name : "FeatureSelector.FeatureEditedEvent",
        getName : function() {
            return this.__name;
        },

        /**
        * @method getLayerName
        * @return {String} the layer id.
        */
        getLayerName: function() {
            return this._layerName;
        },

        /**
        * @method getFeature
        * @return {Object} the edited feature from the grid.
        * Note that this is just a plain JavaScript object, not an OpenLayers.Feature
        */
        getFeature : function() {
            return this._feature;
        },

        /**
        * @method getCallback
        * @return {Function} the callback function to be excecuted after
        * the feature has been handled.
        */
        getCallback: function() {
            return this._callback;
        }
    },
    {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
    }
);