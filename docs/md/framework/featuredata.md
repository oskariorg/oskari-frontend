# Feature Data

|| Name || Featuredata ||
|| ID || featuredata ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance link] ||
|| Description || The Bundle provides a grid view for WFS featuredata. It is responsible to getting the data from the server, parsing it and showing it. ||

### TODO

- filtering features
- multiple tabs handling when they dont fit the screen
- userguide popup handling

### Screenshot

[[featuredata.png]]

### Bundle configuration

No configuration is required.

### Bundle state

No statehandling has been implemented.

### Requests the bundle handles

This bundle doesn't handle any requests.

### Requests the bundle sends out

|| Request || Where/why it's used ||
|| userinterface.AddExtensionRequest || Register as part of the UI in start()-method ||
|| userinterface.RemoveExtensionRequest || Unregister from the UI in stop()-method ||
|| HighlightMapLayerRequest || Requests that a layer is "highlighted" (old mechanic) so highlighting and feature selection will occur using this layer. Sent when a tab is selected (tab presents one layers data) ||
|| DimMapLayerRequest || Requests that highlighting is removed from a layer (old mechanic) so highlighting and feature selection will be disabled on this layer. Sent when a tab is unselected/removed (tab presents one layers data). ||
|| userguide.ShowUserGuideRequest || Used to show additional data that wouldn't fit the normal grid. A link is shown instead on grid and clicking the link will open the additional data on user guide "popup". ||


### Events the bundle listens to

|| Event || How does the bundle react ||
|| AfterMapLayerAddEvent || A tab panel is added to the flyout for the added layer. ||
|| AfterMapLayerRemoveEvent || Tab panel presenting the layer is removed from the flyout. ||
|| AfterMapMoveEvent || Grid data is updated if the flyout is open. Data is only updated for the layer whose tab is currently selected. ||
|| WFSFeaturesSelectedEvent || Highlights the feature on the grid. ||
|| userinterface.ExtensionUpdatedEvent || Determines if the layer was closed or opened and enables/disables data updates accordingly. ||

### Events the bundle sends out

|| Event || When it is triggered/what it tells other components ||
|| WFSFeaturesSelectedEvent || Sent when a selection is made on the grid to notify other components that a feature has been selected ||

### Dependencies (e.g. jquery plugins)

|| Dependecy || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end || 
|| Backend functionality || N/A || [wiki:DocumentationBundleFeatureDataBackend Backend API] || Feature data provider ||