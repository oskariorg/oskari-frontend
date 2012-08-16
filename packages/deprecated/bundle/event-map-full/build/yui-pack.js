/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.event.common.AfterGenerateHtmlLinkToMapEvent
 *
 * Triggers on Oskari.mapframework.request.common.GenerateHtmlLinkToMapRequest
 * and delivers the url in the event which interested modules can listen to and show.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterGenerateHtmlLinkToMapEvent', 

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
    __name : "AfterGenerateHtmlLinkToMapEvent",
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

/* Inheritance *//**
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

/* Inheritance */Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterStartMapPublisherEvent',
		function(url) {
			this._creator = null;
			this._url = url;
		}, {
			__name : "AfterStartMapPublisherEvent",
			getName : function() {
				return this.__name;
			},

			getUrl : function() {
				return this._url;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

Oskari.clazz.define('Oskari.mapframework.event.common.AfterDrawPolygonEvent',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "AfterDrawPolygonEvent",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterDrawSelectedPolygonEvent',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "AfterDrawSelectedPolygonEvent",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

Oskari.clazz.define('Oskari.mapframework.event.common.AfterSelectPolygonEvent',
		function(id, groupId) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
		}, {
			__name : "AfterSelectPolygonEvent",
			getName : function() {
				return this.__name;
			},

			getId : function() {
				return this._id;
			},

			getGroupId : function() {
				return this._groupId;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

Oskari.clazz.define('Oskari.mapframework.event.common.AfterRemovePolygonEvent',
		function(id, groupId, showPol) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
			this._showPol = showPol;
		}, {
			__name : "AfterRemovePolygonEvent",
			getName : function() {
				return this.__name;
			},

			getId : function() {
				return this._id;
			},

			getGroupId : function() {
				return this._groupId;
			},

			getShowPol : function() {
				return this._showPol;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

Oskari.clazz.define('Oskari.mapframework.event.common.AfterErasePolygonEvent',
		function(id) {
			this._creator = null;
			this._id = id;
		}, {
			__name : "ErasePolygonEvent",
			getName : function() {
				return this.__name;
			},

			getId : function() {
				return this._id;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

/**
 * @class Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent
 *
 * Triggers on GetFeatureInfoRequest after AfterGetFeatureInfoEvent.
 * See Oskari.mapframework.request.common.GetFeatureInfoRequest and
 * Oskari.mapframework.event.common.AfterGetFeatureInfoEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent',

/**
 * @method create called automatically on construction
 * @static
 * @param {Boolean} header
 *          header text (e.g. layer name)
 * @param {String} message
 * 			response content for GetFeatureInfo request 
 */
function(header, message) {
    this._creator = null;

    this._header = header;
    this._message = message;
}, {
    /** @static @property __name event name */
    __name : "AfterAppendFeatureInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getHeader
     * @return {String} header text (e.g. layer name)
     */
    getHeader : function() {
        return this._header;
    },
    /**
     * @method getMessage
     * @return {String} response content for GetFeatureInfo request 
     */
    getMessage : function() {
        return this._message;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterUpdateHiddenValueEvent',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "AfterUpdateHiddenValueEvent",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

