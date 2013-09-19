# Search

<table>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin.html)</td>
  </tr>
</table>

## Description

''Creates a search field for places in published maps.''


## Screenshot

## Bundle configuration

No configuration is required. Following is optional:

The styling and font of the plugin are configurable, with variables `toolStyle` (Object) and `font` (String), respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. Following styles are supported for the `toolStyle.val`: `rounded-light`, `rounded-dark`, `sharp-dark`, `sharp-light`, `3d-dark` and `3d-light`. Images for search field background are expected to be found in plugin's image resources directory for left, middle and right sides of the field: `search-tool-<toolStyle>_01.png`, `search-tool-<toolStyle>_02.png` and `search-tool-<toolStyle>_03.png`, respectively. Also, the widths of the images are expected to be defined in config object:

```javascript
{
  val: 'rounded-dark', // The id of the style.
  widthLeft: '17px',   // Width of the left side image.
  widthRight: '32px'   // Width of the right side image.
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>DisableMapKeyboardMovementRequest</td>
    <td>Disables the map movement when entering text to the search field.</td>
  </tr>
  <tr>
    <td>EnableMapKeyboardMovementRequest</td>
    <td>Enables the map movement when the search field blurs again.</td>
  </tr>
  <tr>
    <td>MapMoveRequest</td>
    <td>Moves the map to a location in the results table received from the search service.</td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI and to sort the layers</td>
  </tr>
  <tr>
    <td>[OpenLayers](http://openlayers.org/)</td>
    <td>not linked, assumes its linked by map</td>
    <td>Uses OpenLayers' popup</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.bundle.search.service.SearchService</td>
    <td>Expects to be present in application setup</td>
    <td>Sends the search request trough the service</td>
  </tr>
</table>

