Oskari.clazz.category('Oskari.mapframework.core.Core',
				'wizard-methods',{
	handleHideWizardRequest : function(request) {
		var event = this.getEventBuilder('AfterHideWizardEvent')(request
				.getWizardName());
		this.dispatch(event);
	},

	handleShowWizardRequest : function(request) {
		var event = this.getEventBuilder('AfterShowWizardEvent')(request
				.getWizardName());
		this.dispatch(event);
	}
});