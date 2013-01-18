# Layer Selector

<table>
  <tr>
    <td>Bundle-Identifier</td><td>layerselector2</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance)</td>
  </tr>
</table>

### Description

The bundle offers the user a listing for all the maplayers available in Oskari platform. The maplayers are grouped by topic or organization by selecting a tab in the upper part of the flyout. The user can filter maplayers by writing something in the input field. This helps the user to find the wanted layer from the long list. For each maplayer there is an icon presenting layer type (wms/wfs/base/wmts/vector)and an i-icon if the layer has a "dataurl" property. Pressing the I-icon sends out a request to show the page behind dataurl to the user. The user can add the maplayer to the map by checking the checkbox next to layername (or uncheck to remove it from map).

### TODO

* i-link handling
* handles wmts icon eventhough its not a core layer type

### Screenshot

![screenshot](<%= docsurl %>images/layerselector.png)

### Bundle configuration

No configuration is required. Assumes that MapLayerService has been initialized and can be fetched from sandbox.

Optional configuration to show published layers tab:

```javascript

{
  "conf": {
    "showPublishedTab" : true
  }
}
```

### Bundle state

```javascript

{
  "state": {
    "tab" : "Aiheittain",
    "groups" : ["Energiavarat","Geologia"],
    "filter" : ""
  }
}

```

Where:

* tab - the selected tab
* groups - layers groups that are open
* filter - the "search" text/text with what layers are filtered

If filter is given, open groups will be ignored. If filter is undefined, groups will be opened as stated in groups array.

### Requests the bundle handles

This bundle doesn't handle any requests.

### Requests the bundle sends out

<table>
<tbody><tr><td> Request </td><td> Where/why it's used
</td></tr><tr><td> userinterface.AddExtensionRequest </td><td> Register as part of the UI in start()-method
</td></tr><tr><td> userinterface.RemoveExtensionRequest </td><td> Unregister from the UI in stop()-method
</td></tr><tr><td> AddMapLayerRequest </td><td> Sent out when user checks the layer checkbox
</td></tr><tr><td> RemoveMapLayerRequest </td><td> Sent out when user unchecks the layer checkbox
</td></tr></tbody></table>

### Events the bundle listens to

<table>
<tbody><tr><td> Event </td><td> How does the bundle react
</td></tr><tr><td> AfterMapLayerRemoveEvent </td><td> Unchecks the checkbox on given layers UI container
</td></tr><tr><td> MapLayerEvent </td><td> Updates the UI with data from MapLayerService - if operation is 'add' (adds the maplayer), 'remove' (removes the maplayer) or 'update' (updates layers name)
</td></tr></tbody></table>

### Events the bundle sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

<table>
<tbody><tr><th> Dependency </th><th> Linked from </th><th> Purpose </th></tr>
<tr><td> [jQuery](http://api.jquery.com/) </td><td> Linked in portal theme </td><td> Used to create the component UI from begin to end
</td></tr><tr><td> [RightJS tooltips](http://rightjs.org/ui/tooltips/) </td><td> <a class="ext-link" href="https://haisuli.nls.fi/portti2/trunk/js/Oskari/libraries/rightjs/javascripts/right/tooltips.js"><span class="icon">​</span>https://haisuli.nls.fi/portti2/trunk/js/Oskari/libraries/rightjs/javascripts/right/tooltips.js</a> </td><td> RightJS UI component for showing tooltips - used to show tooltips on layer icons
</td></tr><tr><td> [Oskari DivManager](<%= docsurl %>framework/divmanazer.html) </td><td> Expects to be present in application setup </td><td> Oskari's Div handler bundle
</td></tr><tr><td> [Backend API](<%= docsurl %>backend/layerselector.html) </td><td> N/A </td><td> Get all Maplayers from backend
</td></tr></tbody></table>
