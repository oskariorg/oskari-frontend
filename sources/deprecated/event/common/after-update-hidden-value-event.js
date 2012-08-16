Oskari.clazz.define(
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

