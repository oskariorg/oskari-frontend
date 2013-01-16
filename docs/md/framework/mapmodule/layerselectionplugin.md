# Layer Selection Plugin

|| Bundle-Identifier || Found in bunlde mapmodule ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin link] ||

## Description
This plugin provides a maplayer selection "dropdown" on top of the map. 

## Screenshot

### Closed

[[Image(layerselection_closed.png, nolink)]]

### Open

[[Image(layerselection_open.png, nolink)]]

### Bundle configuration

{{{
{
   baseLayers : ['<layerid 1>','<layerid 2>','<layerid 3>'],
   defaultBase : '<layerid 1>'
}
}}}

Configuration is not required, but it can be used to set some selected layers as "base layers". Baselayers differ from normal layers that only one base layer is shown at a time.

### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

|| '''Request''' || '''Why/when''' ||
|| MapModulePlugin.MapLayerVisibilityRequest || Controls map layer selection by hiding map layers and making them visible on the map ||

### Events the plugin listens to

This plugin doesn't listen any events.

### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Version 1.7.1 assumed to be linked (on page locally in portal) || http://api.jquery.com/ || Used to create the UI ||