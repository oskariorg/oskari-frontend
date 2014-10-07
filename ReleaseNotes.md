# Release Notes

## 1.24

### bundles/bundle.js

A bit of a rewrite, if your code touches bundle.js internals, it might break.

* added documentation
* added type checks to arguments
* backported cleaned up version from O2
* dead code elimination
* linted
* marked private functions
* reordered functions
* sensible/descriptive naming

### divmanazer

Added a bunch of form component classes:
* Component
* Container
* EmailInput
* FormComponent
* LanguageSelect
* MultiLevelSelect
* NumberInput
* PasswordInput
* RadioButtonGroup
* SearchForm
* SearchInput
* Select
* TextAreaInput
* TextInput
* UrlInput

Extended some of the old component classes from new 'abstract' classes for code reuse.
Hopefully this won't break anything, but if something related to Button, Form, FormInput or the likes fails, this is thew likely cause.

### integration/admin-layerselector

Added username and password support to the layer admin flyout.

Adding/editing/removing sublayers now updates UI correctly.

### mapwfs2/WfsLayerPlugin

Now treats port configuration as number correctly.

###  featuredata2/MapSelectionPlugin

Disabled rotation of rectangular selection.

### myplacesimport

Updated flyout for GPX and MIF/MID format import, which was implemented in the oskari-server backend.

Now disables button for guest users.

### OpenLayers

Patched Oskari's OpenLayers 2 to make My Places work in IE 11. See https://github.com/bartvde/openlayers/commit/821975c1f500e26c6663584356db5d65b57f70d9

Openlayers full-map.js changed so that text selection is possible also when the map is moved or zoomed. See https://github.com/nls-oskari/oskari/commit/9bfa97541c67

## 1.23

### mapmodule/LogoPlugin

The default logo image has been changed

### statistics / StatsGrid

Statsgrid is refactored to use stats instead of sotka. All filenames and classes named sotka are now renamed as stats.

NOTE! StatsGrid.SotkadataChangedEvent has changed to StatsGrid.StatsDataChangedEvent.
getSotkaIndicators has been renamed as getStatsIndicators.
getSotkaRegionData has been renamed as getStatsRegionData.
getSotkaIndicators has been renamed as getStatsIndicators.
getSotkaIndicatorMeta has been renamed as getStatsIndicatorMeta.
getSotkaIndicatorData has been renamed as getStatsIndicatorData.
getSotkaIndicatorsMeta has been renamed as getStatsIndicatorsMeta.
getSotkaIndicatorsData has been renamed as getStatsIndicatorsData.

### divmanazer / DefaultExtension

An injected empty conf no longer overwrites the basic functionality (default tile/flyout setting). getConfiguration() function should be preferred over referencing conf-property directly to ensure there's no issues with the config.

DefaultTile now has methods setEnabled(bln) and isEnabled() for disabling/enabling the tile.

### arcgis / ArcGisLayer

Layers of type arcgis now respect layer order properly. 

NOTE! The layertype in JSON/domain has changed from 'arcgislayer' to 'arcgis'

### core / MapLayerService

Now has a function hasSupportForLayerType(type) which can be used to check if given layer type is supported by the plugins loaded in particular setup.

### admin-layerselector bundle

It is now possible to add/edit/delete inspire themes. 

Uses PUT/DELETE HTTP methods for insert/delete with fallback to POST and 'X-HTTP-Method-Override' header if server responds with 'Method not allowed'.

Refactored layertype support validation. 

Added initial support for ArcGIS layertype.

### divmanazer/Grid

Implemented expandable/collapsible subtables. Improved export permission handling.

### divmanazer/Popup

Implemented popup.onClose(callback) which can be used to register listeners that will be called when the popup closes. Note that listeners aren't removed on close 
and need to be manually cleared using popup.clearListeners() if reusing the component reference in another context.

### mapmodule/ControlsPlugin - touch controls

Major changes in mouse/touch controls handling. PorttiMouse has been removed and OskariNavigation is now used in it's place. 
OskariNavigation extends OpenLayers.Control.Navigation and hooks Oskari events to appropriate places. It also uses an extended version
of OpenLayer.Control.PinchZoom (OskariPinchZoom) which hooks Oskari event to pinchDone.

Also changed hasUI to return true so ControlsPlugin works correctly with publisher-bundle.

### mapmyplaces/MyPlacesLayerPlugin

Labels and clustering of My places points are now produced by GeoServer instead of frontend JavaScript. In addition to
increased stability and efficiency, they are now available also in printouts and published maps. MyPlacesLayerPlugin is
currently deprecated.

### search

More special characters are allowed by default. Strict filter can be enabled through config.

### userguide

The code is cleaned so that all the unnecessary parts have been removed.

NOTE! UserGuideService.js no longer exists

## 1.22

### integration/admin-layerselector

Now has initial support for WMTS layers.

### core/MapLayerService

Now parses generic layerName and url properties from layerJSON to AbstractLayers setLayerName() and setLayerUrls() methods.

### analysis/analyse

Added an option to select the measurement unit (meters or kilometers) for buffer size.

### divmanazer/Grid

Implemented front-end based CSV export and some UI polishing.

## 1.21

### core/sandbox/Layers

`sandbox.getRequestBuilder('RequestName')` now returns `undefined` if either request or request handler is missing. Previously only returned `undefined` if request was missing. This solves some timing issues with minified code.

