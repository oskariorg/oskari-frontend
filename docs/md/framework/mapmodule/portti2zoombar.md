# Portti2 Zoombar

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar)</td>
  </tr>
</table>

## Description

The plugin offers the user a zoom control for the map. Gets the initial zoom level from the map it is registered to when started.

## TODO

* Tooltips

## Screenshot

![screenshot](<%= docsurl %>images/zoombar.png)

## Bundle configuration

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

The styling and font of the plugin are configurable, with variables `toolStyle` (String) and `font` (String), respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. Following values are supported for the `toolStyle`: `rounded-light`, `rounded-dark`, `sharp-dark`, `sharp-light`, `3d-dark` and `3d-light`. Images `zoombar-<toolStyle>.png`, `zoombar-cursor-<toolStyle>.png`, `zoombar_minus-<toolStyle>.png` and `zoombar_minus-<toolStyle>.png` are expected to be found in plugin's image resources directory. Also, widths and heights should be configured in plugin's `this.toolSyles` object following the example:

```javascript
'rounded-dark' : {
    widthPlus: '22px',    // Width of the 'plus' image.
    widthMinus: '22px',   // Width of the 'minus' image.
    widthCenter: '22px',  // Width of the 'center' image.
    heightPlus: '38px',   // Height of the 'plus' image.
    heightMinus: '39px',  // Height of the 'minus' image.
    heightCenter: 12,     // Height of the 'center' image. NOTE! an integer.
    heightCursor: '18px', // Height of the 'cursor' image.
    widthCursor: '17px'   // Width of the 'cursor' image.
}
```

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends any requests.

## Events the plugin listens to

|| Event || How does the bundle react ||
|| AfterMapMoveEvent || Zoom to in or out \\ ||

## Events the plugin sends out

This bundle doesn't send any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked </td>
    <td> Used to create the UI</td></tr>
  <tr>
    <td> [RightJS slider](http://rightjs.org/ui/slider) </td>
    <td> https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/slider.js </td>
    <td> RightJS UI component for slider - used to show zoombar </td>
  </tr>
</table>
