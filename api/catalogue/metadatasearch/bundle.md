# metadatasearch

Provides metadata catalogue search user-interface for an application.

## Description

The metadata search UI integrates on the generic search UI when `Search.AddTabRequest` is available or creates a new menu item/tile for metadata search when the search flyout is not available.

## Bundle configuration

No configuration is required, but allows configuration:

- `noUI` (optional boolean, default false)

Can be configured to true to prevent UI from rendering with intent on being used programmatically using the request/event API (for example on an embedded map with custom search UI).

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>`userinterface.AddExtensionRequest`</td><td>Extends the basic UI view.</td>
  </tr>
  <tr>
    <td>'Search.AddTabRequest'</td><td>Add metadata search tab to search bundle</td>
  </tr>
  <tr>
    <td>'catalogue.ShowMetadataRequest'</td><td>layer metadata info request</td>
  </tr>
  <tr>
    <td>'MapModulePlugin.MapLayerVisibilityRequest'</td>Sends out when user clicks the 'Show/Hide' link on a search results<td></td>
  </tr>
  <tr>
    <td>'RemoveMapLayerRequest'</td><td>Sends out when user clicks the 'Hide' link on a search results</td>
  </tr>
  <tr>
    <td>'AddMapLayerRequest'</td><td>Sends out when user clicks the 'Show' link on a search results</td>
  </tr>
  <tr>
    <td>'userinterface.RemoveExtensionRequest'</td><td>Unregister from UI in stop()-method</td>
  </tr>
  <tr>
    <td>'DrawTools.StartDrawingRequest'</td><td>Sends out when user clicks 'Show data coverage' link on a search results to draw a rectangle.</td>
  </tr>
  <tr>
    <td>'DrawTools.StopDrawingRequest'</td><td>Sends out when user stops data coverage rectangle drawing.</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> MetadataSearchResultEvent</td><td> Show metadata search results</td>
  </tr>
</table>

## Events the bundle sends out

<table class="table">
  <tr>
    <th> Event </th><th>Why/when</th>
  </tr>
  <tr>
    <td> MetadataSearchResultEvent </td><td> Notifies that a metadata search has been performed and the result is accessible through the event </td>
  </tr>
</table>
