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
 */
function(feature, highlighted) {
    this._feature = feature;
    this._highlighted = highlighted;
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
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});