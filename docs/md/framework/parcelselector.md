# Parcel Selector

<table>
  <tr>
    <td>ID</td><td>parcelselector</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance.html)</td>
  </tr>
</table>

## Description

This bundle shows Tile in UI to open Flyout that asks for a parcel FID that is used to send an event for another bundle. Then, another bundle may update the map with the requested feature.

## Screenshot

![screenshot](<%= docsurl %>images/parcelselector.png)

## Bundle configuration

No configuration is required.

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
    <td>userinterface.AddExtensionRequest</td><td>Register as part of the UI in start()-method.</td>
  </tr>
  <tr>
    <td>userinterface.RemoveExtensionRequest</td><td>Unregister from UI in stop()-method.</td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Oskari.mapframework.bundle
      .parcelselector.event.ParcelSelectedEvent</td><td>Inform listener that parcel with the given fid is requested by the user.</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.bundle
      .parcelselector.event.RegisterUnitSelectedEvent</td><td>Inform listener that register unit with the given fid is requested by the user.</td>
  </tr>
</table>

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
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality.</td>
  </tr>
</table>
