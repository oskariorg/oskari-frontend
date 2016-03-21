/**
 * @class Oskari.mapframework.bundle.infobox.event.InfoBoxEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.event.InfoBoxEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(_popupId, _popupOpen, _contentId) {
    this._popupId = _popupId;
    this._isOpen = _popupOpen;
    this._contentId = _contentId;
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
    },
    getContentId : function() {
        return this._contentId;
    },
    /**
     * Serialization for RPC
     * @return
     */
    getParams: function () {
        return {
        	id: this._popupId,
        	isOpen: this._isOpen,
        	contentId: this._contentId
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
