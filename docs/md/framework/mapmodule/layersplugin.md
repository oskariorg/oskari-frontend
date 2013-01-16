# Layers Plugin

|| Name || LayersPlugin ||
|| ID || mapmodule.plugin/layers ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin link] ||
|| Description || This is a plugin to bring more functionality for the mapmodules map implementation. It provides handling for rearranging layer order and controlling layer visibility. Provides information to other bundles if a layer becomes visible/invisible (out of scale/out of content geometry) and request handlers to move map to location/scale based on layer content. Also optimizes openlayers maplayers visibility setting if it detects that content is not in the viewport. ||

### TODO

Has some handling for the markers layer. IMHO shouldn't.

### Bundle configuration 

No configuration is required.

### Bundle state 

No statehandling has been implemented for this.

### Requests the bundle handles 

|| Request || How does the bundle react ||
|| MapModulePlugin.MapLayerVisibilityRequest || Hides a maplayer or changes a hidden layer to visible. ||
|| MapModulePlugin.MapMoveByLayerContentRequest || Moves the map to a location and/or scale where the maplayer has content. (Maplayer geometry is visible in viewport/scale is in range for layer). ||

### Requests the bundle sends out 

This bundle doesn't send any requests.

### Events the bundle listens to 

|| Event || How does the bundle react ||
|| AfterRearrangeSelectedMapLayerEvent || Moves the Openlayers maplayers order to match the layer move spesified in the event, also handles markers layer that it would stay on top ||
|| MapMoveStartEvent || Stops internal timer scheduled to do a visibility check. ||
|| AfterMapMoveEvent || Schedules a visibility check to be done with a small delay (delay to improve performance on concurrent moves) ||
|| AfterMapLayerAddEvent || Checks if added layer has geometries. If not, checks if it has geometryWKT (well-known text) value. If WKT is available, parses it to fill in the geometry array. ||

### Events the bundle sends out 

|| Event || When it is triggered/what it tells other components ||
|| MapLayerVisibilityChangedEvent || Notifies other bundles if a layer has become visible/invisible telling if its out of scale or content area. ||


### Dependencies (e.g. jquery plugins) 

|| Dependecy || Linked from || API || Purpose ||
|| OpenLayers || not linked, assumes its linked by map || see mapmodule || Uses Openlayers to parse WKT geometry, detect if it matches to current maps viewport and to get the centerpoint for layers geometry. Also controls Openlayers to show/hide layers. || 