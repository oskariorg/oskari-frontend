/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define(
		'Oskari.mapframework.request.common.UpdateHiddenValueRequest',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "UpdateHiddenValueRequest",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
/**
 * @class Oskari.mapframework.request.common.SearchRequest
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.SearchRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchString the query to search with
 * @param {Function}
 *            onSuccess callback method for successful search 
 * @param {Function}
 *            onComplete callback method for search completion
 */
function(searchString, onSuccess, onComplete) {
    this._creator = null;
    this._searchString = searchString;

    this._onSuccess = onSuccess;

    this._onComplete = onComplete;
}, {
    /** @static @property __name request name */
    __name : "SearchRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSearchString
     * @return {String} query to search with
     */
    getSearchString : function() {
        return this._searchString;
    },
    /**
     * @method getOnSuccess
     * @return {Function} callback method for successful search 
     */
    getOnSuccess : function() {
        return this._onSuccess;
    },
    /**
     * @method getOnComplete
     * @return {Function} callback method for search completion
     */
    getOnComplete : function() {
        return this._onComplete;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.GenerateHtmlLinkToMapRequest
 *
 * Requests for a html link to the map to be shown. Triggers a 
 * Oskari.mapframework.event.common.AfterGenerateHtmlLinkToMapEvent which provides the requested url.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GenerateHtmlLinkToMapRequest',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "GenerateHtmlLinkToMapRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.common.GenerateHtmlPrintToMapRequest
 *
 * Requests for a html link to a print view. Triggers a 
 * Oskari.mapframework.event.common.AfterGenerateHtmlPrintToMapEvent which provides the requested url.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.GenerateHtmlPrintToMapRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "GenerateHtmlPrintToMapRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
/* Inheritance *//**
 * @class Oskari.mapframework.request.common.ShowMapMeasurementRequest
 *
 * Requests for the given value to be shown in UI.
 *
 * TODO: This could and propably should be refactored into a common show message
 * request since it could be used to show any message/this is actually not
 * measure tool specific.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */

Oskari.clazz.define('Oskari.mapframework.request.common.ShowMapMeasurementRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            value message to be shown
 */
function(value) {
    this._creator = null;
    this._value = value;
}, {
    /** @static @property __name request name */
    __name : "ShowMapMeasurementRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getValue
     * @return {String} value
     */
    getValue : function() {
        return this._value;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */Oskari.clazz.define('Oskari.mapframework.request.common.DrawPolygonRequest',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "DrawPolygonRequest",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
Oskari.clazz.define(
		'Oskari.mapframework.request.common.DrawSelectedPolygonRequest',
		function(polygon) {
			this._creator = null;
			this._polygon = polygon;
		}, {
			__name : "DrawSelectedPolygonRequest",
			getName : function() {
				return this.__name;
			},

			getPolygon : function() {
				return this._polygon;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
Oskari.clazz.define('Oskari.mapframework.request.common.SelectPolygonRequest',
		function(id, groupId) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
		}, {
			__name : "SelectPolygonRequest",
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
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
Oskari.clazz.define('Oskari.mapframework.request.common.RemovePolygonRequest',
		function(id, groupId, showPol) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
			this._showPol = showPol;
		}, {
			__name : "RemovePolygonRequest",
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
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
Oskari.clazz.define('Oskari.mapframework.request.common.ErasePolygonRequest',
		function(id) {
			this._creator = null;
			this._id = id;
		}, {
			getName : function() {
				return "ErasePolygonRequest";
			},

			getId : function() {
				return this._id;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */

