/**
 * @class Oskari.mapframework.event.common.AfterGenerateHtmlPrintToMapEvent
 *
 * Triggers on Oskari.mapframework.request.common.GenerateHtmlPrintToMapRequest
 * and delivers the url in the event which interested modules can listen to and
 * show.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterGenerateHtmlPrintToMapEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            html link URL to current view
 */
function(html) {
    this._creator = null;
    this._html = html;
}, {
    /** @static @property __name event name */
    __name : "AfterGenerateHtmlPrintToMapEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getHtml
     * @return {String} link URL
     */
    getHtml : function() {
        return this._html;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */