# IndexMap

|| Bundle-Identifier || indexmap ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin link] ||

## Description
This plugin adds an indexmap for the map it is registered to.

## Screenshot

### Closed

[[Image(indexmap_closed.png, nolink)]]

### Open

[[Image(indexmap_open.png, nolink)]]

### Bundle configuration

No configuration is required.

### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

This plugin doesn't sends any requests.

### Events the plugin listens to

|| Event || How does the bundle react ||
|| AfterMapMoveEvent || Updates ui to current map location ||

### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| OpenLayers || not linked, assumes its linked by map || see mapmodule || Uses OpenLayers.Control.OverviewMap to render the index map. || 