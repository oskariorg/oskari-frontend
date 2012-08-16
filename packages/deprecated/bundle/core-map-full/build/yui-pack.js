/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.core.Core
 *
 * Search requests handling
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'search-methods', {
/**
 * @method handleSearchRequest
 * return value is gotten requests callback methods
 * @param {Oskari.mapframework.request.common.SearchRequest}
 *            searchRequest search request
 */
    handleSearchRequest : function(searchRequest) {
        this.printDebug("Doing search '" + searchRequest.getSearchString() + "'...");
        this.actionInProgressSearch();
        var searchService = this.getService('Oskari.mapframework.service.SearchService');
        searchService.doSearch(searchRequest.getSearchString(), searchRequest.getOnSuccess(), searchRequest.getOnComplete());
    }
});
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
});Oskari.clazz
		.category('Oskari.mapframework.core.Core',
				'mapasker-methods',{					handleShowNetServiceCentreRequest : function(request) {
						var event = this.getEventBuilder('AfterShowNetServiceCentreEvent')();
						this.dispatch(event);
					},

					handleHideNetServiceCentreRequest : function(request) {
						var event = this.getEventBuilder('AfterHideNetServiceCentreEvent')();
						this.dispatch(event);
					},

					handleHighlightWFSFeatureRequest : function(request) {
					    
					    var ogcSearchService = this.getService('Oskari.mapframework.service.OgcSearchService');		
					    ogcSearchService.scheduleWFSMapHighlightUpdate(request);
								
					},
					handleHighlightWFSFeatureRequestByGeoPoint : function(
							request) { 
								
						if (!this.getSandbox().getMap().isMoving()) {
							var core = this;
							
							var mapWidth = core.getSandbox().getMap().getWidth();
							var mapHeight = core.getSandbox().getMap().getHeight();
							
							var parameters = request.getWFSFeatureParameters();
							var ogcSearchService = this
									.getService('Oskari.mapframework.service.OgcSearchService');
							
							
							/*
							 * This case highlighted layer is the first one at
							 * there should not be more than one selected
							 */
							var highlighted = this.getAllHighlightedMapLayers();
							/* Safety check */
							if (highlighted.length != 1) {
								throw "Trying to highlight WFS feature but there is either too many or none selected WFS layers. Size: "
										+ highlighted.length;
							}
							var layer = highlighted[0];
							/* Safety check */
							if (!layer.isLayerOfType('WFS')) {
								throw "Trying to highlight WFS feature from map layer that is not WFS layer!";
							}
							/* Safety check at layer is in scale */
							if (!layer.isInScale()) {
								core.printDebug('Trying to hightlight WFS feature from wfs layer that is not in scale!');
								return;
							}
							var keepCollection = this.isCtrlKeyDown();

							/** Highlight selected features from table */
							var onReady = function(response) {
								if (response.error == "true") {
									core.printWarn("Error while highlight data from table.");
								}

								var selectedFeatures = eval("("
										+ response.selectedFeatures + ")");
								var featureIds = [];
								if (selectedFeatures != null
										&& selectedFeatures.id != null) {
									featureIds = selectedFeatures.id;
								}

								var event = core.getEventBuilder('AfterHighlightWFSFeatureRowEvent')(
										featureIds, true, layer, keepCollection);
								core.copyObjectCreatorToFrom(event, request);
								core.dispatch(event);
							};
							ogcSearchService
									.processGetFeatureTypeIdsJsonForTableFormat(
											parameters, onReady, mapWidth,
											mapHeight);
						} 
					},
					getLatestWfsTableQueryId : function() {
						return this._wfsTableQueryId;
					},

					generateWfsTableQueryId : function() {
						this._wfsTableQueryId++;
						return this._wfsTableQueryId;
					}
				});Oskari.clazz
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