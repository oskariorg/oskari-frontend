# [bundle id]

[Tell here shortly what functionality does the bundle add. For example: Provides functionality for other bundles to show an infobox on the map.]

## Description

[More detailed/technical info about bundle. For example: Defines a plugin for mapmodule that handles the infobox as an Openlayers popup with customized UI. Also extends jQuery by an outerHtml method. Templates are created with jQuery but Openlayers popup needs the actual HTML, this is where we need outerHtml.]

## Screenshot

[Screenshot if possible]

## Bundle configuration

[Configuration and information which configurations are needed. For example:]

No configuration is required, but it can be used to adapt infobox size according to its content. If not set, infobox size will be 300px x 400px.

```javascript
{
  "adaptable" : true
}
```

## Bundle state

[Example:]
```javascript
state : {
  popups : [
    {
      id : <popup id>,
      title :  <popup title>,
      data :  <data as given in Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest.getContent()>,
      lonlat : <OpenLayers.LonLat as location for the popup>
    }
  ]
}
```

## Requests the bundle sends out

[Example:]
<table class="table">
<tr>
  <th> Request </th>
  <th> Where/why it's used</th>
</tr>
<tr>
  <td> `Publisher.PublishMapEditorRequest` </td>
  <td> When an embedded maps 'Edit' link is clicked to activate the publisher bundle </td>
</tr>
<tr>
  <td> `userinterface.UpdateExtensionRequest` </td>
  <td> When an embedded maps 'Edit' link is clicked to close the personaldata flyout </td>
</tr>
</table>

## Events the bundle listens to

[Example:]
<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Adds heatmap tool to layer</td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td>Removes layer from the map</td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerOpacityEvent </td><td>Changes map layer opacity</td>
  </tr>
</table>
