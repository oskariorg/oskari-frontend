Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent',
		function(mapLayer) {
			this._creator = null;

			this._mapLayer = mapLayer;
		}, {
			__name : "AfterChangeMapLayerStyleEvent",
			getName : function() {
				return this.__name;
			},

			getMapLayer : function() {
				return this._mapLayer;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

