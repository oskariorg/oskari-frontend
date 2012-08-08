Oskari.clazz.define('Oskari.mapframework.request.common.ShowWizardRequest',
		function(wizardName) {
			this._creator = null;
			this._wizardName = wizardName;
		}, {
			__name : "ShowWizardRequest",
			getName : function() {
				return this.__name;
			},

			getWizardName : function() {
				return this._wizardName;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
