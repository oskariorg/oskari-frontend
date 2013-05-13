Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.request.AddMarkerRequest', function(x, y, id, events, iconUrl) {
	this._creator = null;
	this._x = x;
	this._y = y;
	this._id = id;
	this._events = events;
	this._iconUrl = iconUrl;
}, {
	__name : "lupakartta.AddMarkerRequest",
	getName : function() {
		return this.__name;
	},
	getX : function() {
		return this._x;
	},
	getY : function() {
		return this._y;
	},
	getID : function() {
		return this._id;
	},
	getEvents : function() {
		return this._events;
	},
	getIconUrl : function() {
		return this._iconUrl;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */
