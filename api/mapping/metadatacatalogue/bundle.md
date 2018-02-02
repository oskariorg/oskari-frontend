# metadatacatalogue

## Description

Bundle provides metadata catalogue search functionality for the map.

## Bundle configuration

No configuration is required, but there is two possible configurations:

```javascript
{
  "hideMetadataXMLLink" : true,
  "hideMetaDataPrintLink": true
}
```

Setting hideMetadataXMLLink to true will hide metadata XML link (ISO 19139 XML -file).

Setting hideMetaDataPrintLink to true will hide print link.

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

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the UI</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](/documentation/bundles/framework/divmanazer)</td>
    <td> Expects to be present in the application setup </td>
    <td> For Tile/Flyout and other UI components</td>
  </tr>
</table>