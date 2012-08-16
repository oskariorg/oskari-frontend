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

