# Layer Selection

|| Bundle-Identifier || layerselection2 ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance link] ||

## Description
The bundle presents listing for currently selected maplayers. For each maplayer the user can change the opacity, hide/show the maplayer and remove it from map. If a maplayer is not visible in current map scale/location, the user sees a message about it and a link to move the map to location where there is content on the maplayer. If the layer can be published the layer has a text telling the user about it. The user can change the order of maplayers by dragging them into different order. Layer styles can be selected from a dropdown where applicable.

### TODO

* handles wmts icon eventhough its not a core layer type

### Screenshot

[[Image(layerselection2.2.png)]]

### Bundle configuration

No configuration is required.

### Bundle state

This bundle doesn't have state information since it reflects the state of the map which is controlled elsewhere.

### Requests the bundle handles

This bundle doesn't handle any requests.

### Requests the bundle sends out

|| Request || Where/why it's used ||
|| userinterface.AddExtensionRequest || Register as part of the UI in start()-method ||
|| userinterface.RemoveExtensionRequest || Unregister from the UI in stop()-method ||
|| ChangeMapLayerOpacityRequest || Sends out when user changes the opacity for a layer ||
|| MapModulePlugin.MapLayerVisibilityRequest || Sends out when user clicks the 'Show/Hide' link on a layer ||
|| MapModulePlugin.MapMoveByLayerContentRequest || Sends out when user clicks the 'Zoom/Move map to scale/content' link ||
|| RearrangeSelectedMapLayerRequest || Sends out when user changes the order of layers in the list ||
|| RemoveMapLayerRequest || Sends out when user clicks the 'remove map layer' button ||
|| ChangeMapLayerStyleRequest || Sent when a layer style is selected from the dropdown.\\ ||
|| catalogue.ShowMetadataRequest || Sent when the the info icon is clicked.\\ ||

### Events the bundle listens to

|| Event || How does the bundle react ||
|| AfterMapLayerAddEvent || Adds the layer to the UI listing ||
|| AfterMapLayerRemoveEvent || Removes the layer from the UI listing ||
|| MapLayerEvent || Only listens to 'update' operation and updates the name of the layer in UI ||
|| MapLayerVisibilityChangedEvent || Changes the UI for the layer (shows out-of-scale message/tools if in-scale etc) ||
|| AfterChangeMapLayerOpacityEvent || Changes the UI for the layer if event creator isn't this bundle. Opacity controls are set to match the data in Oskari when some external component changes layer opacity. (e.g. statehandler) ||
|| AfterChangeMapLayerStyleEvent || Changes the UI for the layer if event creator isn't this bundle. Style drowdown is set to match the data in Oskari when some external component changes layer style. (e.g. statehandler) ||

### Events the bundle sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
|| RightJS slider || [https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/slider.js] || [http://rightjs.org/ui/slider] || RightJS UI component for slider - used for layer opacity control ||
|| RightJS sortable || [https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/sortable.js] || [http://rightjs.org/ui/sortable] || RightJS UI component for sortable list - used for drag&drop on layer order ||
|| RightJS tooltips || [https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/tooltips.js] || [http://rightjs.org/ui/tooltips/] || RightJS UI component for showing tooltips - used to show tooltips on layer icons || 
|| Oskari DivManager || Expects to be present in application setup ||  [wiki:DocumentationBundleDivManazer DivManazerBundle] || Needed for flyout/tile functionality ||
