/**
 * Returns the content for the tooltip shown after the user hovers over a municipality on the map.
 * 
 * @class Oskari.mapframework.bundle.mapstats.event.HoverTooltipContentEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.event.HoverTooltipContentEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} content Content HTML for the tooltip
 */
function(content) {
    this._content = content;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "MapStats.HoverTooltipContentEvent";
    },
    /**
    * @method getContent
    * Returns the content HTML for the tooltip
    * @return {String}
    */
    getContent: function() {
        return this._content;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});