AbstractLayer now has set/getLayerName() as it's a common field for most layers. LayerName is functional configurations while name is for UI.

WmsLayer now forwards calls for wmsUrl/wmsName methods to AbstractLayers layerUrl/layerName methods. The API remains the same and urls can be accessed with both ways. 
WmtsLayer does the same for wmtsUrl/wmtsName.

### MaplayerService

Now returns null if trying to create unrecognized layer type instead of throwing an error. Also logs a mention in console if this happens.

### admin-layerselector

Previously didn't startup correctly with small number of layer (under 30), this has now been fixed.

### search

The default UI for search can now be disabled through config:

```javascript
{
    "disableDefault": true
}
```

### mapmodule-plugin/MarkersPlugin

New marker functionality:

Dynamic point symbol visualizations are now available also for markers. They can be created by url parameters or set on the map by the user.

Marker handling is removed from map-module.js. Instead, new markers can be added via requests as follows:

```javascript
var reqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: lonlat.lon,
        y: lonlat.lat,
        msg: null,
        color: "ff0000",
        shape: 3,
        size: 3
    };
    var request = reqBuilder(data);
    this.sandbox.request(this.getName(), request);
}
```

### elf-language-selector

Opens the language selector in a Flyout

### elf-geolocator

*New bundle!* Creates a service and a user interface for ELF Geolocator search API. Creates an UI for search bundle to perform text searches and adds a button to the toolbar for reverse geocode search.

### analysis/analyse

Existing WFS area and line features can now be cut with a new geometry editor bundle and used as analysis source features.

The drawing of a new feature as well as editing one has been moved to a new accordion panel.

### statistics/statsgrid

The toolbar from the top has been removed and the tool added to the side toolbar when going to stats mode.

Data source select has been added (only two options now - SOTKAnet and user indicators).

### /Oskari/bundles/mapframework/bundle/mapwfs2/plugin/WFSLayerPlugin

New optional plugin config setting to defer setLocation calls from AfterMapMoveEvent to MapLayerVisibilityChangedEvent
to drop some WFS queries to backend servers.


```javascript
{
   "id": "Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin",
   "config": {
      "deferSetLocation" : true
   }
}
```

### divmanazer

Added a new function `getHeader` to `component/AccordionPanel.js`

## 1.20

### analysis/analyse

Analysis source features can now be drawn on the map directly from within the analyse view and from place search results.

Layers can now be removed from analysis and from the map by clicking the close icon in the layers listing.

For layers which have over the maximum amount of feature properties permitted (defaults to 10) the 'select all properties' selection is now disabled, 'choose from the list' option autoselected and the first properties selected.

### search

Other bundles can now insert (and remove) actions to search results via `Search.AddSearchResultActionRequest` (removing via `Search.RemoveSearchResultActionRequest`):

```javascript
var reqBuilder = sandbox
        .getRequestBuilder('Search.AddSearchResultActionRequest'),
    callback = function(searchResult) {
        // This is called in search bundle with the search result
        return function() {
            // This is what gets called when the link gets clicked
            alert(searchResult.name);
        };
    },
    request;

if (reqBuilder) {
    request = reqBuilder('Link name', callback);
    sandbox.request(this, request);
}
```

### publisher

Added draw layer selection.
Improved published view editing state handling.

### admin-layerselector bundle

Removed underscore from comp.js

### backendstatus

Sends a new event - `BackendStatus.BackendStatusChangedEvent` instead of `MapLayerEvent` now. Also, if the amount of changed layers exceeds 100 a so called bulk update event is sent instead of single events for each changed layer. It's basically the same event without any params.

### mapmodule-plugin

Now has getState/getStateParameters/setState-functions and forwards calls to these methods to any registered plugins that have the same methods. GetState gathers and object with properties named after plugins and setState assumes to get the same kind of Object as parameter.

## 1.19.3

### statsgrid

Unbinding click button before assigning a new click listener so bindings don't accumulate

## 1.19.2

Removed random console.log() commands for Internet Explorer to work correctly

## 1.19.1

### myplaces2

Fixed an issue where missing image url prevented edit myplace form from opening

## 1.19

### mapwmts

Fixed support for WMTS layers without resource URLs.

### Documentation

Docs has been removed from oskari-repository and they are now available in http://www.oskari.org/documentation and https://github.com/nls-oskari/oskari.org/tree/master/md/documentation along with backend documentation

### localization

Added italian translations for analyse and metadataflyout bundles (thanks rockini)

### divmanazer/ui-components

Overlay now supports element selector that spans over multiple DOM elements (thanks uhef)

### *new bundle* myplacesimport

Adds functionality to import users' own data zipped in ESRI shape file set or Google kml(kmz) file. Also added is a complementary bundle `mapuserlayers` which is responsible for showing the user layers on the map.

### mapwfs2

No longer waits for an WMSGetFeatureInfo request to complete when sending map click features. Instead immediately sends a `GetInfoResultEvent` with the received data.

### infobox

Made adaptable to add more content to an open popup. Basically if it receives a request to show a popup with the same id and location as an open one, just adds/modifies the content of said popup.

### mapmodule-plugin/getinfo

Is the single point of contact with the infobox now. Handles adding/removing map layers and modifies the infobox popup accordingly. Bundles who want feature info shown on a info popup should send a `GetInfoResultEvent` with the data they want to show.

