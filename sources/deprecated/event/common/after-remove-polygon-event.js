Oskari.clazz.define('Oskari.mapframework.event.common.AfterRemovePolygonEvent',
		function(id, groupId, showPol) {
			this._creator = null;
			this._id = id;
			this._groupId = groupId;
			this._showPol = showPol;
		}, {
			__name : "AfterRemovePolygonEvent",
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
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

