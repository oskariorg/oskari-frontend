/**
 * @class Oskari.mapframework.bundle.personaldata.request.AddTabRequest
 * Requests tab to be added
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.request.AddTabRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} viewname for the view to be saved
 */
function(title, content, first, id) {
    this._title = title;
    this._content = content;
    this._first = !!first;
    this._id = id;
},{
    /** @static @property __name request name */
    __name : "PersonalData.AddTabRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} tab title
     */
    getId : function() {
        return this._id;
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
     * @method isFirst
     * @return {Boolean} is tab added as first
     */
    isFirst : function() {
        return this._first;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});