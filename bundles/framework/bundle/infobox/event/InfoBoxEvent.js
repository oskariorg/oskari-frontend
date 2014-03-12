/**
 * @class Oskari.mapframework.bundle.infobox.event.InfoBoxEvent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.event.InfoBoxEvent', 
/**
 * @method create called automatically on construction
 * @static
 */
function(_popupId, _popupOpen) {
    this._popupId = _popupId;
    this._isOpen = _popupOpen;
}, {
    /** @static @property __name event name */
    __name : "InfoBox.InfoBoxEvent",
    /**
     * @method getName
     * @return {String} the name for the event 
     */
    getName : function() {
        return this.__name;
    },
    getId : function() {
        return this._popupId;
    },
    isOpen : function() {
        return this._isOpen;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
