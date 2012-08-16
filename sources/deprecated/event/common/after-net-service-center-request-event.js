Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterNetServiceCenterRequestEvent',
		function(actionKey, response, selectedData) {
			this._creator = null;
			this._actionKey = actionKey;

			this._response = response;

			this._selectedData = selectedData;
		}, {
			__name : "AfterNetServiceCenterRequestEvent",
			getName : function() {
				return this.__name;
			},

			getActionKey : function() {
				return this._actionKey;
			},

			getResponse : function() {
				return this._response;
			},

			getSelectedData : function() {
				return this._selectedData;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

