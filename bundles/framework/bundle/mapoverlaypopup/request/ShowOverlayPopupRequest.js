Oskari.clazz.define(
		'Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequest', function(
				autoLoadUrl, buttonsConf) {
			this._creator = null;
			this._autoLoadUrl = autoLoadUrl;
			this._buttonsConf = buttonsConf;
		}, {
			__name : "ShowOverlayPopupRequest",
			getName: function() {
			return this.__name;
			},
			
			getAutoLoadUrl : function() {
				return this._autoLoadUrl;
			},
			
			getButtonsConf : function() {
				return this._buttonsConf;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
