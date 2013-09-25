# Parcel Info

<table>
  <tr>
    <td>ID</td><td>parcelinfo</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance.html)</td>
  </tr>
</table>

## Description

This bundle shows the name, area, and length information about the selected feature of registered OpenLayers layers on the map.

## Screenshot

![screenshot](<%= docsurl %>images/parcelinfo.png)

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>ParcelInfo.ParcelLayerRegisterEvent</td><td>Starts to listen for OpenLayers featureselected, featureunselected, featuremodified, and vertexmodified events of the registered OpenLayers layer.</td>
  </tr>
  <tr>
    <td>ParcelInfo.ParcelLayerUnregisterEvent</td><td>Unregisteres the given OpenLayers layer from the list of the layers whose information is followed by the bundle.</td>
  </tr>
</table>

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
    <td> Used to create UI component</td>
  </tr>
</table>
