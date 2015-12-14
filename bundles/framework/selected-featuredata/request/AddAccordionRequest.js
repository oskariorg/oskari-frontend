/**
 * @class Oskari.mapframework.bundle.selected-featuredata.request.AddAccordionRequest
 * Requests tab to be added
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.selected-featuredata.request.AddAccordionRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(title, content, visible, id, tabid) {
    this._title = title;
    this._content = content;
    this._visible = visible;
    this._id = id;
    this._tabid = tabid;
},{
    /** @static @property __name request name */
    __name : "SelectedFeatureData.AddAccordionRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getTitle
     * @return {String} tab title
     */
    getTitle : function() {
       return this._title;
    },
    /**
     * @method getContent
     * @return {String} content for the tab to be added
     */
    getContent : function() {
       return this._content;
    },
    /**
     * @method getVisible
     * @return {Boolean} should panel be open
     */
    getVisible : function() {
        return this._visible;
    },
     /**
     * @method getId
     * @return {String} id
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getTabId
     * @return {String} id
     */
    getTabId : function() {
        return this._tabid;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});