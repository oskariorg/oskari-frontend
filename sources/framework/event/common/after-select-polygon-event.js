Oskari.clazz.define('Oskari.mapframework.event.common.AfterSelectPolygonEvent',
		function(id, groupId) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
		}, {
			__name : "AfterSelectPolygonEvent",
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
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

