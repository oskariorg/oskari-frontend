/**
 * @class Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} feature
 * @param {Boolean} highlighted
 * @param {String} highlightType
 */
function(feature, highlighted, highlightType) {
    this._feature = feature;
    this._highlighted = highlighted;
    this._highlightType = highlightType;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "MapStats.FeatureHighlightedEvent";
    },
    /**
    * Returns the feature which was highlighted on the map.
    *
    * @method getFeature
    * @return {Object}
    */
    getFeature: function() {
        return this._feature;
    },

    /**
     * Returns true if the feature was highlighted, false if unhighlighted.
     *
     * @method isHighlighted
     * @return {Boolean}
     */
    isHighlighted: function() {
        return this._highlighted;
    },

    /**
     * Returns the type of user interaction, that is either 'hover' or 'click'
     *
     * @method getHighlightType
     * @return {String}
     */
    getHighlighType: function() {
        return this._highlightType
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});