Oskari.clazz
		.category('Oskari.mapframework.core.Core',
				'mapasker-methods',{					
				    handleShowNetServiceCentreRequest : function(request) {
						var event = this.getEventBuilder('AfterShowNetServiceCentreEvent')();
						this.dispatch(event);
					},

					handleHideNetServiceCentreRequest : function(request) {
						var event = this.getEventBuilder('AfterHideNetServiceCentreEvent')();
						this.dispatch(event);
					}
				});