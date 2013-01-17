# Layer Selector

|| Name || Karttatasot ||
|| ID || layerselector2 ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance link] ||

### Description
The bundle offers the user a listing for all the maplayers available in Oskari platform. The maplayers are grouped by topic or organization by selecting a tab in the upper part of the flyout. The user can filter maplayers by writing something in the input field. This helps the user to find the wanted layer from the long list. For each maplayer there is an icon presenting layer type (wms/wfs/base/wmts/vector)and an i-icon if the layer has a "dataurl" property. Pressing the I-icon sends out a request to show the page behind dataurl to the user. The user can add the maplayer to the map by checking the checkbox next to layername (or uncheck to remove it from map).

### TODO

* i-link handling
* handles wmts icon eventhough its not a core layer type

### Screenshot

[[Image(layerselector_jquery.png)]]


### Bundle configuration

No configuration is required. Assumes that MapLayerService has been initialized and can be fetched from sandbox.

Optional configuration to show published layers tab:
{{{
{
  "conf": {
    "showPublishedTab" : true
  }
}
}}}

### Bundle state

{{{
{
"state": {
"tab" : "Aiheittain",
"groups" : ["Energiavarat","Geologia"],
"filter" : ""
}
}
}}}

Where:
tab - the selected tab
groups - layers groups that are open
filter - the "search" text/text with what layers are filtered

If filter is given, open groups will be ignored. If filter is undefined, groups will be opened as stated in groups array.

### Requests the bundle handles

This bundle doesn't handle any requests.

### Requests the bundle sends out

|| Request || Where/why it's used ||
|| userinterface.AddExtensionRequest || Register as part of the UI in start()-method ||
|| userinterface.RemoveExtensionRequest || Unregister from the UI in stop()-method ||
|| AddMapLayerRequest || Sent out when user checks the layer checkbox ||
|| RemoveMapLayerRequest || Sent out when user unchecks the layer checkbox ||

### Events the bundle listens to

|| Event || How does the bundle react ||
|| AfterMapLayerRemoveEvent || Unchecks the checkbox on given layers UI container ||
|| MapLayerEvent || Updates the UI with data from MapLayerService - if operation is 'add' (adds the maplayer), 'remove' (removes the maplayer) or 'update' (updates layers name) ||

### Events the bundle sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
|| RightJS tooltips || [https://haisuli.nls.fi/portti2/trunk/js/Oskari/libraries/rightjs/javascripts/right/tooltips.js] || [http://rightjs.org/ui/tooltips/] || RightJS UI component for showing tooltips - used to show tooltips on layer icons ||
|| Oskari DivManager || [http://www.oskari.org/trac/wiki/DocumentationBundleDivManazer DivManazerBundle] ||   || Oskari's Div handler bundle ||
|| Backend functionality || N/A || [wiki:DocumentationBundleLayerSelectorBackend Backend API] || Get all Maplayers from backend ||
