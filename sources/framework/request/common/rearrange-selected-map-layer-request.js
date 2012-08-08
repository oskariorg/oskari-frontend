Oskari.clazz.define(
		'Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest',
		function(mapLayerId, toPosition) {
			this._creator = null;

			this._mapLayerId = mapLayerId;

			this._toPosition = toPosition;
		}, {
			__name : "RearrangeSelectedMapLayerRequest",
			getName : function() {
				return this.__name;
			},

			getMapLayerId : function() {
				return this._mapLayerId;
			},

			getToPosition : function() {
				return this._toPosition;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
