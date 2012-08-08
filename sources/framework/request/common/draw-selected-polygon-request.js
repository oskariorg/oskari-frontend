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