### mapmodule-plugin/realtimePlugin

Added a new plugin for managing layers which have been cofigured as real time layers. The plugin refreshes the layers periodically, with a refresh rate specified for each layer separately. See the docs for more info.

### mapmodule-plugin/map-module.js

Extends src/mapping/mapmodule/AbstractMapModule.js to allow a smoother transition to Oskari 2.0 and helps keeping the codebases up to date.
Note! Alternative build systems need to include the AbstractMapModule.js file.

Default resolutions for mapmodule has been changed:

* from [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25] 

* to [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5]

If you have used the defaults and want to keep them add mapOptions to your mapfull config:

```javascript
{
	"mapOptions": {
		"resolutions": [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25]
	}
}
```

### Sandbox/map layer service

Added new method to find all layers corresponding to given metadata id.

### search bundle

Search flyout is now capable to include multiple tabs.

### metadatacatalogue bundle

Added a new plugin for metadata catalogue searches.

## 1.18.1

### mapmyplaces bundle

Now updates attention text on feature update

### publisher bundle

Now sends selected font as part of Logoplugin config to backend. 

Now accepts premade color schemes for opeining an existing view for editing (triggered a js error in 1.18).

Toolbar placement fixed on non-default style to be inline with other plugins.

### myplaces2 bundle

Removed options for selecting which properties should be shown for features (name, description etc) on myplaces layer add/edit form since selections were not used.

### LogoPlugin

Clicking datasource link repeatedly now toggles the popup instead of opening another one on top of the previous.

### statisticsgrid bundle

Sorting now handles values as numbers instead of strings.

Fixed a compatibility issue resulting in js error when going from statictics mode to publisher mode in a specific way.

### infobox plugin

Now uses actual popup id as identifier when setting colorscheme/font instead of hardcoded id.

### analyse bundle

Analyse mode is now behaving more appropriately when source layer has more properties than can be saved in analysis.

Now displayes a proper notification if source layer is unavailable when saving analysis.

## 1.18

## Known issues

* mapmyplaces - doesn't update attention text for features on update/remove

* statisticsgrid - sorting indicator values doesn't work correctly, seems to be comparing values as strings instead of numbers

### sandbox

Added `removeMapLayer` method which does the same thing as sending a `RemoveMapLayerRequest` but without the need for a request.

### mapmodule-plugin and all the layer plugins

Removed handling of `AfterMapLayerAddEvent` from the layer plugins for it is the mapmodule who handles it now. It calls `addMapLayerToMap` function for each of its registered layer plugins and assures the marker layer always appear on top of the map.

### mapwfs2

WfsLayerPlugin now assumes config values hostname and port based on document.location if not configured and contextPath also defaults to '/transport' if not configured.

### core/map layer service/AbstractLayer

Maplayer JSON parsing changed a bit:

* Legendimage is now parsed for all layer types

* AbstractLayer.addStyle() now checks that a style with the same name isn't added yet.

* Formats parsing has been moved out from styles parsing and in to wmslayer specific parsing as they are not related operations

* Default style for layers now has a label. The localization file used is linked by mapfull with the key 'Generic'. Default styles are also now shown as an option if there is another style option available in the layers data.

### statistics/statsgrid

The region category can now be changed whilst creating a new indicator.

A warning sign is displayed in an indicator's header if its data cannot be displayed in the selected region category.

The mode doesn't get started automatically anymore.

## 1.17.3

### Publisher bundle

Editing a published map no longer leaves searchplugin on map after exiting publish-mode.

### admin-layerselector bundle

Layer id is now correctly left blank for new layers instead of sending "null" string.

GFI type parameter is not sent if there is no selection (on update for example). The backend will keep the existing value if it doesn't receive a new one.

### mapwfs2/WFSLayerPlugin

Now formats myplaces data the same way as GetInfoPlugin.

## 1.17.2.

### infobox

Adaptable size handling improved. Selectors used to detect map size and get reference to the popup in question should now be safe even if there are multiple maps/popups on page.

## 1.17.1

### mapmodule/layerplugins

Improved marker handling, mapmodule now moves markerlayer on top when a new layer is added.

## 1.17

### **Breaking changes**

#### myplaces2

