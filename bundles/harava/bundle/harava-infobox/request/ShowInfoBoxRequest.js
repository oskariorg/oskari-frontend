/**
 * @class Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest
 * Requests a map popup/infobox to be shown
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
  .define('Oskari.harava.bundle.havaraInfobox.request.ShowInfoBoxRequest', 
	  /**
	   * @method create called automatically on construction
	   * @static
	   *
	   * @param {String} id
	   * 		id for popup so we can use additional requests to control it
	   * @param {String} title
	   * 		popup title
	   * @param {Object[]} contentData
	   * 		JSON presentation for the popup data
	   * @param {OpenLayers.LonLat} lonlat
	   * 		coordinates where to show the popup
	   * @param {Boolean} hidePrevious
	   * 		if true, hides any previous popups when showing this, defaults to false
	   * @param {Integer} width
	   * 		popup width
	   *  @param {Integer} height
	   * 		popup height
	   *  
	   * contentData format example:
	   * [{
	   * 	html: "",
	   *  actions : {
	   * 	   "Tallenna" : callbackFunction,
	   * 	   "Sulje" : callbackFunction
	   * }
	   * }]
	   */
	  function(id,title, content, position, hidePrevious, width, height) {
	    this._creator = null;
	    this._id = id;
	    this._title = title;
	    this._content = content;
	    this._position = position;
	    this._hidePrevious = (hidePrevious == true);
	    this._width = (width || 200);
	    this._height = (height || 150);
	  }, {
	    /** @static @property __name request name */
	    __name : "HaravaInfoBox.ShowInfoBoxRequest",
	    /**
	     * @method getName
	     * @return {String} request name
	     */
	    getName : function() {
	      return this.__name;
	    },
	    /**
	     * @method getId
	     * @return {String} popup/infobox id
	     */
	    getId : function() {
	      return this._id;
	    },
	    /**
	     * @method getTitle
	     * @return {String} popup/infobox title
	     */
	    getTitle : function() {
	      return this._title;
	    },
	    /**
	     * @method getContent
	     * @return {Object[]} popup/infobox title
	     * contentData format example:
	     * [{
	     * 	html: "",
	     *  actions : {
	     * 	   "Tallenna" : callbackFunction,
	     * 	   "Sulje" : callbackFunction
	     * }
	     * }]
	     */
	    getContent : function() {
	      return this._content;
	    },
	    /**
	     * @method getPosition
	     * @return {OpenLayers.LonLat} coordinates where to show the popup
	     */
	    getPosition : function() {
	      return this._position;
	    },
	    /**
	     * @method getHidePrevious
	     * @return {Boolean} if true, hides any previous popups when showing this
	     */
	    getHidePrevious : function() {
	      return this._hidePrevious;
	    },
	    /**
	     * @method getHeight
	     * @return {Integer} popup height
	     */
	    getHeight : function() {
	      return this._height;
	    },
	    /**
	     * @method getWidth
	     * @return {Integer} popup width
	     */
	    getWidth : function() {
	      return this._width;
	    }
	    
	  }, {
	    /**
	     * @property {String[]} protocol array of superclasses as {String}
	     * @static
	     */
	    'protocol' : ['Oskari.mapframework.request.Request']
	  });