# Parcel

<table>
  <tr>
    <td>ID</td><td>parcel</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.parcel.DrawingToolInstance.html)</td>
  </tr>
</table>

## Description

This bundle listens for events that provide feature ID (fid) for parcels or register units and loads the requested feature data. Features are shown on the map. Also, tools are provided to split the feature areas. Provides means to save feature data to server by using WFST. Also, uses ParcelInfo bundle to show area information.

## Screenshot

![screenshot](<%= docsurl %>images/parcel.png)

## Bundle configuration

This bundle requires configurations in application config.json.
For example:

```javascript
"parcel": {
  "conf": {
    "queryUrl": "https://ws.nls.fi/ktjkii/wfs/wfs",
    "parcelFeatureType": "PalstanTietoja",
    "registerUnitFeatureType": "RekisteriyksikonTietoja",
    "hideSomeToolbarButtons": "hide",
    "transactionUrl": "",
    "proxyUrl": "proxy.cgi?url="
  }
}
```

Above parameters are for:

* queryUrl - URL that is used for loading feature data
* parcelFeatureType - feature type that is used when parcels are requested for features
* registerUnitFeatureType - feature type that is used when register units are requested for features
* hideSomeToolbarButtons - hide means that hide some buttons of other bundles that may not be usefull for this bundel from toolbar. If this parameter is left out or 'false' it means that show all buttons of other bundles. For more specific implementation, see {Oskari.mapframework.bundle.parcel.handler.ButtonHandler} init -function.
* transactionUrl - URL that is used for WFST saving. If not defined, queryUrl is used for this.     Notice, if queryUrl and transactionUrl differ WFST uses INSERT, otherwise     UPDATE.
* proxyUrl - If set, OpenLayers uses this for proxy.

## Bundle state

An 'initRef'-parameter can be passed in the state, which will automatically do a search for the given parcel id.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Toolbar.AddToolButtonRequest</td><td>Adds tool buttons into toolbar for editing and saving.</td>
  </tr>
  <tr>
    <td>Toolbar.RemoveToolButtonRequest</td><td>If configuration has defined that some tool buttons, that are irrelevant for this bundle, should be hidden. Notice, this affects to buttons that other bundles may want to show.</td>
  </tr>
  <tr>
    <td>Toolbar.SelectToolButtonRequest</td><td>Ask toolbar to select specific button.</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>ParcelSelector.ParcelSelectedEvent</td><td>Starts loading parcel of the given fid.</td>
  </tr>
  <tr>
    <td>ParcelSelector.RegisterUnitSelectedEvent</td><td>Starts loading register unit of the given fid.</td>
  </tr>
  <tr>
    <td>Toolbar.ToolSelectedEvent</td><td>Selects editing tool or starts saving feature.</td>
  </tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Oskari.mapframework.bundle
      .parcel.event.ParcelInfoLayerRegisterEvent</td><td>Registers layer for ParcelInfo bundle that shows information about the selected or modified feature of the registered layer.</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.bundle
      .parcel.event.ParcelInfoLayerUnregisterEvent</td><td>Unregister registered layer from the ParcelInfo bundle.</td>
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
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> To control map</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html)</td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to map/gain control to Openlayers map</td>
  </tr>
</table>
