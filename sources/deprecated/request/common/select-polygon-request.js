Oskari.clazz.define('Oskari.mapframework.request.common.SelectPolygonRequest',
		function(id, groupId) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
		}, {
			__name : "SelectPolygonRequest",
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
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
