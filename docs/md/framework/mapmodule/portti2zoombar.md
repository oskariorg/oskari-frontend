# Portti2 Zoombar

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar)</td>
  </tr>
</table>

### Description

The plugin offers the user a zoom control for the map. Gets the initial zoom level from the map it is registered to when started.

### TODO

* Tooltips

### Screenshot

![screenshot](<%= docsurl %>images/zoombar.png)

### Bundle configuration

No configuration is required, but optionally location can be overridden by giving:

```javascript
{
  location : {
    top : '10px',
    left : '10px'
  }
}
```

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

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr><td> [jQuery](http://api.jquery.com/) </td><td> Version 1.7.1 assumed to be linked </td><td> Used to create the UI</td></tr>
  <tr><td> [RightJS slider](http://rightjs.org/ui/slider) </td><td> https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/slider.js </td><td> RightJS UI component for slider - used to show zoombar </td></tr>
</table>
