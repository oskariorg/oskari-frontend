Oskari.clazz.define('Oskari.mapframework.request.common.RemovePolygonRequest',
		function(id, groupId, showPol) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
			this._showPol = showPol;
		}, {
			__name : "RemovePolygonRequest",
			getName : function() {
				return this.__name;
			},

			getId : function() {
				return this._id;
			},

			getGroupId : function() {
				return this._groupId;
			},

			getShowPol : function() {
				return this._showPol;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
