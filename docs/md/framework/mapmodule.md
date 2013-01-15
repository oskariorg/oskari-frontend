# Map module

|| Name || Map Module ||
|| ID || mapPublisher || 
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.ui.module.common.MapModule link]

## Description
Provides abstraction for map implementation (Openlayers) and provides a plugin mechanism to add additional functionality to map.

## TODO

- Configurable zoomlevels
- Configurable coordinate system/projection code


### Bundle configuration

No configuration is required.

### Bundle state

No statehandling has been implemented.

### Requests the bundle handles

|| Request || Where/why it's used ||
|| MapModulePlugin.MapLayerUpdateRequest || Forces openlayers update the layers of tiles ||
|| MapMoveRequest || Moving map position ||
|| ClearHistoryRequest || Clearing Openlayers history(not used yet, the history handling are yet in statehandler) ||

* Plugins might handle additional requests

### Requests the bundle sends out

This bundle doesn't send out any requests

* Plugins might send additional requests

### Events the bundle listens to

|| Event || How does the bundle react ||
|| SearchClearedEvent|| Removing all markers from map ||

* Plugins might listen to additional events

### Events the bundle sends out

|| Event || ||
|| MapMoveStartEvent || When draging start ||
|| AfterMapMoveEvent|| After map has moved ||

* Plugins might send additional events

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| OpenLayers || Expects OpenLayers already linked || http://openlayers.org/ || Used for all map functionality ||


## Map module plugins

* [wiki:DocumentationBundleCoordinateDisplay CoordinateDisplay]
* [wiki:DocumentationBundleMapModulePluginScaleBar MapModule-Plugin ScaleBar]
* [wiki:DocumentationBundleMapModulePluginPanButtons MapModule-Plugin PanButtons]
* [wiki:DocumentationBundleMapModulePluginPorttiZoombar MapModule-Plugin PorttiZoombar]
* [wiki:DocumentationBundleMapModulePluginLayersPlugin MapModule-Plugin LayersPlugin]
* [wiki:DocumentationBundleMapModulePluginIndexMap MapModule-Plugin IndexMap]
* [wiki:DocumentationBundleMapModulePluginLayerSelectionPlugin MapModule-Plugin LayerSelectionPlugin]
* [wiki:DocumentationBundleMapModulePluginGetInfoPlugin MapModule-Plugin GetInfoPlugin]
* [wiki:DocumentationBundleMapModulePluginWfsLayerPlugin Mapmodule-Plugin WfsLayerPlugin]
* [wiki:DocumentationBundleMapModulePluginGeoLocationPlugin Mapmodule-Plugin GeoLocationPlugin]
* [wiki:DocumentationBundleMapModulePluginMarkersPlugin Mapmodule-Plugin MarkersPlugin]
* [wiki:DocumentationBundleMapModulePluginControlsPlugin Mapmodule-Plugin ControlsPlugin]

