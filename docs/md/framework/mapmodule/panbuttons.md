# Pan Buttons

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.mapmodule.plugin.PanButtons.html)</td>
  </tr>
</table>

## Description

The plugin offers the user a move my by pan buttons

## TODO

* image url config (can be used by mapmodule image path [getImageUrl()])

## Screenshot

![screenshot](<%= docsurl %>images/panbuttons.png)

## Bundle configuration

No configuration is required. Following is optional:

The styling and font of the plugin are configurable, with variables `toolStyle` (String) and `font` (String), respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. Following values are supported for the `toolStyle`: `rounded-light`, `rounded-dark`, `sharp-dark`, `sharp-light`, `3d-dark` and `3d-light`. An image `panbutton-sprites-<toolStyle>.png` is expected to be found in plugin's image resources directory.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends any requests.

## Events the plugin listens to

This bundle doesn't listen to any events.

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
    <td> Used to create the UI</td>
  </tr>
</table>
