Oskari.clazz.define('Oskari.mapframework.event.common.AfterHideWizardEvent',
		function(wizardName) {
			this._creator = null;
			this._wizardName = wizardName;
		}, {
			__name : "AfterHideWizardEvent",
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

