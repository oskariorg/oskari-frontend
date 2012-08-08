Oskari.clazz
		.category('Oskari.mapframework.core.Core',
				'status-methods',{	handleActionReadyRequest : function(request) {
		var id = request.getId();
		this._ongoingActions[id] = null;
		this.notifyModulesThatActionsHaveChanged(request);

		/* If this is a WFS PNG end request decrease counter */
		if (request.isWfsPngAction()) {
			this._currentlyFetchingWfsTiles--;
		}
	},

	handleActionStartRequest : function(request) {
		var id = request.getId();
		this._ongoingActions[id] = request.getActionDescription();
		this.notifyModulesThatActionsHaveChanged(request);

		/* If this is a WFS PNG start request increase counter */
		if (request.isWfsPngAction()) {
			this._currentlyFetchingWfsTiles++;
		}
	},

	notifyModulesThatActionsHaveChanged : function(request) {
		var currentlyRunningActionsDescriptions = {};
		for ( var key in this._ongoingActions) {
			var value = this._ongoingActions[key];
			if (value != null) {
				currentlyRunningActionsDescriptions[value] = value;
			}
		}

		/* Only show texts once */
		var texts = new Array();
		for ( var s in currentlyRunningActionsDescriptions) {
			if (s != null && s != undefined) {
				texts.push(s);
			}
		}

		var event = this.getEventBuilder('ActionStatusesChangedEvent')(
				texts);
		this.copyObjectCreatorToFrom(event, request);
		this.dispatch(event);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressWfsGrid : function() {
		var text = this.getText("status_wfs_update_grid");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"WFS_GRID", text, false);
		this.handleActionStartRequest(request);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressSearch : function() {
		var text = this.getText("status_search");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"SEARCH", text, false);
		this.handleActionStartRequest(request);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressGetFeatureInfo : function() {
		var text = this.getText("status_get_feature_info");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"GET_FEATURE_INFO", text, false);
		this.handleActionStartRequest(request);
	}
});