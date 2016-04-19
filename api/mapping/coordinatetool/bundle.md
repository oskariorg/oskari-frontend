# coordinatetool

## Description

This bundle provides a plugin (Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin) for mapmodule that can:
* shows coordinates on mouse location
* shows coordinates on mouse map click
* center map to given coordinates


## Screenshot

![screenshot](coordinatetool.png)


## Bundle configuration

No configuration is required, but there is few possible configurations:

- Setting roundToDecimals to wanted number will coordinates rounded by wanted decimal plates. 

```javascript
{
  "roundToDecimals" : 2
}
```

- Option to configure coordinatetool to show reverse geocode for the current position
  ( bundle config in the view in portti_view_bundle_seq table)

````
{
    "isReverseGeocode" : true,
    "reverseGeocodingIds" : "WHAT3WORDS_CHANNEL"
}
````
    
- Option to configure XY reference system changing functions  (CRS code and view uuid,..)

````    
{"supportedProjections":{"EPSG:3035":"482333d1-f0d0-4410-aa65-60db4e45b853","EPSG:3857":"1d65e6cc-4ac7-4dab-8a94-76b3dd632307"}}
````
## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>`MapMoveRequest`</td><td> Move map to selected coordinates.</td>
  </tr>
</table>


## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`MouseHoverEvent`</td><td>Updates the coordinates gotten from event to the UI.</td>
  </tr>
  <tr>
    <td>`AfterMapMoveEvent`</td><td>Updates the updated coordinates for map center.</td>
  </tr>
  <tr>
    <td>`MapClickedEvent`</td><td>Updates the coordinates gotten from event to the UI.</td>
  </tr>
  <tr>
    <td>`Publisher.ColourSchemeChangedEvent`</td><td>Updates the UI colour schema from event.</td>
  </tr>
  <tr>
    <td>`Publisher2.ColourSchemeChangedEvent`</td><td>Updates the UI colour schema from event.</td>
  </tr>

</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td>
    <td>Assumes to be linked in the page</td>
    <td>Used to create the component UI from begin to end</td>
  </tr>
</table>
