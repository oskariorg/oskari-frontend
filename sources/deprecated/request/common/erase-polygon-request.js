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

