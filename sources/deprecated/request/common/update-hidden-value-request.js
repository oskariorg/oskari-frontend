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
