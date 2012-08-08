Oskari.clazz.define(
		'Oskari.mapframework.request.common.NetServiceCenterRequest', function(
				actionKey, paramMap, selectedData) {
			this._creator = null;
			this._actionKey = actionKey;

			this._paramMap = paramMap;

			this._selectedData = selectedData;
		}, {
			__name : "NetServiceCenterRequest",
			getName : function() {
				return this.__name;
			},

			getActionKey : function() {
				return this._actionKey;
			},

			getParamMap : function() {
				return this._paramMap;
			},

			getSelectedData : function() {
				return this._selectedData;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
