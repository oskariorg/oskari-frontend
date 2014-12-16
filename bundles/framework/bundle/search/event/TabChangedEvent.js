/**
 * @class Oskari.mapframework.bundle.search.event.TabChangedEvent
 *
 * Used to notify metadatacatalogue that the tab has changed
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.event.TabChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} previousTabId id of closed tab
 * @param {String} newTabId id of opened tab
 */
function(previousTabId, newTabId) {
    this._previousTabId = previousTabId;
    this._newTabId = newTabId;
}, {
    /** @static @property __name event name */
    __name : "Search.TabChangedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getPreviousTabId
     * Returns the id of closed tab
     * @return {String}
     */
    getPreviousTabId : function() {
        return this._previousTabId;
    },
    /**
     * @method isModification
     * Returns the id of opened tab
     * @return {String}
     */
    getNewTabId : function() {
        return this._newTabId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
