# Info Box

<table>
  <tr>
    <td>ID</td><td>infobox</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance.html)</td>
  </tr>
</table>

## Description

Provides functionality for other bundles to show an infobox on the map. For example information about a search result. Defines a plugin for mapmodule that handles the infobox as an Openlayers popup with customized UI. Also extends jQuery by an outerHtml method. Templates are created with jQuery but Openlayers popup needs the actual HTML, this is where we need outerHtml.

## Screenshot

![screenshot](<%= docsurl %>images/infobox.png)

## Bundle configuration

No configuration is required, but it can be used to adapt infobox size according to its content. If not set, infobox size will be 300px x 400px.

```javascript
{
  "adaptable" : true
}
```

## Bundle state

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

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td> InfoBox.ShowInfoBoxRequest </td><td> Infobox is opened on given location and with given content based on request data</td>
  </tr>
  <tr>
    <td> InfoBox.HideInfoBoxRequest </td><td> Infobox is removed - single box if id is given or all if not specified</td>
  </tr>
  <tr>
    <td> InfoBox.RefreshInfoBoxRequest </td>
    <td> Currently supports one operation - `remove` which removes content from the infobox by the given content id. If no operation is given, sends an event to inform interested parties whether there's an infobox open with the given popup id.</td>
  </tr>
</table>

## Requests the bundle sends out

This bundle doesn't send out any requests.

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
    <td> Used to create the component UI from begin to end </td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> To control map and show an Openlayers popup on it</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html)</td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to map/gain control to Openlayers map</td>
  </tr>
</table>
