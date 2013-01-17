# Scalebar

|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin link]  ||
|| Description || The plugin adds a scale bar to the map it is registered to. ||

### Screenshot

[[Image(scalebar.png)]]

### Bundle configuration

No configuration is required.

### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

This plugin doesn't sends any requests.

### Events the plugin listens to

|| Event || How does the bundle react ||
|| AfterMapMoveEvent || Updates ui to current zoom level ||

### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| OpenLayers || not linked, assumes its linked by map || see mapmodule || Uses OpenLayers.Control.ScaleLine to render the scalebar. || 
