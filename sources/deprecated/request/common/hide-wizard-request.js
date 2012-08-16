Oskari.clazz.define('Oskari.mapframework.request.common.HideWizardRequest',
		function(wizardName) {
			this._creator = null;
			this._wizardName = wizardName;
		}, {
			__name : "HideWizardRequest",
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