myplaces2 bundle now requires wfs to be in use in both the backend and the frontend. `Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin` and `mapwfs2` bundle need to be present in application config's plugin array for mapfull and in import bundle section in mapfull's startup sequence, respectively. Please refer to documentation in [oskari-server](https://github.com/nls-oskari/oskari-server) repository for instructions in how to set up the transport backend service. Note that the transport uses websocket which might cause some issues in proxy environments.

#### mapmyplaces

mapmyplaces is a new bundle, which is used for showing myplaces feature data through wfs. mapmyplaces must be in mapfull startup sequence

### publishedstatehandler

Added statehandler functions to published maps. It is also now possible to add map tools plugin in Publisher mode to new maps.

### Statsgrid

Added possibility to add indicator data through data import (localization is still work in progress)

Adds a tab to personaldata from which users can access and delete their own saved indicators.

The region category can now be changed from municipality to any other category SOTKAnet API has to offer.

The column widths are now set automatically to take the space available when resizing the grid and when adding/removing indicators. Grid width is split equally to each column.

### myplaces2

Measurements of places (area or length depending on the type) are now shown in the myplaces tab and whilst drawing a new place or editing an old one.

Dense point data is now aggregated into cluster visualizations.

Multi-lines are not anymore incorrectly combined when editing them.

### divmanazer/VisualizationForm

Visualization previews are now compatible also with Internet Explorer 8.

### Admin-layerrights

Now provides tooltips for checkboxes (permission text) and layername (layertype/inspiretheme/organization)

### Admin-layerselector

Backend API changed and the bundle has been refactored to match the API and the code has been cleaned up on relevant parts.

### Core/MapLayerService

Layer update now copies all the information the user can change on editing a layer. Behavior change: MapLayerEvent with add/remove operation is no longer sent
if a sublayer is removed/added, but instead it is sent with update operation. Removesublayer method was removed and removelayer handles sublayer removal as well. AddSubLayer method 
is still available but addLayer will handle adding sublayers if the layer has parentId property.

### mapfull

Configuration can now have additional link params f.ex. to add versioning for links: 

```javascript
{
	"link" : {
		"ver" : "1.17"
	}
}
```

Add mapmyplaces

### Work in progress

We are preparing the next major release of Oskari. Oskari 2.0 will utilize RequireJS for resource loading instead of oskari-loader. Migration tools and documentation are developed and improved as the work progresses. These changes are unstable (i.e. they will change) and placed into the src-folder.

## 1.16

### **Breaking changes**

MyPlaces prefix was changed to DrawPlugin. Affected changes are:
'Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin' --> 'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin'

'MyPlaces.GetGeometryRequest' --> 'DrawPlugin.GetGeometryRequest'

'MyPlaces.GetGeometryRequestHandler' --> 'DrawPlugin.GetGeometryRequestHandler'

'MyPlaces.StartDrawingRequest' --> 'DrawPlugin.StartDrawingRequest'

'MyPlaces.StartDrawingRequestHandler' --> 'DrawPlugin.StaǥrtDrawingRequestHandler'

'MyPlaces.StopDrawingRequest' --> 'DrawPlugin.StopDrawingRequest'

'MyPlaces.StopDrawingRequestHandler' --> 'DrawPlugin.StopDrawingRequestHandler'

'Oskari.mapframework.bundle.myplaces2.event.MyPlaceSelectedEvent' --> 'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent'
'MyPlaces.MyPlaceSelectedEvent' --> 'DrawPlugin.SelectedDrawingEvent'

'Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent' --> 'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent'
'MyPlaces.FinishedDrawingEvent' --> 'DrawPlugin.FinishedDrawingEvent'

'Oskari.mapframework.bundle.myplaces2.event.AddedFeatureEvent' --> 'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.AddedFeatureEvent'
'MyPlaces.AddedFeatureEvent' --> 'DrawPlugin.AddedFeatureEvent'

Myplaces2 now uses AreaForm, PointForm and LineForm from under divmanazer (VisualizationForm)

Toolbar has changed so that toolbar group has now always toolbar-id prefixed in the name. (Default prefix being 'default-'[buttongroup])

### Statsgrid

Municipality code was removed from the columns.

Users can now select the class limits mode from distinct and discontinuous.

The map link now gets the class limits mode and colour selections as parameters.

Removing indicator from the grid is now easier with a close icon on the top-right corner of each indicator

Added area based filtering, which allows users to filter municipalities based on different regions in which they belong

### mapmodule-plugin/LogoPlugin

Added a new link next to EULA which shows the data sources for map layers and open statistics indicators.

### ui-components

Added a new bundle which imports user interface components from under divmanazer.

### mapmodule-plugin/DrawPlugin

Refactored DrawPlugin from myplaces2 as an independent plugin.

### myplaces2

Added new configuration option 'layerDefaults' which can be used to override default values found in code. See bundle documentation for details.
Refactored DrawPlugin to mapmodule-plugin/DrawPlugin.
Moved myplacestab from personaldata to myplaces bundle. Refactored adding to use addTabRequest.

### divmanazer/VisualizationForm

New component which defines functionality to create geometry visualizations for eg. myplaces2 bundle.

### publisher

Added possibility to change order of the layer as well as its opacity. Also removing and adding new layers is now possible.

### personaldata

Removed myplacestab (is now in myplaces bundle).

### Core/AbstractLayer/MapLayerService

Added optional feature to enable localization on layer name, description, inspire name and organization name. The properties can now be set as objects containing language id as keys f.ex "en". For example layer.getName() now returns language version based on Oskari.getLang() if an object has been set with setName({ "en" : "layername" }). Alternatively another language version can be requested with for example getName("en").

### Openlayers update

Updated Openlayers 2.12 -> 2.13.1 for bundles openlayers/bundle/openlayers-full-map and openlayers/bundle/openlayers-published-map

### Oskari.userinterface.component.Popup

moveTo-function now checks if given selector matches an element before trying to place the popup to prevent "element is undefined" errors.

## 1.15

### **Breaking changes**

Environment specific localized values (URLs) have been move to bundle configuration. If something is broken, check the new configurations to fix it.

### Sandbox/map layer service

Added new method to create maplayer domain objects based on type: createLayerTypeInstance(type). This is a preferred way to create layer domain classes instead of Oskari.clazz.create() if you need to create one manually.

Added new method to find all layers of given type: getLayersOfType(type). For example get all wfs layers by calling getLayersOfType('wfs').

### mapmodule-plugin/layers/backgroundlayerselector

New plugin for selecting a background layer from a preset list. See the bundle documentation for more information.

### myplaces

Clicking a preview image in the My places GFI popup opens the image URL in a new browser tab or window.

Improved parameter handling for My places visualizations.

Improved "Finish drawing" button functionality when drawing new lines and polygons.

Localized URLs have been moved from bundles to bundle configurations.

### personaldata bundle

Now supports adding tabs with PersonalData.AddTabRequest request

English and swedish text & tooltips added.

Localized publishedMapUrl in bundle configuration.

### featuredata2 bundle

Uses hasFeatureData to check WFS-like layers instead of isLayerOfType('WFS')

### mapanalysis bundle

AnalysisLayer.js extends 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer'

AnalysisLayerModelBuilder.js utilizes 'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder'

Analysis layers' jsons are now constructed in mapfullhandler

### analyse bundle

Analyse bundle now requests personaldata bundle to show an additional tab with analysis layer listing. Analysis layers can be removed from the tab.

Properties moved from localization to bundle conf.

New analyse methods geom union and intersect/within selection released

Analyse filter popups are now draggable so that feature data can be visible at the same time.

### statehandler bundle

Fixed to send parameters correctly on ajax call. Views are now saved correctly again.

### publisher

Users can now choose to create and use a custom colour scheme for the GFI dialogs. Colour scheme is created with rgb values for the colours.

Localized URLs in bundle configuration.

### admin bundle

Fixed WMS interface address pre-filling problem.

Compatibility fixed for old WMTS layer json format

Every inline style removed that made any sense to remove.

### admin-layerselector

User interface bug fixes.

### statistics/statsgrid

Sorting is now disabled when clicking the header menu buttons of an indicator in the grid.
The classification now shows distinct class ranges thanks to the geostats library update.

Bundle now has a tile for easier access to statistics. Statistics layer to use can be configured with defaultLayerId : [layer id]

### libraries/geostats

Updated the geostats library to version per 10/17/2013.

## 1.14

### mapmodule-plugin/getinfo

The look of my_places GFI popup has been simplified and a possibility of displaying an image is now accounted for. The colour scheme and font are now configurable.

### mapmodule-plugin/layers

The style and font of the LayerSelectionPlugin.js are now configurable. See the bundle documentation for more information.

### mapmodule-plugin/panbuttons

The style of the pan buttons plugin is now configurable. See the bundle documentation for more information.

### mapmodule-plugin/search

The style and font of the search plugin are now configurable. See the bundle documentation for more information.

### mapmodule-plugin/zoombar

The style of the zoombar plugin is now configurable. See the bundle documentation for more information.

### publisher

A new panel for choosing the layout, or styling of the published map was added. The panel has three input fields for choosing the colour scheme used in GFI popups, the font and the style of map tools (pan buttons, zoombar, search plugin and layer selection plugin).

## 1.13

### mapmodule plugin

A new MapSizeChangedEvent is sent when map size is changed (event is sent on mapmodule.updateSize() function call which should always be called if the map size is changed programmatically)

### admin-layerselector

Adding base and group layers and sublayers to them is now possible. Also, adding sublayers individually from GetCapabilities query now works.

### statsgrid bundle

- There is now a mode for selecting municipalities from the map instead of the grid. 
- Checkboxes are visible by default. 
- Columns can be filtered now by clicking filter link in drop down menu (funnel icon in the header). 
- Chosen municipalities are now saved to the state.

### layerselector2
- layer search now supports ontology search. Type min 4 letters and press enter to open up a popup

### analyse bundle

- now supports choosing the features to send to the analyse from those available to the layer

## 1.12

### mapmodule plugin

mapOptions configuration can now be used to set units for OpenLayers.Map (defaults to 'm' as before).

### mapmodule plugin/wmslayerplugin

Scale limitations now use map resolutions internally to minimize risk of scale/resolution transformation errors.

### statsgrid bundle

Highlight/select controls are now disabled when not in the stats mode.

Clicking on an area on the map highlights the corresponding row in the grid and scrolls to display it as the topmost row.

Generic improvements on statistic mode handling

### statsgrid/ManageStatsPlugin

There is now a possibility to uncheck some of the municipalities. This affects to the statistical variables. This feature can be switched on from header row drop down list

### mapstats bundle

Hovering over an area on the map sends a request to get tooltip info which is then shown over the area.

### printout bundle

Improvements for statistics legend handling

## 1.11

### core/sandbox

Created a new category for state methods, called sandbox-state-methods. Added a function `resetState` which sets the application state to initial state which was provided by the GetAppSetup action route at  application startup.

domain/map no longer rounds coordinates with Math.floor()

### usagetracker bundle

Configurable event-based usage tracker. New bundle based on statehandler.

### printout bundle

A new event `Printout.PrintableContentEvent` which can be used to send additional data to the printout bundle. Event accepts contentId (to identify each GeoJSON chunk), layer (Oskari layer), tile data (an array of {bbox: [l,b,r,t], url: 'image url'} objects) and GeoJSON as arguments.

Legend plot for statslayer in printout

### mapmodule-plugin/mapfull/publisher bundles

Mapmodule now has a method to notify openlayers and internal datamodels that map size has changed: updateSize(). Mapfull and publisher changed to use it instead of handling it on their own. This ensures the map domain in sandbox is up-to-date and functionalities depending on it (like GFI) work correctly.

MapClickEvent now rounds clicked pixel coordinates so even if browser zoom is used, it returns integer values for pixels.

### mapmodule plugins zoombar, panbuttons and bundles coordinatedisplay and feature

Reverted plugins placement change from 1.10 so these are no longer placed inside openlayers container div with fixed position

### mapmodule plugin/wmslayerplugin

If min and max scale are not defined, scales are not specified for layer. There is a bug on scale handling when resolution is "low enough". This can be used as a workaround for the time being.

### statsgrid bundle

Municipalities are now grouped and there are statistical variables added to the header row. CSV download button created in the frontend.

### mapstats bundle

LayerPlugin now disables hover/highlight functionality if a StatsLayer is not added/visible on the map

### mapanalysis bundle

Refined ModelBuilder for analysislayer

### publisher bundle

Panbuttons is now an optional tool for publisher

## 1.10.1

### applications/paikkatietoikkuna.fi/published-map

minifierAppsetup.json fixed to use openlayers-full-map instead of openlayers-published-map since it was missing some OpenLayers components for indexMap.

## 1.10

### framework/publisher bundle
if there is statslayer to be published, div.oskariui-left will be reserved for showing data/grid.

### statistics/publishedgrid bundle
This is created for published maps so that it shows also grid if there is one.

### statistics/statsgrid bundle
Indicators which do not have data for all municipalities now show the missing values as blanks in the grid and on the map. This doesn't affect sorting, the blank values are always in the bottom when sorted.

### mapmodule plugins zoombar, panbuttons and bundles coordinatedisplay and feature

Plugins are now placed inside openlayers container div so that infobox is placed above them

## 1.9

### printout bundle

geojson extension added for background print service 

### toolbar bundle

Added a way to disable a button by default from configuration.

### promote bundle

Promote login and registering by replacing the real bundle for guest users. Configurable tile, flyout and toolbar buttons.

### myplaces bundle

Fixed isDefault parameter to be included with the category when saving.

## 1.8

### sandbox/map-layer-service

Removed hardcoded wmtslayer and wfslayer from map-layer-service. LayerPlugins should now handle layer model/builder registration on init function.

### core/sandbox/AbstractLayer

Layers can now have tools linked to them. OpenLayer options and params can be passed as arguments.

### mapstats bundle

StatsLayerPlugin now registers layer model/builder to map-layer-service on init.

StatsLayerPlugin registers tool links for STATS layer icon callbacks and Statistics mode.

ManageClassificationPlugin  classifies stats data and generates legend (geostats library is in use)

New SotkadataChangedEvent event is used for sending stats data in ManageStatsOut to ManageClassificationPlugin

### statistics/statsgrid bundle

Initial version for map view mode handling to show statistics grid.

### mapwfs bundle

WfsLayerPlugin now registers layer model/builder to map-layer-service on init.

WfsLayerPlugin registers a tool link for WFS layers to show featuredata grid.

### mapfull bundle

Configurable projection definitions that allow custom projections. Configured projections replaces the default definitions of "EPSG:3067" and "EPSG:4326".

WMTS specific layer model/builder registration has been removed from mapfull (now registered in mapwmts/plugin/WmtsLayerPlugin.init())

Mapfull now starts map and plugins before starting to parse layers JSON so plugins can register layermodels and builders.

### mapmodule-plugin bundle/ControlsPlugin

Map controls are now configurable (zoombox and measure controls) - by setting the control values as false the control is not added. 

### oskariui bundle

Added Bootstrap grid CSS to Oskari

### mapmodule-plugin bundle/WmsLayerPlugin

WmsLayerPlugin passes AbstractLayer options and params to OpenLayers.Layer.WMS
For example params allows format to be changed to "image/jpg" and options allows singleTile: true to be added

## 1.7

### core/sandbox

Added multimap support. Reference to {Oskari.mapframework.sandbox.Sandbox} should now be fetched through Oskari.getSandbox() method. 

Oskari.$('sandbox') still works but is deprecated. 

For bundles to support multiple maps a configuration option should be added to specify sandbox name:

```javascript
var conf = this.conf;
var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
var sandbox = Oskari.getSandbox(sandboxName);
```

### featuredata bundle

The bundle can now be configured to allow user make selections on map to filter grid content:

```javascript
{
    selectionTools : true
}
```
The bundle adds a selection tools button to Toolbar if configured to allow user selections

popuphandler.js added to the bundle which handles the selections tool

new method updateGrid() added to Flyout.js, this method is called when a grid should be updated (if flyout is opened or user filters grid content with map selection)

handleMapMoved() method removed from Flyout.js, use updateGrid() instead

showFlyout() is added to instance.js to open flyout and update grid

Bundle now provides a new plugin Oskari.mapframework.bundle.featuredata.plugin.MapSelectionPlugin for drawing selections on map

new method getSelectionPlugin() is added to instance.js which returns Oskari.mapframework.bundle.featuredata.plugin.MapSelectionPlugin

getBBox() is replaced with getGeometry() in WfsGridUpdateParams.js

### mapfull/mapmodule bundle

Configurable SrsName projection to be used, default srsName is "EPSG:3067"

### MapMoveRequest

Added srsName parameter for specifying projection to use if other than default

MapModule handles projection transforms if projection has been defined in Proj4js.defs.

## 1.6 release notes

### mapfull bundle

Now calls OpenLayers.updateSize() when it changes the size of div the map is rendered to.

### data source plugin

the layers are grouped together under same data provider headings and metadata links added

test suite added for the plugin

### libraries

GeoStats library added to Oskari libraries. 

Also added a new bundle package libraries/geostats that can be used as dependency for bundles utilizing the lib

### featuredata bundle

resizable flyout

### divmanazer bundle

selectable and resizable grid columns

### meta data bundle

adds selection area tool to toolbar
included in a new tarkkailija sample project

### toolbar bundle

default buttons are configurable, by setting the false the toolgroup or tool is not added

### myplaces bundle

External graphic can be activated by changing OpenLayers bundle version to openlayers-graphic-fill (instead of openlayers-single-full) and giving new style as config parameter to the drawin plugin.
Adding external graphics for DrawPlugin:
```javascript
        var newStyle = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>\
        <sld:StyledLayerDescriptor version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld ./Sld/StyledLayerDescriptor.xsd">\
            <sld:NamedLayer>\
                <sld:Name>Polygon</sld:Name>\
                <sld:UserStyle>\
                    <sld:Name>Polygon</sld:Name>\
                    <sld:FeatureTypeStyle>\
                        <sld:FeatureTypeName>Polygon</sld:FeatureTypeName>\
                        <sld:Rule>\
                            <sld:Name>Polygon</sld:Name>\
                            <sld:Title>Polygon</sld:Title>\
                            <sld:PolygonSymbolizer>\
                                <sld:Fill>\
                                    <sld:GraphicFill>\
                                        <sld:Graphic>\
                                            <sld:ExternalGraphic>\
                                                <sld:OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.paikkatietoikkuna.fi/mml-2.0-theme/images/logo.png"/>\
                                                <sld:Format>image/jpg</sld:Format>\
                                                </sld:ExternalGraphic>\
                                            <sld:Size>20</sld:Size>\
                                        </sld:Graphic>\
                                    </sld:GraphicFill>\
                                </sld:Fill>\
                                <sld:Stroke>\
                                    <sld:CssParameter name="stroke">#006666</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-width">2</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-opacity">1</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-dasharray">4 4</sld:CssParameter>\
                                </sld:Stroke>\
                            </sld:PolygonSymbolizer>\
                        </sld:Rule>\
                    </sld:FeatureTypeStyle>\
                </sld:UserStyle>\
            </sld:NamedLayer>\
        </sld:StyledLayerDescriptor>';


        // rewrite creation of drawPlugin in the start-function
        // register plugin for map (drawing for my places) 
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin', { graphicFill : newStyle });
```

Multiple points, lines and polygons are now supported objects in My places. After each drawn feature a new MyPlaces.AddedFeatureEvent event is sent.
After the drawing is finished by the user, the existing MyPlaces.FinishedDrawingEvent is sent. Enabled with config:

```javascript
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin', { multipart : true });
```

My places draw plugin can now be configured to send namespaced events. Plugin name is also prefixed with namespace, map can have multiple drawplugins at the same time.
Enabled with config:

```javascript
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin', { id : '<namespace>' });

        ->

    eventHandlers : {
        '<namespace>.AddedFeatureEvent' : function(event) {}
```

### framework.domain

Created AbstractLayer.js that is inherited by all layer implementations. The abstract function implementations will unify layer functionality. The WmtsLayer will also correctly use legends if defined and type 'wmtslayer' will return false when called isLayerOfType. Use 'wmts' instead.

### statehandler

Added conf to enable usage logging to the conf url. Replaced UsageSnifferService with _logState in statehandler.

### core/sandbox

service-map package no longer links UsageSnifferService

References to UsageSnifferService removed from core/sandbox.

## 1.5 release notes

### libraries

Openlayers updated to 2.12

### Openlayers/openlayers-single-full bundle 

Now uses the updated Openlayers version

### personal data bundle

user can modify the published/embedded maps from personal data lists.

sends a request to Publisher bundle to enable publish mode

### Publisher bundle

created request PublishMapEditorRequest to enable the publish mode. 

publisher can now be prepopulated with existing view data using the PublishMapEditorRequest.


### mapmodule bundle/Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin

new plugin for mapmodule 

renders list of data providers for the selected layers

### featuredata bundle

improved scaling for the Object data flyout

## infobox bundle
there is a new configuration possibility: adabtable. If adabtable is set true, infobox will adapt its size according to content

## printout bundle
A new printout bundle is added. It offers a user interface for the backend component that print out PNGs and PDFs.


## 1.4 release notes

### core

class inheritance added

documentation tbd/Oskari.org (http://www.oskari.org/trac/wiki/DocumentationDataMapLayer#Extendingwithcustomtype) (Oskari Class Definition with support for Inheritance)

### featuredata bundle

implemented a request handler to show WFS feature data flyout

layer ID parameter specifies the tab to be automatically selected by the request handler

### layerselection2 bundle

added an object data link to show WFS feature data flyout

the link is visible if the FeatureData bundle is available and the layer type is WFS

### personaldata bundle

add/edit view - now provides description field for the view

### statehandler bundle

saveState API changed - old impl had parameter name, new impl has an object with properties name and description

### maplegend bundle

Legend is now shown based on layer style

###  layerselector2 bundle

Filtering layers is now case-insensitive

### mapfull bundle

New configuration options - "mapOptions" is passed to mapmodule-plugin constructor

created a new folder: request

MapResizeEnabledRequest & MapResizeEnabledRequestHandler tell the mapfull bundle if window resizing should be disabled

adjustMapSize function reacts only if map has not resizeEnabled set false

### mapmodule-plugin bundle

New configuration options - constructor takes a third parameter "options" which can be used to override default map:

```javascript
{
    "resolutions" : [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
    "maxExtent" : {
        "left" : -548576.0,
        "bottom" : 6291456.0,
        "right" : 1548576.0,
        "top" :  8388608
    }
}
```

### divmanazer bundle / popup component

Now detects if content would be too large for screen and provides scrolling if so.

### publisher bundle

StartView now includes dialog-link to Terms of Use

StartView now asks the server if the user has accepted Terms of Use. If not accepted, the Continue button is Renamed "Accept Terms of use and continue" and pressing it will ping the server and notify that the user has accepted ToU.

New dependencies:

- backend actions: HasAcceptedPublishedTermsOfUse, AcceptPublishedTermsOfUse and GetArticlesByTag
- divmanazer component: Oskari.userinterface.component.UIHelper

setPublishMode sends MapResizeEnabledRequest with boolean telling whether user is in the publishing flow (resize disabled)


## 1.3 release notes

### Sandbox

sandbox.generateMapLinkParameters() function now takes an optional parameter for overriding default URL parameter values, see API documentation for details

### search bundle

now removes search result when the search field is cleared

now sends a MapModulePlugin.RemoveMarkerRequest when search field is cleared if the request is available

title updated for english localization

### mapmodule bundle/Oskari.mapframework.mapmodule.MarkersPlugin

now provides MapModulePlugin.RemoveMarkerRequest and handler for it

### mapmodule bundle/Oskari.mapframework.mapmodule.ControlsPlugin/OpenLayers.Control.PorttiMouse

zooming with double click and mouse wheel now behave identically (behavior configurable)

### post-processor bundle

new bundle

handles wfs feature highlighting at map startup

moves the map to location/zoom level based on config bounding box.

### divmanazer bundle

FormInput component now allows additional characters by default: ',', '?', '!'

IE issues fixed for flyout handling (draggable/button hover)

### toolbar bundle link-tool

Generated link now adds the marker parameter as true

### publisher bundle

Changing locale now changes language on the preview map

Plugins used in publisher now determine language on startplugin

### backend status bundle

new bundle

Gets status information for maptile/layer backend functionality

moves the map to location/zoom level based on config bounding box.

### layerselector2 bundle

Published user layers tab is now configurable (defaults to now being shown)

Shows layer backend status information if available for listed layers

Updates layer backend status information on MapLayerEvents

Gathers sublayers metadataUUIDs for ShowMetadataRequest

### layerselection2 bundle

Gathers sublayers metadataUUIDs for ShowMetadataRequest

### guidedtour bundle

localization changes

css selectors fixed to be more specific to not overwrite all buttons style

### oskariui bundle

css fixed for slider to not crop handleimages

### mapmodule bundle/Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin

new plugin

tries to get users location from browser

http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginGeoLocationPlugin

### infobox bundle

infobox is no longer stateful (fixes JSON.stringify() cyclic reference error that happened on certain infobox contents)

### myplaces2 bundle

improved error handling with default category

disables draw buttons if default category can't be created and shows a notification about it to the user

### metadata bundle

ShowMetadataRequest has additional parameters for handling multiple metadata sources on a single layer

Metadata is shown in an accordian to enable multiple metadatas on single layer


## 1.2 Release notes

### RightJS replaced by jQuery UI

Bundles/Components affected:

- Zoombar (slider implementation)
- layerselection2 (layer ordering/opacity slider)
- divmanazer (flyouthandling)

### UserGuide

localized

### LayerSelection2 bundle

No longer lists publish permissions for guest users

### Documentation

Backend interface

Bundles/Plugins

### oskariui bundle

new bundle
provides cherrypicked jQueryUI library subset and custom css style


## HOTFIXs after 1.1

### Layerselector2

No longer list published myPlaces in layerselector2

### Default loglevel changed


## Release notes 1.1

### Layerselector2

New tab users

List of published myPlaces layers

### MapFull

Marker flag now works NOTE! marker handling will be refactored to a new request so this one will be deprecated in near future, but can be used for now to show a marker

### Publisher

Plugin changed to listening MapLayerVisibilityChangedEvent

Publisher bundle Publish mode did not exit to default view when get feature info plugin was deselected in publisher.

Publisher was calling stopPlugin for plugins that were not started.

### Others

Userguide bundle was changed to load guide content only when the  guide flyout is opened. This change will improve application startup performance.

Double click mouse to zoom behaviour was changed to retain geolocation under cursor. This is configurable in code but not in application configuration at the moment.

My places bundle was fixed to force a refresh for my places WMS layer when a 'My Place' was deleted.

bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequest.js

- Added getParameters({property}) for MapLayerUpdateRequest
- Added setParameters({property}) for MapLayerUpdateRequest

bundles/framework/bundle/mapmodule-plugin/request/MapLayerUpdateRequestHandler.js

- Added isLayerOfType("WMS") && request.getParameters() for MapLayerUpdateRequestHandler


## Release notes 1.0

Initial versio for new Oskari

