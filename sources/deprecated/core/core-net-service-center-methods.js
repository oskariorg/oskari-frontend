Oskari.clazz
		.category(
				'Oskari.mapframework.core.Core',
				'net-service-center-methods',{
					handleNetServiceCenterRequest : function(request) {

						this.printDebug("Handling NetServiceCenter request '"
								+ request.getActionKey() + "'...");
						var core = this;

						var onComplete = function(response) {
							var event = core.getEventBuilder('AfterNetServiceCenterRequestEvent')(
									request.getActionKey(), response, request
											.getSelectedData());
							core.copyObjectCreatorToFrom(event, request);
							core.dispatch(event);
						};

						var netServiceCenterService = this
								.getService('Oskari.mapframework.service.NetServiceCenterService');
						netServiceCenterService.doRequest(request
								.getActionKey(), request.getParamMap(),
								onComplete);
					},

					handleUpdateNetServiceCentreRequest : function(request) {
						var event = core.getEventBuilder('AfterUpdateNetServiceCentreEvent')();
						this.copyObjectCreatorToFrom(event, request);
						this.dispatch(event);
					}
				});