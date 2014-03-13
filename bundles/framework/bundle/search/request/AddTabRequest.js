/**
 * @class Oskari.mapframework.bundle.personaldata.request.AddTabRequest
 * Requests tab to be added
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.AddTabRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(title, content, priority) {
    this._title = title;
    this._content = content;
    this._priority = priority;
},{
    /** @static @property __name request name */
    __name : "Search.AddTabRequest",
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
     * @method isFirst
     * @return {Integer} tab order priority
     */
    getPriority : function() {
        return this._priority;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});