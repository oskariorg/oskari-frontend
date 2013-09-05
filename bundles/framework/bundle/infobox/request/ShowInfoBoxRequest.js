/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest
 * Requests a map popup/infobox to be shown
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest', 
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
	   * @param {Object} colourScheme
	   *		the colour scheme object for the popup (optional, uses the default colour scheme if not passed)
	   * @param {String} font
	   *		the id of the font for the popup (optional, uses the default font if not passed)
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
	  function(id,title, content, position, hidePrevious, colourScheme, font) {
	    this._creator = null;
	    this._id = id;
	    this._title = title;
	    this._content = content;
	    this._position = position;
	    this._hidePrevious = (hidePrevious == true);
	    this._colourScheme = colourScheme;
	    this._font = font;
	  }, {
	    /** @static @property __name request name */
	    __name : "InfoBox.ShowInfoBoxRequest",
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
	     * @method getColourScheme
	     * @return {Object} the colour scheme object for the popup
	     */
	    getColourScheme: function() {
	    	return this._colourScheme;
	    },
	    /**
	     * @method getFont
	     * @return {String} the id of the font for the popup
	     */
	    getFont: function() {
	    	return this._font;
	    }
	  }, {
	    /**
	     * @property {String[]} protocol array of superclasses as {String}
	     * @static
	     */
	    'protocol' : ['Oskari.mapframework.request.Request']
	  });