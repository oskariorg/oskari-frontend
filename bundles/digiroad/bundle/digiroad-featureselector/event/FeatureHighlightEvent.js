/**
 * @class Oskari.digiroad.featureselector.event.FeatureHighlightEvent
 */
Oskari.clazz.define(
    'Oskari.digiroad.featureselector.event.FeatureHighlightEvent',
    function(layerName, feature, highlighType) {
        this._layerName = layerName;
        this._feature = feature;
        // 'highlight' or 'unHighlight'
        this._highlightType = highlighType;
    },
    {
        __name : "FeatureHighlightEvent",
        getName : function() {
            return this.__name;
        },
        getLayerName: function() {
            return this._layerName;
        },
        getFeature : function() {
            return this._feature;
        },
        getHighlightType: function() {
            return this._highlightType;
        }
    },
    {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
    }
);