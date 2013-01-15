# WfsLayerPlugin

|| Bundle-Identifier || Found in bundle mapmodule ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin link] ||

## Description
WfsLayerPlugin does WFS-related queries, does featureinfo requests, draws image tiles and highlights features.

## Screenshot
[[Image(highlight.png)]]


### Bundle configuration

No configuration is required. 


### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

This plugin doesn't sends out any requests

## Events the bundle listens to

|| Event || How does the bundle react ||
|| EscPressedEvent || Closing GetInfo "popup" from screen. ||
|| MapClickedEvent || Send ajax request to backend system. ||
|| AfterMapMoveEvent || Cancel ajax request. ||


### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Version 1.7.1 assumed to be linked (on page locally in portal) || http://api.jquery.com/ || Used to create the UI ||
|| InfoBoxBundle || Oskari's InfoBoxBundle || [http://www.oskari.org/trac/wiki/DocumentationBundleInfobox InfoBoxBundle] || That handles the infobox as an Openlayers popup with customized UI||
|| Backend functionality || N/A || [wiki:DocumentationBundleMapModulePluginGetInfoPluginBackend Backend API] || Get info is handle in backend ||