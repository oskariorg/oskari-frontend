# Portti2 Zoombar

|| Name || Portti2Zoombar ||
|| ID || portti2zoombar ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar link] ||
|| Description || The plugin offers the user a zoom control for the map. Gets the initial zoom level from the map it is registered to when started. ||

### TODO

* Tooltips

### Screenshot
[[Image(zoombar.png)]]

### Bundle configuration

No configuration is required, but optionally location can be overridden by giving:

{{{
{
location : {
top : '10px',
left : '10px'
}
}
}}}

Bottom and right can also be used.

### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

This plugin doesn't sends any requests.



### Events the plugin listens to

|| Event || How does the bundle react ||
|| AfterMapMoveEvent || Zoom to in or out \\ ||

### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins) 

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
|| RightJS slider || [https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/slider.js] || [http://rightjs.org/ui/tooltips/] || RightJS UI component for slider - used to show zoombar || 