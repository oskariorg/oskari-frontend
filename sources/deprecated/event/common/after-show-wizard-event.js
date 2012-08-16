Oskari.clazz.define('Oskari.mapframework.event.common.AfterShowWizardEvent',
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
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

