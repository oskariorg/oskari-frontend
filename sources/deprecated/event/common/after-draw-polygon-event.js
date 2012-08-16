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

