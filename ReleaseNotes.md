# Release Notes

## 1.45.1

For a full list of changes see: https://github.com/oskariorg/oskari-frontend/milestone/8?closed=1

- Myplaces drawing fixes to improve usability and interaction with GFI.
- Doubleclicking the map while drawing to finish the sketch no longer zooms in.
- WFS-highlights for layers that are not on the map can now be done as before.
- Heatmap reacted to layer events for non-heatmap layers. This has been fixed.

## 1.45.0

For a full list of changes see: https://github.com/oskariorg/oskari-frontend/milestone/4?closed=1

### Mapmodule

- Numerous issues fixed regarding map rotation.
- WMS singletile layers in OpenLayers 3 implementation now send progress events like tiled layers.
- Empty results for GetFeatureInfo (map click on layer) functionality is no longer shown as empty infobox.
- Reseting the map having hidden WFS-layers now works as expected. Previously hidden WFS-layers became visible on reset.
- Plugin ordering fix.

#### OpenLayers update (4.4.2)

- Bundled Openlayers 3+ version updated (currently used for embedded maps).
- Most of the bundles for the sample application now have a parallel implementation usable with OpenLayers 4. This is in preparation for migrating all of Oskari to use Openlayers 3+ version not just for embedded maps but also for GeoPortal appsetups.

#### Embedded maps

- Embedded maps including maplegends can now be reset as normal. Previously maplegends caused problems on reset.

#### Drawing functionality (drawtools)

- Mapclicks are no longer propagated while drawing on Openlayers 3+ mapmodule.
- Polygons now include the closing point for linear rings (https://github.com/oskariorg/oskari-frontend/pull/177).
- It's now possible to get drawn geometries as a feature with MultiGeometry instead of having multiple features with "simple" geometries (https://github.com/oskariorg/oskari-frontend/pull/).
- It's also possible to edit MultiGeometries on drawtools.
- Other bugfixes.

### Timeseries functionality

- Adds generalized timeseries UI that any other bundle can use with TimeseriesService.
- Adds support for registering layer animation implementations with TimeseriesLayerService (via TimeseriesService).
- Adds implementation for animating WMS layers (via TimeseriesLayerService).

https://github.com/oskariorg/oskari-frontend/pull/152
https://github.com/oskariorg/oskari-frontend/pull/170

### Publisher

- Map size handling fixes.
- Publisher can now be configured to skip creating tile on the menubar and bind the functionality to open from configured element (https://github.com/oskariorg/oskari-frontend/pull/216).
- New (admin) bundle for creating embedded maps by a JSON configuration. Adds options to import/export configuration in publisher. Usable for replicating embedded map configs from one user to another within an instance (https://github.com/oskariorg/oskari-frontend/pull/204)

### Statistical maps functionality

- Diagram is now available as a visualization in addition to map and table data.
- The basic userinterface has been changed and every visualization now has it's own flyout.
- Legend now adds a scrollbar when needed (on small screens).

### Misc

- Printing no longer supports any statistical maps related overlays like the legend. This is a quick fix for allowing Openlayers 4 based printing. A new printing frontend is "under construction" and it will allow functionalities to "hook into" the printing interface in the same way that they can to publisher. This means printing no longer has references to other functionalities. Instead other functionalities can add additional options for printing.

#### Internals

- Updated bundled jsts.js to 0.16.0
- A lot of unused libraries have been removed from the libraries folder.
- Sandbox now has errorhandling for Oskari events minimizing the impact of one eventhandler failing for the app as a whole:

    Sandbox: Error notifying FeatureData2 about DrawingEvent

- Oskari loader now announces (in developer console) any exposed libraries bundles have and possible overrides from other bundles.
- Added more tests for RPC-functionalities
- Added Oskari.BasicBundle to the core that manages most of the boilerplate code for bundles without the basic tile/flyout setup (https://github.com/oskariorg/oskari-frontend/pull/226)
- Added Oskari.urls.getLocation([key]) where key can be "login", "register" etc that enables bundle-specific url configurations to be removed in the future. Urls are provided in GetAppSetup XHR response under "env" key.

#### Deprecated:

- sandbox.getLocalizedProperty() in favor of Oskari.getLocalized(). They were duplicate implementations for the same thing.
- Oskari.app.setApplicationSetup() with identical Oskari.app.init() just to have a shorter name.
- Oskari.getSandbox().getAjaxUrl() with Oskari.urls.getRoute(); since URLs are not sandbox specific, but global to the application
- Oskari.getSandbox().setAjaxUrl(url) with Oskari.urls.set("api", [url]);

## 1.44.3

### VectorLayerPlugin / AddFeaturesToMapRequest

Fixed an issue where a vectorlayer that was shown on the UI layer selection (created with the request showLayer=true) could not be re-added to the map after being removed.

### Map plugin localization

Fixed an issue where plugin couldn't start because it didn't have localization. This fixes an issue where map legends tool in publisher was not working properly.

## 1.44.2

### statistics/statsgrid2016

Fixed an issue where publisher tools for statistics functionality activated only when editing published maps with said functionality and not when creating new published maps.

### Build-script

Fixed an issue where images were not correctly copied for minified application when folder name included uppercase characters.

## 1.44.1

### Grid

Fixed issues:
- grid paging didn't work
- grid selection error when ``select``-function  is used to select row when grid has not data yet

#### VectorLayerPlugin ol2/ol3

Fixed an error when ``MapModulePlugin.RemoveFeaturesFromMapRequest`` is used to remove features from layer which has none.
Fixed an error when ``MapModulePlugin.RemoveFeaturesFromMapRequest`` is used to remove features from layer that is not on the map (now ignores the call, previously cleared all features from all layers).
Fixed an error introduced in 1.44.0 where ``MapModulePlugin.AddFeaturesToMapRequest`` with priority value resulted in a JavaScript error.

### publisher2

Fixed an issue where the button to add layers in publisher didn't work.

### FormInput

Floating labels were created to all FormInput components which used setPlaceHolder method. Now floating labels are created by calling setFloatingLabel. If you want to use floating labels with FormInput component, you have to use new method. Floating label position can be adjusted with topPosition, which adds a value to the css-directive "top".

Optionally tooltip can be bound to input (default binds to label).

Now floating label is floated when input is selected instead of typing text.

### drawtools

See [api/CHANGELOG.md](api/CHANGELOG.md) for changes.
Refactored the code for the functionality to make it more accessible.

### Data sanitation

Improved security by sanitizing values.

### statistics/statsgrid2016

Fixed an issue where publisher tools couldn't restore thematic maps functionality (for editing) from a previously saved published map.
This resulted in thematic maps functionality being removed from the published map on edit.

## 1.44.0

### layerselector2

Filter buttons are now shown on each tab instead of just the first one. Also fixed undefined error for ShowFilteredLayerListRequest.

Changed ``stats`` filter name to ``featuredata`` for consistency as it filters layers having feature data and not stats layers.
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', [null, 'featuredata']);
```

Filtering performance has been improved.

Requests should be serializable to JSON and shouldn't be used to pass functions. AddLayerListFilterRequest and ShowFilteredLayerListRequest refactored based on this and the function parameters have been removed.
Filter-functions can be registered to MapLayerService. By default it includes built-in filters for 'featuredata' and 'newest' ids.

Use built-in filters:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['newest']);
```

Register new filter and use this:
```javascript
// Register new filter
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('find_layers_name_start_a', function(layer) {
    var name = layer.getName().toLowerCase();
    return (name.substring(0,1) === 'a');
});
// Use new filter by request, the second parameter opens the layer listing flyout if it's closed
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['find_layers_name_start_a', true]);
```

Add new filter button for layer listing:
```javascript
// Add layer filter to map layer service
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('publishable', function(layer){
    return (layer.getPermission('publish') === 'publication_permission_ok');
});

// Add layerlist filter button
Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest', [
        'Publishable',
        'Show publishable layers',
        'layer-publishable',
        'layer-publishable-disabled',
        'publishable'
]);
```

### Timeseries improvements

Animation now waits for frame to load before advancing.
The next animation frame is buffered before it's shown. Depending on the service used this might make the animation go slower, but is more user (and service) friendly.
Added new event TimeseriesAnimationEvent.
Changed ProgressEvent to include layer id instead of 'maplayer' (functionality id) string as ID value.

### divmanazer Chart component

``New component`` for creating bar or line charts.

```javascript
var barchart = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox());
var data = [{name:"2", value:1},{name:"1", value:3},{name:"11", value:31},{name:"12", value:32},{name:"13", value:300},{name:"14", value:355},{name:"15", value:366},{name:"16", value:377}];
barchart.createBarChart(data);
jQuery('<div></div>').append(barchart);

```

### Core/Oskari-global

Added new localization function that supports message templates: Oskari.getMsg(). It should be used instead of Oskari.getLocalization().

  Oskari.getMsg('<MyBundlesLocalizationKey>', '<path.to.message>', {key1: value1, key2: value2});

Included intl-messageformat library into frontend core. It uses standard ICU message format and allows interpolation, pluralization, number/date formatting.

For more details see http://oskari.org/documentation/development/localization

#### Logger

Oskari.log() now has an additional function for notifying about deprecated calls without spamming the developer console:

     Oskari.log([name]).deprecated('myOldFunc()');
     Oskari.log([name]).deprecated('myOtherOldFunc()', 'Use myNewFunc() instead.');

Prints out:

- myOldFunc() will be removed in future release. Remove calls to it.
- myOtherOldFunc() will be removed in future release. Use myNewFunc() instead.

#### Oskari.util

Changed mobile mode detection. Now the mode switch is determined from ´#mapdiv´-element size (previous was window size).

### featuredata2

Featuredata2 now has a new control for showing selected rows on top of the table. This makes finding and comparing selected items easier.

### Grid

Grid split into smaller files to make it more manageable:

- GridSelection.js includes select functionalities
- GridPaging.js includes paging functionalities
- GridSort.js includes sorting functionalaties

New ``moveSelectedRowsTop()``-function. This can be used to move selected rows on top of the table. Boolean true param moves the selected rows on top while false will return them on correct places based on current sorting. If the table is not currently sorted the rows are not moved with false-parameter.

```javascript
  var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
  ...
  // show selected rows top
  grid.moveSelectedRowsTop(true);

  // not show selected rows top
  grid.moveSelectedRowsTop(false);
```

### FormInput

Added floating label functionality to FormInput. Floating labels are created by calling setPlaceholder(). If the floating label is of from the input field you can adjust it with addMarginToLabel, which adds a a value (px) to the css-directive "top".

### Guidedtour

Bundles now register themselves into the guided tour with an AddToGuidedTourRequest, giving a delegate object with properties and methods used when rendering the guided tour dialog for the requesting bundle.

By default (without guided tour bundle configuration), dialogs for all registered bundles are shown in the order of "priority" property given in AddToGuidedTourRequest. To override the default behavior, the guided tour bundle can be given configuration to show only a subset of the registered bundle dialogs and alter their ordering. The content of the dialogs can also be replaced with tags referring to GetArticlesByTag API articles.

### framework/download-basket

Added support to use download basket. Layers need following layer attributes:
- unique: layer unique column name
- geometryColumn (optional): cropping layer filter type, currently supported value STRING. These means at filter is made by STRING query for backend (property LIKE 'wantedvalue%'), otherwise used int/double/boolean filter
- geometry: layer geometry column name
- cropping: true/false, if true then used layer for cropping selection
- basemap: true/false, if true then skipping it for using download basket
- raster: true/false, is layer raster layer? if true then show popup for this at not supported and skipping it

Known issues:
    - only localized in Finnish
    - only supported one license type

### statistics/statsgrid2016

Statsgrid shows now areas as vectors on the map layer (WMS layers not used anymore to show areas).

Fixed followings in point map style:
- allowed change classify (distinct/discontinous)
- maked smaller point more smaller
- legend: dublicate values now displayed one time ( 0.0000 - 0.0000  --> 0.0000)
- legend: fixed distinct legend value labels

Changes:
- used d3 library for calculating point symbol sizes

UI improvements:
- moved show values checkbox before color selection
- layer opacity value are now showed opacity selectbox

### mapmodule

Fixed an issue where layers disappeared when pinch zooming on Android. Caused by zoom level having decimals instead of integer values.

Featurestyle now supports image.sizePx parameter what is used exact icon size without Oskari icon size calculation.

Changed using escape funtion to encodeURIComponent because escape function is deprecated in JavaScript version 1.5.


#### VectorLayerPlugin ol2/ol3

New functionalities for ``AddFeaturesToMapRequest``. New options available:
- layerInspireName : Inspire name for added layer
- layerOrganizationName: Organization name for added layer
- showLayer: Show layer to layerselector2/layerselection2. If setted truue then show map (add layer to mapservice).
- opacity: Added layer opacity. IE 11 cannot handle right vector laeyr opacity if used SVG icon.
- layerName: Added layer name (showed in layerselector2/layerselection2)
- layerDescription: Added layer description (showed subtitle in layerselection2)
- layerPermissions: Added layer permission

### infobox

Fixed issue where Get Feature Info (GFI) popup did not fit on the visible map area.

### Myplacesimport

Changed import file POST to use ajax XHR2 instead of iframe. Added upload progress bar and error handling. Some localization changes and error messages added. Choose a file dialog now shows only zip-files and folders.

Now shows imported feature count in the success message. On error shows error message and tips. The message popup doesn't fadeout if error or warning occurs.

### Myplaces2

The drawn figures are now removed from the map when PlaceForm is closed by clicking x-icon (cancel).

DrawPlugin now checks preconditions before trying to save the drawn figures on the map.
A line should have 2 points or finished figure (double click) and an area should have 3 points or finished figure (double click).

Fix for layer updating on map when myplaces are updated by the user.

### Search

The default search UI now includes an optional autocomplete functionality.
Searchchannels in oskari-server must provide support for it to be useful.
See oskari-server ReleaseNotes on details how to support autocompletion.

### Visualization form UI

User can select "no stroke" and "no fill" as stroke and fill colors for polygons. This results in no stroke / fill being rendered. Requires updated code in oskari-server.
Bug fixes for default values (point marker), color selections and restoring values for the forms when editing.

### Background layerselector plugin

Previously the layer selector UI was hidden if user opened Analysis, Thematic or Publish map modes.
This change keeps the layer selector visible always (except Publish map), but turns the selector into a dropdown menu if the map is too narrow to fit the buttons.

### Analysis

Fixed an issue with english translations where selecting analysis method "Analysis Layer Union" showed the parameters for "Buffers and sector".

### Initial tests for RPC

Initial versions of tests have been added under oskari-frontend/test/rpc.

## 1.43.0

### Minifier script

No longer assumes "oskari" as the folder name when processing images. Now determines the folder name based on the parent-folder name for the Gruntfile.js

### Publisher2/history tools

History tools (moving to previous or next view) can no be published only together. If there are published maps with only one of history tools, the other one will be added there as well. This is done because moving to next view is useless without possibility to move to previous view.

### Grid

Fixed subtable sorting.

### LogoPluginService

Logo-plugin now provides a new service which can be used to add new items next to the logo (links, texts):

	var logoService = Oskari.getSandbox().getService('Oskari.map.LogoPluginService');
	// just adding a text
	logoService.addLabel('Hello');

	// providing a callback and an id (to identify the label later on)
	var options = {
		id:'hello',
		callback: function() {
			alert("Hello");
		}
	};
	logoService.addLabel('Alert', options);

### admin/appsetup

``New admin bundle`` for creating AppSetups (views) from JSON definition.


### divmanazer TabContainer component

TabPanel can now have an identifier that is added as class to both the header and content containers (easier to reference from tests etc).
TabContainer now only includes the content panel that is visible to the user to the DOM. Previously all of the panels were part of the DOM, but hidden with CSS.
When a tab is changed the previously shown panel is detached (previously hidden) and the current tabs panel is inserted to DOM (previously made visible).
This might affect usage of the component if an external code snippet assumes that all the tabs are accessible via DOM.

### paikkatietoikkuna/register

New paikkatietoikkuna-specific bundle that creates login and registration links as well as logout link after user is logged in.
Bundle also creates registration popup to give information about registration before directing to registration page.

## 1.42.1

### divmanazer Grid

Programmatic selection of a row no longer triggers selection listeners.
This fixes an issue where selecting a WFS-feature triggered an infinite loop in featuredata flyout.

## 1.42.0

### search UI

The "municipality" field label in results table has been replaced with a more generic "region".

### Map legend

A new plugin for maplegend which is available when publishing maps with legend data. Does not appear in publisher if no suitable layers are found.

### DrawPlugin.ol2

Fixed modify control preventing events to flow as expected. Now modify control is activated when starting to draw features.

#### VectorLayerPlugin ol2

Added support for optionalStyle on OpenLayers 2 based mapmodule when adding features to map with  ``AddFeaturesToMapRequest``.

Now ol2 ``FeatureEvent`` returns GeoJSON as proper JSON like ol3 implementation (previously was String with escaped JSON content).

#### VectorLayerPlugin ol3

Feature labels provided in style configuration is now always cast to String on OpenLayers 3. Numbers for example caused JS errors.

Fixed feature's style updated using ``MapModulePlugin.AddFeaturesToMapRequest``.

### mapwfs2

Added load events for the wfs-layers based on the StatusHandler.

### maprotator

New bundle maprotator. Publisher part works with Openlayers 2 actual map rotating only works with Openlayers 3.
Can be used in a published maps, select rotate map option when publishing to enable user/RPC to rotate the map.
To rotate the map press SHIFT + ALT + Drag with mouse.

Sends the map.rotated event when the map is rotating from which you can get the map orientation in degrees.

Can also be used with request:
```javascript
  var rotateMap = Oskari.requestBuilder('rotate.map');
  Oskari.getSandbox().request('maprotator', rotateMap(180));
```
Where 180 in the example above is the degrees for map rotation.

### statistics/statsgrid2016

Fixed an issue where grid was needlessly rendered multiple times.

Indicators in datatable are now paged if more than three indicators have been selected.

Selected region is now saved to bundle state.

Initial implementation for new ``RegionsetViewer`` component. It can be used to show regionset on map as vector features instead of WMS-service.
Can be activated with following bundle config (not production ready yet):

    {
        vectorViewer: true
    }

Indicator attribution data now include the datasource name and optional link in addition to indicator source.

### divmanazer grid component

``setGroupingHeader`` function now allows also setting maxCols and pagingHandler. maxCols is the number of columns to show before paging the content. You can also define pagingHandler callback function. The callback function is called when page is being changed and receives the title element as first parameter and as a second parameter an object describing the paging status:

```
 {
    visible: {
        start:1,
        end:3
    },
    count:3
}
```
Where "visible" tells the indexes of the visible columns and "count" is the total number of columns available.

For example:
```javascript
var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
// Set grouping headers
grid.setGroupingHeader([
    {
        cls: 'firstClass',
        text: 'First text'
    },
    {
        cls:'secondClass',
        text: 'Second text',
        maxCols: 3,
        pagingHandler: function(element, data){
            console.log(data.visible.start + '-' + data.visible.end +'/' + data.count+')');
        }
    }
]);
```

Fixed double scrollbar when grid has column selector (like properties) and few rows in the table.

Fixed sort when using column name renderer.

Grid.select can now scroll the grid container to show the selected row (pass scrollableELement as parameter to use).

For example:
```javascript
var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
// add here some data to grid and so on

grid.renderTo(jQuery('.datatable'));

// select row and scroll to selected
grid.select('wantedRowValue', false, jQuery('.datatable').parent());
```

### coordinatetool

Arrow keys in lon and lat inputs now work as expected and don't move the map anymore.

Fixed extra coordinate server transform calls.

### Oskari.util

Changed coordinate regex patterns to allow also negative minutes/seconds.

### statslayer/index map interoperability

Fixed an issue where opening index map with statslayer as base resulted in:

- the normal map not refreshing on move after indexmap is opened
- in some cases indexmap + normal map going to an infinite update-loop when zooming out

### mapmodule

getScreenshot function is now asynchronous and responds after all tiles have been loaded. It also takes a second parameter timeoutSeconds, which sets the maximum times it waits for tiles to load, by default it's 5 seconds

Before:

```javascript
  var imageData = mapModule.getScreenshot();
```
Now:

```javascript
  mapModule.getScreenshot( function ( imageData, timeoutSeconds ){
      //Do something with  imageData
  });
```
New event (ProgressEvent) that tracks if something is progressing or not. Ex. usage, check if all tiles are loaded for layer.

ol2 mapmodule now support fill.color -property when getting style.

ol3 mapmodule getStyle also handle image.opacity same as than ol2 side. Opacity setted here in fill color. Also own SVG image handles opacity right.

´map.DataProviderInfoService´ from LogoPlugin can now handle multiple sources for attribution data including an optional link in addition to name.

### publisher2

Medium map height changed from 525 to 600 pixels.

### myplacesimport

Default config is now included in the code so configuration is optional.

### timeseries

Default config is now included in the code so configuration is optional.

### promote

UI text for bundle now uses Oskari.getLocalized() when parsing configuration.
This means that for example URLs in localization can be presented as single value or a localized object:

      "signupUrl": "/user",
      "registerUrl": {
        "en": "/user",
        "fi": "/user"
      }

## 1.41.3

### coordinatetool

Fixed error when adding marker other than 'EPSG:3067' or 'EPSG:4258' projection.

Also removed marker label text hard coded coordinate decimal rounding when projection is not 'EPSG:4258' or 'LATLON:kkj'. Now label text is rounded to projection defined decimals or default decimals. The mapmodule fix also affects marker label and it's now placed next to the marker and not on top of it on the geoportal views.

### mapmodule (Openlayers 2/geoportal)

textAlign for styles now work with labelAlign or textAlign on Openlayers 2 mapmodule. Previously only supported labelAlign. Openlayers 3 only supports textAlign.
textAlign is the documented API and labelAlign will be removed in the future:

    {
        text : {
            textAlign: 'left'
        }
    }

## 1.41.2

### Fixed history tools

- mapfull. Removed unneccessary adjustMapSize call.
- mapmodule-plugin/MapMoveRequest. Fixed zoom changed check.

### fullscreen

Fixed JavaScript error when stopping plugin.

### Datasources UI in LogoPlugin

Fixes an issue where data providers were not listed on the attribution listing.
LogoPlugin now has a service which can be used to push information to the data providers/attribution list.
LogoPlugin no longer references statistics data on its own.
Statsgrid bundles push the attribution data to the LogoPlugin via the new ´map.DataProviderInfoService´.

### statistics/statsgrid2016

Performance improvements:

- StatsGrid.RegionsetChangedEvent is not triggered if setRegionset() is called with the current regionset id.
- Datatable was rendered multiple times when an indicator was added. This has been fixed.
- Flyout content is no longer re-rendered each time the flyout moves.

Fixed an issue with publisher preview in Internet explorer.
Fixed localization issue with layer tools shown in selected layers.

### Oskari.util.naturalSort

Now always sorts empty ('') values to last position.

### myplaces2

The layer name was not populated correctly when editing a myplaces layer. This has been fixed.

### paikkatietoikkuna/routesearch

Fixed the matka.fi routing option for the paikkatietoikkuna-specific bundle.

## 1.41.1

### MapModulePlugin.AddFeaturesToMapRequest

Request assumed that each feature has a label text provided in featureStyle. This assumption has been removed.

## 1.41.0

### OpenLayers 3 update

Updated OpenLayers from 3.18.2 to 3.20.1.

### Oskari 2.0 preparations

- Oskari.mapframework.sandbox.Sandbox has been renamed Oskari.Sandbox. This shouldn't affect any application as the main access point to get a reference is still Oskari.getSandbox().
- Oskari.mapframework.domain.User has been renamed Oskari.User. This shouldn't affect any application as the main access point to get a reference has been Oskari.getSandbox().getUser().
- Oskari.getSandbox().getUser() and Oskari.getSandbox().setUser() has been deprecated. Oskari.user() should be used with param to set user, without param for getting the user.
- Sandbox is now built-in to bundles/bundle.js instead of loaded separately as part of application.
- Moved domain/Map from core to mapmodule as 'map.state' service.
- Removed setExtent() and deprecated getExtent() from 'map.state' service. Use setBbox() and getBbox() instead as they operate the same variables.
- Moved getRequestParameter() from core and sandbox to Oskari.util.getRequestParam()
- Removed core.getSandbox(). Use Oskari.getSandbox() instead.
- Removed core.registerService() and core.getService() since they are always called through sandbox. The registry is now in sandbox.
- Added convenience methods to Oskari.util.isNumberBetween() to detect if a number is in range and Oskari.util.arrayMove() to re-order items inside an array.
- Selected layers are now tracked in sandbox.getMap() object instead of core:

```javascript
    core.getAllSelectedLayers() -> map.getLayers()
    core.isLayerAlreadySelected(id) -> map.isLayerSelected(id)
    core.findMapLayerFromSelectedMapLayers(id) -> map.getSelectedLayer(id)
```
- Activated or "highlighted" layers are now tracked in sandbox.getMap() object instead of core:

```javascript
    core.getAllHighlightedMapLayers() -> map.getActivatedLayers()
    core.isMapLayerAlreadyHighlighted(id) -> map.isLayerActivated(id)
    core._handleHighlightMapLayerRequest() -> map.activateLayer(id)
    core._removeHighLightedMapLayer() -> map.deactivateLayer(optionalId)
    core.allowMultipleHighlightLayers() -> map.allowMultipleActivatedLayers()
```

- Removed methods from core: _getQNameForRequest(), _getQNameForEvent(), findMapLayerFromAllAvailable() as they were not intended for external use.
- Removed request/event handling methods from core and sandbox: getObjectName(), getObjectCreator(), setObjectCreator() and copyObjectCreatorToFrom() as they were not intended for external use.
- Refactored core methods to Oskari global. Sandbox remains as it was, but calls these instead:

```javascript
    core.getRequestBuilder() -> Oskari.requestBuilder()
    core.getEventBuilder() -> Oskari.eventBuilder()
```

Note! sandbox.getRequestBuilder() was commonly used to check if the request is being handled:

```javascript
    var reqBuilder = sandbox.getRequestBuilder([regName]);
    if (reqBuilder) { ... }
```

Oskari.requestHandler doesn't check this. You should use sandbox.hasHandler([reqName]) instead.

```javascript
    if (sandbox.hasHandler([regName])) {
        var reqBuilder = Oskari.requestBuilder([regName]);
        ...
    }
```

Sandbox.getRequestBuilder() still works like before, but is deprecated and will be removed in a future release.

- Refactored sandbox methods (debug state can be asked by sandbox.debug()):
```javascript
    sandbox.disableDebug() -> sandbox.debug(false)
    sandbox.enableDebug() -> sandbox.debug(true)
```

#### Service refactoring
- MapLayerService moved from under sources to mapmodule.

#### Request/Event refactoring
- Moved files from under sources to mapmodule: MapMoveRequest, AfterMapMoveEvent, MapMoveStartEvent, MouseHoverEvent, AddMapLayerRequest, RemoveMapLayerRequest, RearrangeSelectedMapLayerRequest, AfterMapLayerAddEvent, AfterChangeMapLayerOpacityEvent, AfterRearrangeSelectedMapLayerEvent, AfterMapLayerRemoveEvent, AfterChangeMapLayerStyleEvent, MapLayerEvent, ChangeMapLayerOpacityRequest, ChangeMapLayerStyleRequest, AfterChangeMapLayerOpacityEvent, AfterChangeMapLayerStyleEvent
- ShowMapLayerInfoRequest moved from under sources to backendstatus as it is bundle specific request
- AfterShowMapLayerInfoEvent removed as backendstatus was the only user and it can react to request without the event.
- Removed FeaturesAvailableEvent as it's deprecated. Use MapModulePlugin.AddFeaturesToMapRequest instead.
- Removed deprecated CtrlKeyDownRequest and CtrlKeyUpRequest. These should be events if anything.
- Removed all other parameters from AddMapLayerRequest other than layer ID. Layer order is no longer affected by the boolean parameters when adding layers to map.
- DimMapLayerRequest and HighlightMapLayerRequest have been merged to a new request "activate.map.layer" that now has a boolean indicating activation/deactivation.
- AfterDimMapLayerEvent and AfterHighlightMapLayerEvent have been merged to a new event "map.layer.activation" that now has a boolean indicating activation/deactivation.

#### Marker handling changes
- AfterHideMapMarkerEvent was removed as it's no longer used and is misleading as it was used to notify markerlayer being hidden.
- HideMapMarkerRequest was removed as it's no longer used and is misleading. Use MapModulePlugin.MarkerVisibilityRequest instead.
- setMarkerVisible() and isMarkerVisible() in sandbox.getMap() has been removed as they are deprecated and misleading.
- marker flag in MapMoveRequest and AfterMapMoveEvent is no longer handled in any way (both had the flag, but it hasn't been handled in some time now. Value in event was always false)

### fullscreen

Map fullscreen mode now resetting when pressing reset view tools.

### statistics/statsgrid2016

Users can now edit indicator classification on geoportal views.
Publisher can define if classification can be changed on published map.
Grid component is no longer shown initially on startup.
Indicator listing from server can be partial and callback value for service.getIndicatorList() have been changed from array to object with the indicator array as "indicators" key:

```javascript
    {
        complete : false,
        indicators : [...]
    }
```

### divmanazer

#### DefaultFlyout

Improvements for sidetools buttons positions. Now sidetools are added to top and inside of flyout.
Now has a move(top, left)-function to relocate the flyout.

#### Popup

Popup width is now automatically restricted to map width.

#### ColorSelect

``New component`` to show a color selection.
```javascript
var colorSelect = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');

colorSelect.setColorValues([
    'ff0000',
    '00ff00',
    '0000ff',
    ['ff0000', '00ff00', '0000ff'],
    ['1b9e77','d95f02','7570b3','e7298a','66a61e','e6ab02'],
    ['ffffb2','fed976','feb24c','fd8d3c','f03b20','bd0026']
]);
```

Sets handler for color selection. Handler gives the selected color index.
```javascript
colorSelect.setHandler(function(selected){
    console.log('Selected index: ' + selected);
});
```

Change color select visualization.
```javascript
colorSelect.setUIColors({
    hover: 'FF0000', // menu hover background color
    selected: '00FF00', // selected background color
    menu: '0000FF' // menu background color
});
```

Select wanted color index.
```javascript
colorSelect.setValue(0);
```

Inserts the button to given element.

```javascript
var myUI = jQuery('div.mybundle.colorselect');
colorSelect.insertTo(myUI);
```

Removes the color select.

```javascript
colorSelect.destroy();
```


### core

Fixed Oskari.util.coordinateDegreesToMetric() and Oskari.util.coordinateMetricToDegrees() degree coordinates detection.

### routingUI

Now coordinates are rounded by current map projection definitions. Round rules are defined by current map units.

Special projection rounding conf added. Now the bundle configuration can contain projection specified rounding rules. For example:
```javascript
{
    "EPSG:4326" {
        "roundToDecimals": 4
    }
}
```

### infobox

Fixed action handling. Now action not handled if action property is not Array.

Fixed popup title height calculation when popup title is large text. Now title height calculation observe also popup additional tools.

### selected-featuredata

Fixed deprecated Oskari.app.getBundleInstanceByName() function usages.

Fixed popup keepPrevious handling.

Fixed result click handler for InfoBox.ShowInfoBoxRequest changes.

### coordinatetool

Fixed error handling when cannot transform coordinates to different projection in front. Now all input values are cleaned.

Improvements for inputs:
- allow use dot or comma for lon/lat fields

Improvements for showing coordinates:
- if conf not include round rules, then coordinate decimals is concluded for selected projection units.
- if conf not include format options, then degrees format is showed unit when selected projection is degrees unit.

No longer shows "Add Marker" button if markers are not supported in the Oskari instance.

### mapmodule ol2/ol3

Now transformCoordinates function checks srs and targer srs. If these projection definations missings throw error.

New ``getProjectionDecimals`` -function, this function returns wanted projection decimals. If wanted projection is not defined, then using map projection. Decimals concluded from projection units. Now 'degrees' units returns 6 and 'm' units returns 0.
For example:
```javascript
var mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
var mapProjectionDecimals = mapmodule.getProjectionDecimals();
console.log('Map projection decimals = '+mapProjectionDecimals);
var WGS84Decimals = mapmodule.getProjectionDecimals('EPSG:4326');
console.log('WGS84 projection decimals = '+WGS84Decimals);
```

New ``getProjectionUnits`` -function, this function returns wanted projection units. If wanted projection is not defined, then using map projection.
For example:
```javascript
var mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
var mapUnits = mapModule.getProjectionUnits();
console.log('Map projection units = ' + mapUnits);
var WGS84Units = mapModule.getProjectionUnits('EPSG:4326');
console.log('WGS84 projection units = ' + WGS84Units);
```

### myplaces2

Renamed name-attributes on forms to data-name since atleast Chrome removes the name-attribute if there is another element with the same name.

### system-message

New bundle for displaying status messages for the user.

### publisher2

Tools now have getAdditionalSize() which returns { width : 0, height : 0} by default. Tools can now tell if the map should be resized to make room for a tool.

Statsgrid specific code has been removed from publisher. The grid-component now uses getAdditionalSize() to request space for itself.

## 1.40.0

## myplaces2

Relaxed restrictions for allowed characters in myplaces features. Now (name, description and layer group) fields allows more non-ascii characters (field are sanitatized by Oskari.util.sanitize()).

## infobox

Updating existing infobox in mobile mode had timing problems and ended in javascript error and/or popup being closed instead of updated. This has been fixed.

### framework/postprocessor for ol2/ol3

Fixed nationalCadastralReferenceHighlight param handling for o2/ol3.
Now map is zoomed correctly to cadastral reference and highlight also working.

Example usage:
- make sure postprocessor bundle is part of the minified app (if using minified code)
- requires KTJ_KII_CHANNEL search channel
- open map with param nationalCadastralReferenceHighlight=[CODE]

### statistics/statsgrid2016

``New bundle`` to show thematic maps and their datas. This will replace the previous version of thematic maps.
The API has changed as well as the server interface. The implementation doesn't include all the features from
the previous UI, but it will be developed further in the near future to have most if not all the features of the
 old one and more. The previous version under statistics/statsgrid has been deprecated

Normal map mode:
- thematic map selections are now showed by Flyout
- user can select wanted parameters and regionset
- legend shows active indicator by ExtraFlyout
- can publish thematic map

Published map:
- new legend component, user can change active indicator for link (link is visible if there are more than one indicators)
- thematic map table is visible (if publisher wanted)

### coordinatetool

Added support for multiple search channel results for reverse geocoding.
TM35 channel support and localization.

Updated UI to show all degree values below to inputs (if projection chooser if configured to show and projection show format is degree).

### mapping/mapwfs2 - WfsLayerPlugin for ol3

Fixed wfs layer index calculation.

### divmanazer

#### Popup

Some popups were made modal so you have to close the current popup before launching a new popup in the same position.

#### ExtraFlyout

``New component`` to show a movable "window" similar to Defaultflyout. The rendering and position can be injected for the component.

#### grid

New ``setAutoHeightHeader`` function. If margin is given as function parameter the header column is resized automatically on render.

New ``setGroupingHeader`` function. Function can be used for grouping table columns under a shared header. Function takes a param array of objects. If array does not contains enought items to match the table columns the last header is spanned for the rest of the table columns.
For example:
```javascript
var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
// Set grouping headers
grid.setGroupingHeader([
    {
        cls: 'firstClass',
        text: 'First text'
        colspan: 3
    },
    {
        cls:'secondClass',
        text: 'Second text'
    }
]);
```

### mapmodule

Fixes for getClosestZoomLevel(min, max) function:
- If either parameter was missing the current zoomlevel was returned.
- Now uses the max/min scales of the map as default value for the missing parameter.
- Switched the parameter names since internally the first parameter (named maxScale) was treated as minScale and vice versa.
For the user this means that layers that only have one or the other restriction for min/max scale now works. Previously they didn't.

Added ol3 map following parameters and values for better user experience (map tiles are loaded faster):
- loadTilesWhileInteracting: true
- loadTilesWhileAnimating: true

### core/AbstractLayer

Fixed isInScale() when minScale was missing.

### admin-layerrights

Sends changed layerrights in chunks of 100 to the server if number of changed permissions is greater than 100.
Added checkboxes to toggle all permissions in one column.

### admin-layerselector

Now always sends a value for min/maxscale (-1 if missing) so server will update a removed value to the database.

### feedbackService

Bundle API changed with breaking changes. API still in POC-stage, but cleaned up a bit (see api/CHANGELOG for details). Also provides publisher tool for configuring
Open311-service for an embedded map.

## 1.39.0

### Migration for embedded maps

The oskari-server will migrate the publish template and all published maps from Openlayers 2 based maps to Openlayers 3 based maps.
See oskari-server/MigrationGuide.md for details.

*Note!* You will need to update the minifierAppSetup.json to reflect the new template. This can be used with the default setup:
https://github.com/nls-oskari/oskari/blob/master/applications/sample/servlet_published_ol3/minifierAppSetup.json

### IE 9 not supported

``IE9`` will not be a supported browser anymore.

### infobox

Fixed an issue where InfoBox.InfoBoxEvent was not sent on close when the map is in mobile mode.

### divmanazer/popup

Added code to prevent an infinite loop where popup.onClose() callback triggers another call to popup.close().

### admin-layerselector / wms ol2 and ol3

Implemented functionality to force YX axis order (=neu) for wms-layers for certain projections with ``reverseXY`` attribute JSON.

Example layer attribute configuration:
```javascript
  {
    'reverseXY': {
      'EPSG:3035':true
    }
  }
```

### metadatacatalogue

Updated the functionality of the "Limit the search area on the map" button.

### RPC - new request available

``MapModulePlugin.MapLayerUpdateRequest`` made available via RPC. With the request you can force redraw of layers or update any arbitrary layer parameters, such as a WMS layer's SLD_BODY.

Note! When OpenLayers3 is used, GET requests longer than 2048 bytes will be automatically transformed to async ajax POST-requests and proxied. Thus the service itself also has to support http POST-method.

OpenLayers2 will always use GET-requests and will fail, if the GET-request's length exceeds the allowed maximum.

```javascript
sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layerId, true, {
    SLD_BODY:
        '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
        '    <NamedLayer>'+
        '    <Name>oskari:kunnat2013</Name>'+
        '    <UserStyle>'+
        '    <Title>SLD Cook Book: Simple polygon</Title>'+
        '    <FeatureTypeStyle>'+
        '    <Rule>'+
        '    <PolygonSymbolizer>'+
        '    <Fill>'+
        '    <CssParameter name="fill">#000080</CssParameter>'+
        '    </Fill>'+
        '    </PolygonSymbolizer>'+
        '    </Rule>'+
        '    </FeatureTypeStyle>'+
        '    </UserStyle>'+
        '    </NamedLayer>'+
        '    </StyledLayerDescriptor>'
}]);
```

### Mapmodule

Mapmodule accepted a cached version of user location from the browser. Now it always tries to get a fresh location by default.

Registering a plugin with same name as an existing one triggers a warning to be printed out to dev console.

WmtsLayerPugin OL3 timing issues with layer ordering fixed.

### Action route calls caching workaround

IE is notorious for using cached XHR responses. To workaround the jQuery global setting has been included to attach a timestamp for each XHR.
This fixes an issue where for example admin bundles were not loaded correctly in IE after logging in.

### jQuery.browser checks removed

All jQuery.browser check are removed in preparation for jQuery update.

## 1.38.3

### statsgrid/publishedgrid

Layer is no longer saved in config as it was a bad idea in the first place, but also jQuery.extend() crashes on Chrome 53 when extended object has a circular reference.
Performance improvement when updating table values.
Openlayers 3 based maps now use single tile to render statistics to be consistent with Openlayers 2 ones.

## 1.38.2

### infobox

In mobilemode the overlay under popup is now semi-transparent instead of transparent to better indicate that the popup is modal.

### mapfull

Fixed statsgrid width checking when calculate map size.

### divmanazer/Popup

Draggable handle in popup has been changed to header (as in flyout) instead of the whole popup.

### findbycoordinates

Findbycoordinates now supports to show all search results.
- If only one result found then show it in infobox.
- If more than one results found, then open their to Oskari popup and add markers of all results.

### mapmodule

Fixed AddMarkerRequestHandler error when using shape 0 then default marker is used.

### core

- Fixed reference to markers variable
- Fixed default marker reference
- bundle.mediator now include instanceId in addition to bundleId

### sandbox

- Removed outside javascript file call

### Flyout tile modifications

All tiles has now own bundle id and intance id named class. Removed also tile id's.

## 1.38.1

### DrawPlugin.ol3

fixed area / line measurement, when the projection units are degrees

## 1.38.0

### DrawPlugin.ol3

Now measurement result cleared also when stopping drawing to sending ``DrawTools.StopDrawingRequest``.

### infobox ol2 and ol3

Fixed infobox title height if title contains long text. Now the title will increase the height to match text size.

### publisher2

URL for a terms of use page can now be configured in publisher2 conf (conf.termOfUseUrl).
If the value starts with 'http' the page is opened to a new window.
Otherwise GetArticlesByTag action route is used to fetch contents as before.

Fixed CoordinateTool config saving when using publisher2 template configs.

### core

- Fixed Oskari.util.isNumber to return false if checked value is null.
- Oskari.$('sandbox') has been removed - use Oskari.getSandbox() instead.
- Major internal restructuring of Oskari/src files.

### Deprecations and removals

- sandbox.printDebug/printWarn/printError() has been deprecated - use Oskari.log('MyComp').debug()/warn()/error() instead.
- core.printDebug/printWarn/printError() has been REMOVED - use Oskari.log('MyComp').debug()/warn()/error() instead.

### New functions

- ``Oskari.getDefaultMarker()`` function return default Oskari marker.
- ``Oskari.seq.nextVal()`` returns a rolling sequence number for each call. Optional parameter can be used to use/init another sequence ``Oskari.seq.nextVal('myseq')``.
- ``Oskari.util.coordinateMetricToDegrees()`` function convert metric coordinate to degrees (degree, minute and seconds).
- ``Oskari.util.coordinateDegreesToMetric()`` function convert degree coordinate to metric.
- ``Oskari.util.coordinateIsDegrees()`` function check is coordinate is degrees.

### Modifications

- ``Oskari.util.sanitize()`` Allows now target attribute.

### divmanazer

DotForm now use default marker for visualization if requested marker is not found.

Grid is now observable. It has on, off, trigger functions. Current events are triggered from clicking a column header.
Events sent are:
- ``column.selected`` with clicked columns/fields name as string payload.
- ``sort`` with a payload like { column : 'clicked columns/fields name', ascending : true }

Grid now allows to set tools for columns. These are given like:

```javascript
grid.setColumnTools('field name' [{
	name : 'Say hi',
	callback : function(value) {
		alert('Hello from ' + value);
	}
}]);
```

Grid has a new function for highlighting columns (no default style for selection):

```javascript
grid.selectColumn('column name');
```

Grid previously used field name as class for table headers. Now the name is processed to remove problematic characters before using as css class.

Grid can now be configured to scroll the content area *experimental feature* (true as param will follow element container size changes and recalculate the scrollable area height with interval)
```javascript
grid.contentScroll(true);
```

### mapmodule

``getWellknownStyle`` function now returns default Oskari marker(s) if wanted marker not found.

``registerWellknownStyle`` function now handles following scenarius:
- named style allready exists: merge styles and override exiting style if exist
- sanitized adding, remove unwanted tags, scripts, so on.

#### AbstractMapLayerPlugin

getOLMapLayers() now accepts Oskari layer id as parameter as well as the layer object.

#### MarkersPlugin

Sanitize request added markers.

#### VectorLayerPlugin ol3

Feature's style can be updated using ``MapModulePlugin.AddFeaturesToMapRequest``. Useful for highlighting the feature.

## 1.37.1

### mapwmts/WmtsLayerService ol2

Now support to reserve coordinate order if layer has configured ``reverseMatrixIdsCoordinates`` attribute JSON and this contains used matrixid property with true value.

Example layer attribute configuration:
```javascript
  {
    'reverseMatrixIdsCoordinates': {
      'matrixIdName':true
    }
  }
```

## 1.37.0

### jQuery selector removes more specific

Fixed jQuery selectors more specific for following bundles:
- integration/admin-layerselector
- framework/publisher2
- framework/divmanazer

### Infobox

Infobox content and title are now sanitized before adding them to DOM.

Streamlined InfoBox.ShowInfoBoxRequest handling. Id refers always to a specific popup.
If request is sent with the same id that already exists in UI, the existing one is updated:
- If location is the same, content is added to the existing popup
- If location is different, the existing popup is deleted and new popup is added with given parameters

### drawtools ol3

Some fixes made for displaying measure result on the map.

DrawingEvent now includes the sketch in geojson-parameter and isFinished-parameter is true when user finishes a geometry, not only when drawing is finished (relevant when drawing multi geometries). DrawingEvent shows area and length always in meters and unit is not shown anymore.

### routingService

Changed default routing markers offset properties from x and y to offsetX and offsetY.

### core

Added convenience method Oskari.getLocalized({ "en" : "name", "fi" : "nimi", sv : ""}, "xx"). It tries to find a localized text in object in this order:

- for requested language (as optional second parameter) or current language if there is no second parameter.
- for default language
- As last resort anything that has a value

Added Oskari.makeObservable(optionalTarget) function. Creates an eventbus with on, off, trigger functions and if parameter is given attaches the functions to parameter object. Always returns an observable object.

Oskari.app.setApplicationSetup() now setup markers for setMarkers() function. Markers have been moved from mapfull config to env-part of GetAppSetup response.

Oskari.util.sanitize() functionality has changed! Custom implementation has been replaced with DOMPurify (https://github.com/cure53/DOMPurify).
Now takes just one parameter as string and returns a string.

### mapfull

Fixed layers visibility in state handling.

### mapmodule

#### ol2 and ol3

Fixed custom svg marker handling when marker offset (x or y or both) has 0 or null.

Added support offset for external graphics.

Added new ``isSvg`` function to check at if data has svg.

Changed ``getSvg`` funtion to support new offsetX and offsetY params.

#### ol2  map scales

Map scales computation improved for earth CRS  e.g. EPSG:4326

Map scales computation in ol3 is/was correct for earth CRS

#### ScalebarPlugin ol3

Fixed scaleline width to match map units / measuring line results.

#### MarkersPlugin

``MapModulePlugin.AddMarkerRequest`` data changed. Also supported some time the old way add markers. See request documentation to see new/changed  params for request.

ol2 and ol3: Adding marker for external graphic now support offsetX and offsetY, what tell where 'center' point should be. Center point is calculated following ways:
- offsetX, calculated pixels from left to right. This is number.
- offsetY, calculated pixels from bottom to up. This is number.

### popupservice

New service under divmanazer, for creating popups in mobile mode as well as bookkeeping. Usable when all popups need to be closed when a feature is activated.

### Fixed z-index for functionalities

Fixed divmanazer flyout z-index.

Removed unneccessary z-index style: layerselection2, logoplugin and publishertoolbar

### publisher2

(x) icon exit behaviour improved. Exiting publisher with X-icon or cancel-button now do the same things.
Previously map controls were in the unstable state if publishing was canceled via (x) icon.

Embedded map name validator now allows more freedom in naming.

Publisher config can now include default configuration for tools selectable to embedded maps. Coordinatetool is the first one to utilize this to
 allow coordinate transformations to be included in embedded maps.

### mapwfs2

Mapwfs2 plugins now support different themes (used in publisher2).

### featuredata2

Featuredata2 plugin now support different themes (used in publisher2).

### mylocation

Changed toolstyles to use mobile icons and all different styles are now created by CSS style definations.

### coordinatetool

Coordinatetool now support different styles.

Coordinate transformation from one coordinate system to another can be added to the coordinatetool. Supported projections must be listed in bundle configuration.

Coordinate decimal separation is now done based on UI locale. For example finnish language uses comma and english uses dot.

### toolbar

When adding tool button with class suffix -dark or -light these icon themes not calculated. Use this if you want use for example only light icons.

### publishertoolbar

Fixed publisher toolbar preview so at toolbar show selected theme. Also disabled tools when previewing published map.

### Admin layerselector

SLD Style setup and management is added for wfs layers (versions 1.1.0 and 2.0.0) in admin layer selector.

CRS check is made agaist service, when new layer will be inserted into Oskari.  (*) is added to the layer title for to
show, that current map Crs is unsupported in the requested service.

## 1.36.4

### divmanazer/Popup

Popup moveTo now supports new ``center`` alignment.

### coordinatetool

If coordinatetool user interface is hidden (used RPC interface) then open tool popup to center of map.

### Markersplugin

Fixed state-parameters to not include # as part of color. This fixes links with markers and printing while markers on map.
Fixed an issue where clicking on map while marker popup was on screen resulted in application error.
Fixed an issue with %-character on marker label.

### mapfull

Fixed layers visibility in state handling - layer visibility is now shown correctly to user.

### LayerSelectionPlugin

Added scrollbars for layers list.
Fixed handling selected layers when changing mode from desktop to mobile.

### SearchPlugin

Search plugin no longer expects MarkersPlugin to be present.

### FeatureData

Is now properly hidden on initial UI when there are no WFS-layers on map.

## 1.36.3

### UserlayerPlugin.ol3

Check if scale limitations are used for layers. Previously assumed they were given. Detect if minscale equals maps max resolution and don't set limitation in such case.

### VectorLayerPlugin

More fixing for an issue where features removed with ``MapModulePlugin.RemoveFeaturesFromMapRequest`` reappear when
 adding new features with ``MapModulePlugin.AddFeaturesToMapRequest`` using priority option.

## 1.36.2

### MarkersPlugin

Fixed custom non-svg icons to work for markers.

### VectorLayerPlugin

ol2: Click events didn't propagate properly when vector features were added with ``MapModulePlugin.AddFeaturesToMapRequest`` to map for non-default layer. This has been fixed.

Fixed an issue where WKT geometries didn't work with ``MapModulePlugin.AddFeaturesToMapRequest``.

Fixed an issue where features removed with ``MapModulePlugin.RemoveFeaturesFromMapRequest`` reappeared when
 adding new features with ``MapModulePlugin.AddFeaturesToMapRequest`` using priority option.

### mapmodule/ol2

Feature-style with label alignment didn't work properly. This has been fixed.

### RPC

Domain validation simplified. Localhost is always allowed as domain and the protocol is no longer considered part of the validation.

## 1.36.1

### routingService

Added new marker_ferry, marker_flight, ferry_stop and flight stop routing markers. See /framework/routingService/instance.js.

### VectorLayerPlugin

ol2: Click events didn't propagate properly when vector features were added to map. This has been fixed.
ol2 & ol3: Fixed an issue where removed features were readded on map with new features.

### DrawPlugin.ol3

Measurement results are now shown after each new point in geometry. Previously shown based on hover which didn't work properly on touch screen devices.

### Flyouts in fullscreen mode

Flyouts no longer hide behind the map in fullscreen mode.

### featuredata 2

When moving from mobile mode to desktop, the flyout UI is resumed correctly.

### statsgrid/thematic maps in embedded maps

The legend/classification and map is now working correctly again.

### Zoombar

Normal desktop UI works correctly again.

### publisher2

Featuredata-tool enabled by default when wfs layers are present.

### infobox

Fixed mobile popup close.

### statehandler

No longer calls AddView action route on page unload.

### toolbar

Now you can define hover color and icon background color in bundle config.
Background color is only used now for selecting light or dark icon.

Example configuration:
```javascript
  colours: {
     hover: '#ff0000',
     background: '#ffffff'
  }
```
Configured colors are only used when ``Toolbar.ToolbarRequest`` add operation data not contains these configs.

*Notice that att all icons are not specified light or dark icons. This icons are showed only dark style. For example marker-share, tool-feature-selection and tool-print.*

### Admin layerselector

Fixed an issue where grouplayers couldn't be created.

### publisher2

Fixed toolbar error when changing theme.

### Mapmodule ol3

Rotation has been disabled since we don't provide means for controlling/resetting the rotation. We will add functionality to enable and control rotation for ol3 in a future release.

### Oskari.util.sanitize

Now accepts second parameter as boolean correctly.
Now accepts content as string or Element.
Now in addition to emptying textContent for Element also removes src, link and href attributes from the element.

## 1.36

*This release has major changes for mapmodule, mapmodule plugin handling, application icons, application loading, build script and much more. There might very well be issues when
updating to custom Oskari installations. Please read the release notes and ping us on for example Slack or with a Github issue if there's problems.*

Known issues:

- featuredata is sometimes visible even when there are no wfs-layers on map
- moving between mobile/desktop modes might have some issues
- publisher: the iframe code for embedded map is not always selectable
- publisher: adding myplaces draw tools on embedded map no longer works (also not supported on openlayers3 yet) (

### Mobile mode

The mapmodule now handles map size (and changes to it) more visibly. It creates a container for plugin UIs on top of the map that is hidden when in "desktop mode". When
the device is detected as mobile client or map size is small enough (max 500x400px) the map calls for plugins to redraw the UI in "mobile mode". This happens by calling
 the redrawUI() for any plugin that is registered on the mapmodule and has such a function. Mapmodule provides an extra toolbar and a container for plugins to use in "mobile mode".

#### Mapmodule plugins and redrawUI()

Plugin UI rendering/starting has been changed (affects any plugin extending BasicMapModulePlugin). It only calls to setEnabled and setVisible:

    this.setEnabled(blnEnabled);
    this.setVisible(blnVisible);

If getElement() doesn't return an element setVisible(true) calls a new function redrawUI(blnUseMobileMode, blnForced) which is responsible for renderering the UI.
The default implementation for redrawUI calls createControlElement() that was previously part of the startPlugin() implementation and doesn't do much else.
Functions redrawUI() and startPlugin() can now return a boolean true to meaning that it couldn't render it's UI and it should be retried at a later time.

Plugins using the default implementation in BasicMapModulePlugin don't do anything after the initial redrawUI call.
Any plugin that supports mobile mode should override the default redrawUI() to move it's UI to a "mobile mode" meaning a more compact UI in the plugin container or adding
 a button to the mobile toolbar that can be used to open a larger ui in a popup on top of the map. There are additional functions to help registering the toolbar buttons on
 BasicMapModulePlugin like addToolbarButtons().

If a plugin supports mobile mode and requires toolbar bundle for it, but toolbar isn't available when the plugin is started the redrawUI should return with boolean true value
 signalling that is needs another attempt to create the UI. If the second parameter for redrawUI() is a boolean true, the plugin should make any effort possible to create it's UI
 even if it means creating the desktop UI in mobile mode. This is in a case when all the bundles of the application has been started and toolbar has not been part of the
  application/is not available. Another call to redrawUI() is done by mapmodule for any plugin that returned true from previous redrawUI call(). The call is done when the
  toolbar has loaded.

RedrawUI() is also called when the mapsize changes from mode to another or on any other occasion when the UI needs to be redrawn (style change etc). It should teardown any UI it
 has created before recreating another version of the UI.

Calls to redrawUI() are done in orderly fashion. Plugins are sorted by values from plugin.getIndex() function or if no such function exist the plugin is treated as having a large index value.

### Default iconsets for applications

Oskari now has a default icon set and applications no longer need to provide the icons-folder. Applications may provide icons-folder to add or override icons in the default set.
The default set is located in Oskari/resources/icons and precompiled sprite/css (icons.png/icons.css) is located in Oskari/resources. These can be copied under application folder
 so development shows correct icons. Running the minifier/build under tools will rewrite the icons.png/icons.css for the build (under dist-folder).

The following cleanup can be done for applications using the default base-styles and iconset:

1) remove Oskari/applications/xxx/yyyy/icons folder

2) remove Oskari/applications/xxx/yyyy/images folder

3) remove forms.css and portal.css from Oskari/applications/xxx/yyyy/css folder
- move any application specific css from for forms.css/portal.css to overwritten.css if any
- forms.css and portal.css styles can be linked from Oskari/resources/css

4) copy icons.css and icons.png from Oskari/resources to Oskari/applications/xxx/yyyy/
- you can also not copy them and link css from Oskari/resources/icons.css if you don't have any icons to add/override
- `npm run sprite` can be executed under tools to create new default iconset

See https://github.com/nls-oskari/oskari-server/blob/develop/MigrationGuide.md#application-changes-to-jsp-files for more info about JSP/html changes.

### Oskari core and require.js

#### Require.js

Oskari/bundles/bundle.js now includes require.js (2.2.0) with the text-plugin (2.0.14).
The minifier build script changes any file checking `typeof define === 'function'` so that the minified version doesn't evaluate define to be present and as a result
 no require.js error about "Mismatched anonymous define() module" should appear when running the minified code.
If you run into errors the modification is done in the grunt task "compile".

Any module that previously loaded require.js "manually" should no longer do so (namely the admin-layerselector in Oskari).

#### Oskari application loading

Oskari.app.startApplication() takes an optional callback to be called when application has been started, but no longer provides any parameters for the callback.
Previously returned an undocumented startupInfo object. The custom script loader has been replaced with require.js. Error handling has been improved for startApplication()
and any problems loading the scripts will be logged to the developer console. The loader can be found in the file src/loader.js and debug logging can be enabled by calling
Oskari.loader.log.enableDebug(true) for the logger initialized by the loader. Debug-logging includes messages about loaded bundles with paths and started bundles.

Any files linked to bundles with packages/.../bundle.js that provide AMD functionality (check for existance of define function) should be flagged with "expose" on bundle.js.
 This will expose the module from that file as a global variable with the name of the expose flag like this:

    {
        "type": "text/javascript",
        "expose" : "ol",
        "src": "../../../../libraries/ol3/ol-v3.14.2-oskari.js"
    }

The loader loads the file from libraries/ol3/ol-v3.14.2-oskari.js and since it's AMD-compatible it's assigned to window.ol (as specified in bundle.js "expose" statement).
Most of Oskari files just register through the Oskari global so this is something that's required mostly for libs. Most of the files also expect libraries to be present as
globals.

Oskari.setPreloaded([boolean]) is now deprecated and has no effect. Remove references to it as it will be removed in the future.
If the loader detects that a bundles code is already in the browser it won't load it again.
Oskari.setLoaderMode([string]) now only effects if value is 'dev'. This results in timestamp being added to any file url that is downloaded to force new versions of files.
This will propably change to some more intuitive flag in the future.

Oskari.app.setApplicationSetup() now tries to setup configuration and environmental information like language, supported locales and decimal separators. They are part of the
response from GetAppSetup action handler. This means that it's no longer needed to call setLang() setConfiguration() etc manually.

Added an experimental function to directly load appsetup and start the application from an url with parameters:

    Oskari.app.loadAppSetup(ajaxUrl + 'action_route=GetAppSetup', { uuid : 'qwer-qtweqt-asdf-htr' });

You can also provide a function as third parameter that is an error handler. It will be called if there is a problem loading the appsetup.

#### Logger

Added a logger implementation that can be accessed with (see src/logger.js for details):

    Oskari.log('LogName').info('My info message');

#### Oskari util functions

Added sanitize function to Oskari.util for escaping html or specific tags. Usage:

     // handles content as text content
     var element = sanitize('<script>alert("testing")</script>');
     // handles content as html, but removes script-tags
     var anotherElement = sanitize('<div> <div>qwer <script> alert("asdf")</script>zxcv</div></div>', true);
     // handles content as html, but removes script and style tags
     var stylishElement = sanitize('<div> <div>qwer <script> alert("asdf")</script>zxcv</div><style> body { display:none }</style></div>', ['script', 'style']);
     jQuery('body').append(element).append(anotherElement).append(stylishElement);

Oskari.util.naturalSort has been added to /Oskari/bundles/bundle.js. It's used to sort arrays for natural.
Oskari.util.getColorBrightness has been added to /Oskari/bundles/bundle.js. It's used to check at is color dark or light. Function returns 'dark' or 'light'.
Oskari.util.isDarkColor has been added to /Oskari/bundles/bundle.js. It's used to check at is color dark. Function returns true/false;
Oskari.util.isLightColor has been added to /Oskari/bundles/bundle.js. It's used to check at is light dark. Function returns true/false;
Oskari.util.isMobile has been added to /Oskari/bundles/bundle.js. It's used to check at is map in mobile mode.

#### Application lifecycle events

Oskari now has on(name, function), off(name, function) and trigger(name, payload) functions for application events:

        Oskari.on('bundle.start', function(details) {
            // started bundle with bundleid "details.id"
        });
        Oskari.on('bundle.err', function(details) {
            // error starting bundle
        });
        Oskari.on('app.start', function(details) {
            // details contain started bundleids and possible errors that happened
        });

#### maplayer-service

When loading maplayers the service sends the map srs with parameter "srs". Previously used parameter "epsg".
Most of the other ajax-calls use "srs" so this is a consistency improvement.

#### AbstractLayer

getAttribute() now takes an optional param which can be used to get a value from attributes:

    layer.getAttribute('attributeName');

### tools

The Oskari core (the file Oskari/bundles/bundle.js) can now be built from multiple files under Oskari/src.
This is in preparation for the core rewrite/restructuring/clarification.
The build includes requirejs with it's text plugin from under libraries.

Upgraded build-tools with new dependency versions.
Tested to work with [Nodejs 5.3.0, 5.7.0 and 5.9.0](https://nodejs.org/en/download/stable/).
Remove/rename Oskari/tools/node_modules folder and run npm install in Oskari/tools before running the minifier.

### infobox

Openlayers 2 and openlayers 3 code unified: infobox bundle is now located under mapping including code for both ol2 and ol3.

Infobox-functionality is modified to allow displaying infobox in mobile mode as Oskari.userinterface.component.Popup when screen size is smaller than the defined mobile breakpoints.

ShowInfoBoxRequest is modified to allow giving multiple additional parameters (hidePrevious, colourScheme, font) in one options-object. Request now allows giving mobileBreakpoints as one parameter. MobileBreakpoints mean the size of the screen in pixels to start using mobile mode. It is now also possible to define links and buttons to infobox content and give them information that is shown in InfoboxActionEvent when link/button is clicked.

Now Infobox can be showed to added marker. ShowInfoBoxRequest is modified to allow give marker id where popup is showed.

The relative position of the infobox to the coordinates on the map can now be provided in options, so the infobox is displayed either over, under, to the left or to the right of the given position. Note! Only OL3!

```javascript
    {
        //display the popup on top of the coordinates given. Possible values: top, bottom, left, right
        positioning: 'top'
    }
```

Also, the background- and textcolour of buttons and textcolour of action links can now be provided as part of the colourScheme-object in options.

```javascript
    colourScheme: {
        buttonBgColour: '#00CCDD',
        buttonLabelColour: '#00F000',
        linkColour: '#DD0000'
    }
```

### toolbar

Openlayers 2 and openlayers 3 code unified: toolbar bundle is now located under mapping including code for both ol2 and ol3.

#### Toolbar.AddToolButtonRequest

New configuration params:
- activeColour: button active background colour
- toggleChangeIcon: toggle change button icon. Is this setted true, icon class is calculated for added activeColour

#### Toolbar.ToolbarRequest / add

New configuration params:
- disableHover: disable or not  toolbar buttons hover
- colours, this can be used to configure toolbar colours. Now only supported hover colour.

### abstractmapmodule

!! ``registerWellknownStyle``, ``getWellknownStyle`` and ``MapModulePlugin.RegisterStyleRequest`` will be changed by breaking backwards compatibility, DO NOT USE !!

New function ``registerWellknownStyle`` and ``getWellknownStyle``. These functions are currently used to register wellknown svg markers to mapmodule and get marker SVG by name.
They will be changed so that a full style can be registered with a name that can be used as reference on further styling instead of providing the whole style object whenever adding features.

New ``MapModulePlugin.RegisterStyleRequest`` request, it's used when adding new wellknown style to mapmodule. See example /framework/routingService/instance.js.

``GetSvg```function now handles also wellknown markers. Shape object must then include key/name attributes. Key is wellknown markers name and name is marker name. Optional shape object can contains color attribute, which is used change colors of these svg classes 'normal-color' or 'shading-color'. Shading color is calculated from color (darkened).

### mapmodule ol2/ol3

Fixed getStyle function size handling. When adding featurecollection then svgmarker size is now calculated correctly.
SVG marker improvements. Fixed svg image positioning so at Oskari calculate svg image position when adding marker.

### Openlayers 3 mapmodule

Openlayers 3 implementation of mapmodule now offers a new function getScreenshot().
The function produces a dataURL for PNG-image from the map contents.
This is an experimental feature and requires support from maplayers that are on the map (cross-origin use must be allowed).
The function returns an empty string if the dataURL can't be produced. A warning print is logged to console in such case.

### Openlayers 3 layerplugins

Layers can now be configured to have a crossOrigin attribute. This is passed to the Openlayers layer source enabling reading the canvas data.
This is required for layers that will need to be used for the new getScreenshot() functionality.
When using oskari-server add the crossOrigin value to the layers that support it in `oskari_maplayer` tables `attributes` column:

    {
      "crossOrigin" : "anonymous"
    }

You should check that the layer tile requests have the `Access-Control-Allow-Origin` header properly configured before configuring the layer.
If the layer doesn't provide the header the layer tiles will NOT load and the console shows an error message like this:

    Image from origin 'http://where.tiles.are.loaded' has been blocked from loading by Cross-Origin Resource Sharing policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://oskari.instance' is therefore not allowed access.

### openlayers 3 version update

Updated openlayers version in published maps from 3.11.2 -> 3.15.1

### openlayers 3 custom build configuration files created

Openlayers 3 build configuration files are located under tools/conf/ol3. To create custom build of ol3, use ol-custom.json and ol-custom-debug.json files in build script.

NOTE! ol-custom.json doesn't have support for statistical functionality!

### mapfull

Fixed map layer opacity change in published maps when resetting map state to published state.

### selected-featuredata

*New bundle!* Selected-featuredata allows infobox opening in new flyout.

### rpc

Now makes a new getScreenshot() function available when using mapmodule supporting it (only Openlayers3 implementation supported currently).

New function ``getPixelMeasuresInScale`` (Get pixel measures in scale) available for plotting paper size print area on a mapcurrently).
http://oskari.org/examples/rpc-api/rpc_example.html  (only Openlayers3 implementation supported currently).

New functions to zoom map: zoomIn, zoomOut, zoomTo. All return the current zoomlevel after zooming.

### markers

Marker icons are now defined in mapfull conf in svgMarkers property. We are working toward easily customizable markers in Oskari and this is one step in that direction.
The server components do not yet support custom markers and have their own source for marker shapes. This might still change when we finalize the server side
 (myplaces, analysis, custom wfs etc) marker styling.

Array contains objects which tell following info:
- x: image center point in pixels (starting left to right)
- y: image center point in pixels (starting bottom to up)
- data: marker svg. Marker must be 32 x 32 pixel size.

For example:
  {
      x: 14.06,
      y: 5.38,
      data: '<svg width="32" height="32"><path fill="#000000" stroke="#000000" d="m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0" /></svg>'
  };

### feedbackService [new, this is POC for time being and will be develop future on]]

One new event and 4 new requests

FeedbackResultEvent notifies that feedback request response has been got from the service. Includes the response data.

Used to notify if getFeedbackRequest, postFeedbackRequest, getFeedbackServiceRequest or getFeedbackServiceDefinitionRequest was successful
 and the response data has been got from the service.

Look at http://oskari.org/examples/rpc-api/rpc_example.html and RPC api documentation in details.

### routingService

Added default routing markers/icons. See /framework/routingService/instance.js.

### divmanazer/ui-components

Removed Raphael library from package.

### divmanazer/visualization-form

Removed Raphael dependencies from DotForm, AreaForm and LineForm. Make dot, line and area previews without Raphael library.

### publisher 2

Language selection in publisher no longer affects the map preview, but the preview will be displayed using the application's default language.

### integration/admin-layerselector

"resolveDepth" attribute setup added for WFS 2 layers in admin layer selector. Default is false.
ResolveDepth solves xlink:href links in GetFeature request.

### framework/search

Fixed search result table sorting when columns contains word and numbers.

### divmanazer/grid

Fixed table sorting when columns contains word and numbers.

### mapwfs2 / manual refresh

Extra warning added to the user, when there is no manual refresh wfs layers visible or not in scale.

### featuredata2 / manual refresh

Feature data is not emptied for the manual refresh layer, when map is moved.
In this case grid opacity is changed to 0.5 for to see that the user must push refresh-button for to get valid values.

### coordinatetool

Added funtionality to configure and display What3words code for the current coordinates in map click and in mouse move pause.

Display is false by default.

Configure coordinatetool bundle config in default view in portti_view_bundle_seq table for to get w3w displayed.

    {
    "isReverseGeocode" : true,
    "reverseGeocodingIds" : "WHAT3WORDS_CHANNEL"
    }


### statehandler and publishedstatehandler

State management improved, because of bugs in published view / previous state selector and in normal view

### metadata flyout

New tab containing misc functionalities (actionlinks, list of layers associated with the metadata)

### timeseries

Increased default animation speed from 2000 ms to 4000 ms. Also made possible to adjust animation speed. For example configuration:
```javascript
    // Adjust timeseries animation speed to 3000 ms
    {
        animationSpeed: 3000
    }
```

### tampere/conter-editor

New bundle ``content-editor`` available for wfs layer editing (wfs-t). Look at oskari.org / Adding functionalities

### divmanazer/FilterDialog  & analysis/AnalyseService
A modification in the request of describe WFS feature type.
&simpe=true request paramater is added to get similiar response as before.

### statistics/statsgrid.polymer (experimental)

New bundle thats having a poc for using Polymer (https://www.polymer-project.org/1.0/) based functionality for statsgrid/thematic maps. It's work in progress and lacks errorhandling and ui-tuning. Not production ready and subject to change or removal in the future.

## 1.35.2

### mapping/mapwfs2 - WfsLayerPlugin for ol2/ol3

Fixed map move so at this not send twice setLocation request.

## 1.35.1

### mapwmts

Fixes an issue with wmts-layers when proxying the layer on OL3. Previously used the url from capabilities, the fix is to use the one provided by oskari-server as layer url so we can override the url with a proxied one. With OL2 this works correctly even before this.

### myplaces2

All toolbar buttons were removed if measuretools config was not given. Fix so it only affects the additional measure tools instead of all buttons.

## 1.35

### catalogue/metadataflyout

Metadataflyout is now stateful.

### myplaces2

Myplaces adds own measuretools only if configured so:

    {
      measureTools:true
    }

### elf/metadataflyout

*New bundle!* ELF metadataflyout bundle overrides catalogue/metadataflyout functionalities.

### catalogue/metadatagatalogue

Added data identification date and type to metadata search results.

### elf/elf-license

Added license general descriptions.

### See Oskari/api/CHANGELOG for following changes:
- RPC getAllLayers function now returns also minZoom and maxZoom if those are defined for layer.

### infobox

Fixed InfoBox.ShowInfoBoxRequest handling. Now all popups with no popup id really deleted if hidePrevious param is setted to true.

Added new "InfoboxActionEvent" that notifies which link/button is clicked in the infobox.

Link handling improvements on Openlayers 2 version. Links in infobox should no longer propagate to map to trigger new GFI requests.
If you need to bind a clickhandler for an infobox element use a-tag with class "functional" and stop propagation on the clickhandler itself.
The functional-class is a sign that event propagation should NOT be stopped <a class="functional"></a>.

### coordinatetool

Added funtionality to change the projection the map is displayed in, when the application supports multiple projections.

### divmanazer/grid

Fixed grid header style when column class name contains span word.

### core

Oskari.VERSION can now be used to detect the frontend version number.

### published map (ol3)

Fixed analysislayer's and userlayer's visibility issue in published map

### framework/admin-users

Added user email to editable.

### framework/findbycoordinates

Now displays multiple results if available.

## framework/featuredata2

Now featuredata2 flyout not updated when opened again if map is not moved / zoomed.


### mapping/mapwmts_ol3

Fixed WmtsLayerService IE 9 capabilities formatting.

### RPC

Removed libraries/OskariRPC/*. The client now has it's own repository here: https://github.com/nls-oskari/rpc-client

JSChannel-dependency updated. This requires new RPC-client to work (version 2.0.0).

New function added getFeatures(). See bundle documentation for details.

New request included in defaults "MapModulePlugin.ZoomToFeaturesRequest".

New function added getInfo(clientVersion). See bundle documentation for details.

New event included in defaults "InfoboxActionEvent".

New event included in defaults "InfoBox.InfoBoxEvent".

New request included in defaults 'InfoBox.HideInfoBoxRequest'.

### mapping/mapmodule/plugin/vectorlayer

New request added 'MapModulePlugin.ZoomToFeaturesRequest' that zooms to extent of all or specific features on the specified layers (only for ol3).

Added functionality to provide a label text to vector features with the style object. See [api/CHANGELOG.md](api/CHANGELOG.md) for details (ol2 and ol3).

### mapmodule - LayerSelectionPlugin

Now LayerSelectionPlugin handle small screen (width is smaller than 500px) so at layer(s) selection component use full screen.

*Improved UI* First displayed in the background map selection and then the other.

### drawtools/ol3  - POSSIBLE BREAKING CHANGES!

DrawingEvent now returns drawed geometry as GeoJSON-object (before it's returns geometry as stringified GeoJSON-object).

'showMeasure' parameter is renamed to 'showMeasureOnMap' (if true - measure result will be displayed on map near feature. Default is false.)

New parameter is added to plugin: 'selfIntersection'. (if true - user will see warning text if polygon has self-intersection. Default is true.))

### core

`Oskari.clazz.create()` now checks if a constructor returned value of a class instance to be used instead of normal processing. This might cause issues with inheritance so use with caution.
SearchService uses this to check if one has already been registered to sandbox and returns the registered instance instead of self if so.

### sandbox

`getAjaxUrl()` now takes an optional route params so code like `sb.getAjaxUrl() + 'action_route=MyRoute'` can now be replaced with `sb.getAjaxUrl('MyRoute')`

### core/maplayerservice

MapLayerService now takes sandbox and url as constructor arguments (previously url then sandbox). Url is now optional and will default to
sandbox.getAjaxUrl('GetMapLayers') + '&lang=' + Oskari.getLang().

### mapfull

Now initializes the search service so it's available to be used by requests even if there's no UI for it.
This is something that will most propably be moved out of mapfull in Oskari2 with view migration provided to enable the same functionality.

### search/search service

`Oskari.mapframework.bundle.search.service.SearchService` is now `Oskari.service.search.SearchService`.
The files for the `SearchService`, `SearchRequest`, `SearchResultEvent` has been moved from bundles/framework/search/service to bundles/service/search.
The SearchService now handles SearchRequests.
The SearchService now takes an optional sandbox argument. If given it checks if another SearchService has been registered to sandbox and returns
it if so. If not it registers self and starts handling SearchRequests.
The searchUrl can now be given as an optional second parameter. Previously it was the only parameter.
Url defaults to sandbox.getAjaxUrl('GetSearchResult') if sandbox is given and url is not.
This means that all bundles creating SearchServices use the same instance if they give the sandbox argument.
SearchService will now trigger SearchResultEvent whenever search is done.

### search bundle

The Search bundle was restructured so the default search ui is now separated file/class and flyout handles the tabbing and default UI if tabbing is not needed.
The bundles default UI now handles the UI side of search and uses SearchRequest and SearchResultEvent to make the searches.

### mapmodule/user location

getUserLocation() has been added to mapmodule. It takes a callback which will receive lon and lat params with user location or no params if location query was denied/unsuccessful.

GeoLocationPlugin and MyLocationPlugin has been modified to use the new function.

MyLocationPlugin.GetUserLocationRequest is now handled by the mapmodule so it's no longer needed to have MyLocationPlugin as part of the setup to get the user location.

### admin-users

Fixed user search when one or many of these user data values  is not defined:
- user name
- firstname
- last name

Fixed error handling when cannot get roles from backend.

### mapwfs2

Folder mapping/mapwfs2_ol3 has been renamed to mapping/mapwfs2.
Code from framework/mapwfs2 has been moved to mapping/mapwfs2 and all Openlayers2 specific files have been renamed to have .ol2.js-postfix.
Lots of duplicate code has been removed.

WFSRefreshManualLoadLayersEvent is now included in ol3 version as well and changing the size of the map no longer results in JS-error.
Layer visibility information is now included in init-message to enable disabling queries to services that are visible to user.
This fixes an issue where initially hidden WFS-layer was shown to the user. Now the layer is correctly hidden and any queries to the service are prevented while it's hidden.

### drawtools/ol3 and VectorLayerPlugin

Now use mapmodules getStyle() to parse the style JSON.

### mapmodule - ControlsPlugin/ol3

Now only handles DrawingEvents that have measuretool ids so drawing can be used for more things than measuring.

### infobox

Popup not show anymore dublicate info.

### Mapmodule consistency - POSSIBLE BREAKING CHANGES!

Renamed functions
- _calculateScalesFromResolutions() removed. Use _calculateScalesImpl() instead.
- _createMap() and _createMapImpl() removed. Use createMap() instead. Also the function no longer has side-effects and returns the created map implementation.
- _addClickControl() renamed _setupMapEvents().
- _getMapCenter() removed. Use getMapCenter() instead.
- _updateDomainImpl() removed. Use updateDomain() instead.
- panMapToLonLat()/moveMapToLanLot() removed. Use centerMap() instead.
- panMapEast()/panMapWest()/panMapNorth()/panMapSouth() removed. Use panMapByPixels() instead.
- zoomIn()/zoomOut() removed. Use adjustZoomLevel() instead.
- zoomTo() removed. Use setZoomLevel() instead.
- getLayerPlugin() removed. Use getLayerPlugins(id) with id parameter to fetch reference to single plugin.
- getMapScales() renamed getScaleArray() to be consistent with getResolution()/getResolutionArray().
- calculateResolution() and calculateScaleResolution() renamed getResolutionForScale().
- getPluginInstance() removed. Use getPluginInstances(pluginName) with pluginName parameter to fetch reference to single plugin.

Unused functions removed:
  - _ensureExists()
  - getProjectionObject()
  - _createBaseLayer()
  - getExtentArray()
  - getMapViewPortDiv()
  - getMapLayersContainerDiv()
  - _getMapLayersByName()
  - getMapLayersByName()
  - getMapElDom()
  - centerMapByPixels()
  - moveMapByPixels()
  - _setLayerImplIndex()
  - _removeLayerImpl()
  - _setLayerImplVisible()
  - _setLayerImplOpacity()
  - getLayerDefs()
  - getLayers()
  - getLayersByName()
  - getZoomForScale()
  - getStealth()
  - setStealth()
  - notifyAll()
  - calculateLayerMinMaxResolutions()

Added functions so internal references don't need to be called:
- getMapElementId()
- getCurrentExtent()
- getStyle() takes a json presentation of style and returns matching ol2/ol3 style object for plugins to use
- getUserLocation() takes a callback which will receive lon and lat params with user location or no params if location query was denied.

addLayer() function now takes a second parameter. If not given or false adds the layer on top of the layer stack, if true adds the layer to the bottom of the stack.

Userlayer, analysislayer, wmslayer plugins for both ol2 and ol3 have been updated to take advantage of the AbstractMapLayerPlugin baseclass provided by mapmodule.

### mapping/mapmodule/plugin/vectorlayer

Both ol2 and ol3 implementations of VectorLayerPlugin have been added to following features:
- allow define minScale to feature, this is checked only if zoomTo option is used. For example: {minScale: 1451336}
- allow define mouse over cursor for added feature (added cursor option handling). Add the wanted cursor to MapModulePlugin.AddFeaturesToMapRequest options, for example: {cursor: 'zoom-out'}
- allow define features prio order. Highest number is showed on top and lowest to under. Add the wanted prio to MapModulePlugin.AddFeaturesToMapRequest options, for example: {prio:1}
- allow define layers and their styles from config. Defined layer style is used when feature not contains own style. If layer or feature style is not defined then using default style. For example configuration:
```javascript
    {
        "layers": [
            {
                "id": "EXAMPLE1",
                "style": {
                    "fill": {
                        "color": "#ff00ff"
                    },
                    "stroke": {
                        "color": "#ff00ff",
                        "width": 3
                    },
                    "text": {
                        "fill": {
                            "color": "#0000ff"
                        },
                        "stroke": {
                            "color": "#ff00ff",
                            "width": 4
                        }
                    }
                }
            }
        ]
    }
```

NOTE! Some implementation specific (ol2 vs. ol3) differences might occur. For instance, OpenLayers2 has only one fill color for all kinds of geometries whereas in ol3 separate fill can be defined for points and areas.

```javascript
            "style": {
                //ol2 all-around fillcolor, ol3 just polygons
                "fill": {
                    "color": "#ff00ff"
                },
                //in ol2 this fill not used, ol3 uses for filling points
                image : {
                    radius: 4,
                    fill : {
                        color : 'rgba(0,255,0,1)'
                    }
                }
              }
```

### publisher2

Removed unneccary code:
- setMode functions, because plugin tool handles allready own visibility/style when using mobile or desktop size map

Bugfixes when disabling / enabling statsgrid or classification in publisher

Fixed a bug in toolbar's allowed locations (drag & drop)

Replaced mobile / desktop - preview size settings with predefined (fill, small etc.) iframe size settings.

Fixed a bug in publisher resizing when windod is resized

Fixed a bug with saving / showing published maps with light theme

## 1.34.1

### mapmodule/ol3

Fixed scale calculation on ol3 mapmodule to match the ol2 version. Layers are now visible on same zoom levels on both implementations (layer min/maxscale limits).

### Proj4js/proj4 handling

Fixed Proj4js/proj4 handling to work OL3. Deleted packages/openlayers/startup.js file because it is not needed anymore.

### mapping/mapmodule/plugin/getinfo

Fixed my places layer title.

### mapping/myplacesimport - UserLayersLayerPlugin.ol3

Opacity is now set correctly when layer is added to map.
Layers are loaded as a singletile to speed up the loading.

### mapping/mapanalyse - AnalysisLayerPlugin.ol3

Opacity is now set correctly when layer is added to map.
Layers are loaded as a singletile to speed up the loading.

### mapping/mapwfs_ol3 - WfsLayerPlugin for ol3

Opacity is now set correctly for highlighted features.

### mapping/mapwmts

Visibility is now set to Wmts layer.

### infobox

Only prevent event-propagation if target is not a link. Event-propagation is stopped so map doesn't get click events
when clicking the info-box. However without this fix links on infobox don't work.

### publisher2

Default tools in map publishing are now defined in PublishMapEditorRequestHandler and those default values are used if the PublishMapEditorRequest doesn't include any data about published map to edit.

Tools check themselves if they should be enabled when editing published map. Function isEnabled() can be used to ask this from tools.

### indexmap

Indexmap is now shown above the icon to avoid the problem with indexmap on the left to be rendered behind the icon.


## 1.34

### mapmodule-plugin/zoombar

Added mobile styled zoombar buttons. Mobile styled icons showed when map height is smaller than 500 px.

### mapstats

Changed references from set/getWmsName() -> set/getLayerName() to use the inherited property from AbstractLayer.

### OskariRPC 1.1 version for client library

Functions are now generated depending on the configuration of the providing platform (allowed functions configuration). This means that any calls made to remote functions
are available only after the connection to map has been established. This enables better errorhandling, but means that function calls will result in "is not a function" errors
if called before connection is established. An onReady()-hook has been added where you can check the available functions:

    // init connection
    var channel = OskariRPC.connect(
        elements.iframe,
        IFRAME_DOMAIN
    );
    var blnFunctionExists = typeof channel.getAllLayers === 'function'; // -> false
	channel.onReady(function() {
	    var blnFunctionExists = typeof channel.getAllLayers === 'function'; // -> true
	    channel.getAllLayers(function (data) {
	    	console.log(data);
    	});
	});

Changes to 1.0.0:
- added onReady callback to detect when we have a successful connection
- removed hardcoded RPC-functions that might be disabled on Oskari instance
- functions are now generated based on what's available in the Oskari platform the client connects to.
  This means you can be sure the map is listening if the client has it (after onReady-triggers).
- added default errorhandler to make it clear when an error happens. Used when custom errorhandler is not specified.
- added enableDebug(blnEnabled) to log some more info to console when enabled.
- Changed handleEvent to enable multiple listeners.
- handleEvent can no longer be used to unregister listener.
- Added unregisterEventHandler() for unregistering listeners (previously done with handleEvent without giving listener function).
- Added log() for debug logging without the need to check if window.console.log() exists
- function-calls can now have parameters as first argument. Use function parameters wrapped in an array as first argument. First argument istreated as a success callback instead if it's type is a function.

Filename change for original OskariRPC.js:
- Oskari/libraries/OskariRPC/OskariRPC.js is now Oskari/libraries/OskariRPC/OskariRPC-1.0.0.js

### rpc

Allowed functions/events/requests are now configured as an array ["AfterMapMoveEvent", "MapClickedEvent"] instead of an object { "AfterMapMoveEvent" : true, "MapClickedEvent" : true }.
Reduced configuration for adding new functions - all available functions are now allowed if not explicitly restricted.

New functions enabled by default:
- 'getMapBbox' gets current map bbox
- 'resetState' resets the map to initial state (location/layers etc)
- 'getCurrentState' returns a JSON presentation of the map state (location/layers etc). Usable with useState() as parameter.
- 'useState' sets the map to given state (location/layers etc). Parameter should be given as returned by getCurrentState()

New events are enabled by default:
- 'UserLocationEvent' notifies about users geolocation status
- 'SearchResultEvent' notifies about users that SearchRequest response data is available for to handle
- 'FeatureEvent' notifies about add, remove, click events on features

New requests are enabled by default:
- 'MyLocationPlugin.GetUserLocationRequest' requests to get user geolocation
- 'SearchRequest' requests search result for requested search item using Oskari search channels

Domain validation fixed to accept urls with - or _ characters.

Changed error messaging from "event/request_not_allowed" to "event/request_not_available".
Available events/requests are now checked when RPC-bundle starts and those which aren't technically available/part of the appsetup will be removed from the "supported events/requests" listings.
Note that this requires RPC to be started after any bundle offering RPC-enabled events/requests to work correctly (so all events/requests have been loaded and handlers registered for requests before the check).

### Mapmodule consistency - POSSIBLE BREAKING CHANGES!

In an effort to make Openlayers 2 ja 3 mapmodule API consistent some functions have been renamed:
- Both: _getMapZoom() -> getMapZoom()
- Both: _transformCoordinates -> transformCoordinates() also coordinates parameter is now an object with lat & lon keys and return value is an object with lat & lon keys
- OL3: _getCurrentScale() -> _getMapScale()
- OL2: getNumZoomLevels() -> getMaxZoomLevel()
- OL3: getZoomLevel() removed as it's the same as getMapZoom()
- Both: moveMapToLanLot() -> moveMapToLonLat()

MapClickedEvent.getLonlat() now returns an object with lon and lat keys instead of Openlayers.Lonlat in OL2 or coordinate array in OL3.
Fixed mapmodule.isValidLonLat() to use max extent as reference instead of hardcoded EPSG:3067 values.

Both ol2 and ol3 implementations of AddFeaturesToMapRequest / AddFeaturesToMapRequestHandler have been changed to take only geometry and options as their parameters. Also both implementations of VectorLayerPlugin have been changed accordingly. i.e.

The old way:
sandbox.postRequestByName(rn, [geojson, 'GeoJSON', null, null, 'replace', true, style, false]);

Now:
sandbox.postRequestByName(rn, [geojson, {
    layerId: 'ANALYSIS_VECTOR',
    clearPrevious: true,
    layerOptions: null,
    centerTo: false,
    featureStyle: style,
    attributes: null
}]);
- layerId: If left out, a generic vector layer is used by VectorLayerPlugin.
- clearPrevious: whether to clear out all previous features
- layerOptions: additional layerOptions
- centerTo: whether to zoom in to the features
- featureStyle: style of the features
- attributes: additional attributes of the features
(geometryType from the old call has been removed. From now on the VectorLayerPlugin will determine geometry type from the geometry)

An event named 'FeatureEvent' is emitted when features are added, removed or clicked. The event holds features as an array of objects with feature id, geojson and layer id as content.

#### Oskari.mapframework.domain.Map

Sandbox.getMap().getBbox() no longer returns the Openlayers.Bounds or ol but an object with top, bottom, left, right keys

To fix your code using calls like 'sandbox.getMap().getBbox()' in Openlayers 2:

	var bbox = sandbox.getMap().getBbox();
	var bounds = new Openlayers.Bounds(bbox.left, bbox.bottom, bbox.right, bbox.top);

In Openlayers 3:

	var bbox = sandbox.getMap().getBbox();
	new ol.extent.boundingExtent(bbox.left, bbox.bottom, bbox.right, bbox.top);

### mapwmts

Layer order fixed in Openlayers map, when wmts layers on url parameters or in selectedLayers or in published view
Opacity is now set for wmts layer, when added to map

### File location changes

Moved most of the files under Oskari/bundles/framework/mapmodule-plugin/ to Oskari/bundles/mapping/mapmodule to be used as common
 resources instead of copy/pasting code/css/images.
The Openlayers 2 mapmodule from framework/mapmodule-plugin/ui/module/map-module.js is now in mapping/mapmodule/mapmodule.ol2.js.
The Openlayers 3 mapmodule from mapping/mapmodule-plugin_ol3/ui/module/map-module.js is now in mapping/mapmodule/mapmodule.ol3.js.

Files under Oskari/src/mapping/mapmodule have been moved to Oskari/bundles/mapping/mapmodule/.
Removed most other files under Oskari/src and Oskari/srctest since they are not used.
Renamed the remaining Oskari/src to Oskari/deprecated to signify these shouldn't be used.

## 1.33.2

AbstractLayer.getLegendImage() now returns the legend of current style if available. Fallback to base legendImage if style legend is not available.
AbstractLayer.selectStyle() no longer overwrites the base legendImage information.

## 1.33.1

### admin-layerselector

Added a missing label for "Selected time" field (WMS-T).
Fixed: Legendimage field shows a proxy-URL if layer requires credentials. Now shows the correct URL for legendimage.

## 1.33

### publisher2

The new publisher is production ready. Check out the migration guide under Oskari server on how to migrate to the new publisher.

### Sandbox/map layer service

Fixed getNewestLayers(count) method to find really newest layers.

## Layer plugins

Fixed map layers handling when layer is not visible. Get layer image only then if layer is visible.

Fixed following plugins:
- 'WmsLayerPlugin'
- 'WfsLayerPlugin'
- 'MyPlacesLayerPlugin'
- 'StatsLayerPlugin'
- 'ArcGisLayerPlugin'
- 'UserLayersLayerPlugin'
- 'AnalysisLayerPlugin'

### routingUI

Now start and end points are markered on the map. Also all route plan(s) are shown on search results. Fixed error handling.

### routingService

Support OpenTripPlanner response format. Sends RouteSuccessEvent with route plan, success and request parameters.

### statsgrid

Now adds the indicator tab UI for user content/personaldata even if started after personaldata bundle.

### Default view functionality

Added functionality to mark a saved view as a default view.

### mapfull

Fixed map content width. Now navigation, zoombar, XY etc. tools are visible also on smaller screens.

Fixed map layers handling when layer is not visible. Get layer image only then if layer is visible.

### map-module

Added a new request 'ShowProgressSpinnerRequest' that shows / hides a progress indicator on the map. The request is by default enabled in rpc.

### mapmodule-plugin/MarkersPlugin

Added marker transient property, if this is setted to true then marker is not saved to state.

### core/maplayer-service

No longer generates an empty default style for WMS-layers.

### analysis

Improvements in analysis methods:

Aggregate layout and z-index fixes in no storage case


### divmanazer/grid

Changes in formating numeric values in grid (max 2 digits in decimals and handle grid value as string when beginning with "0"

### publisher2

Added LayerSelectionTool. This tool user can add map layer tool on the map. User can also select visible baselayers.

### framework/mapwmts and mapping/mapwmts_ol3

WmtsLayerService no longer parses rest url template from capabilities, but relies on server providing it.
This enables proxying for WMTS-layers that use resourceURL and require credentials.

### libraries/moment

Added Moment library for date/time presentation formatting.

### rpc

New event is enabled by default:
- 'RouteSuccessEvent' notifies at a routing has getted response

New request is enabled by default:
- 'GetRouteRequest' requests to get route plan from routeService

### admin-layerselector

Now initializes the legendimage from style correctly when adding layers.

## 1.32.1

### integration/admin-layerselector

Fixed legend url handling for layers that need credentials.

### WMTS-layers

Since adding WMTS-layer to map is now an async operation, workaround for visibility/opacity setting has been implemented.
This needs further development for mapmodule to handle async layers properly, but for now it works.

## 1.32

### catalogue/metadataflyout

Added configurable ISO 1913139 XML or Print -links hiding. Defaults showing links. Configuration is done by adding the following information to a bundle config:

    {
        hideMetadataXMLLink: true,
        hideMetaDataPrintLink: true
    }

### map-module

Modified styles not display error pink tiles (where is CSS olImageLoadError-class). Also added configurable OpenLayers IMAGE_RELOAD_ATTEMPTS and onImageLoadErrorColor.

Added mapclick handling.

### mapmodule-plugin/plugin/controls/OskariNavigation.js

Removed mapclick handling because this breaks publisher featuredata functionality.

### sample/servlet

Modified minifierAppSetup.json to also include coordinatetool -bundle.

### admin-layerselector

Added support for time values for WMS layers. The available time values are stored in layer attributes and the selected time value can be passed to GetMap requests through layer parameters. Added a field to the admin UI for selecting the desired time value.

### mapwmts

WMTS support has been refactored to enable better Openlayers 3 support.
Requires backend functionality with action route 'GetLayerCapabilities' that takes the layer id as parameter('id')
 and returns the layer capabilities in XML format.

#### Changes to classes:

*Oskari.mapframework.wmts.domain.WmtsLayer*
setWmtsName -> setLayerName
getWmtsName -> getLayerName
addWmtsUrl -> addLayerUrl
getWmtsUrls -> getLayerUrls
getUrl -> getLayerUrl
getRequestEncoding/setWmtsCaps/getWmtsCaps -> *removed*

*Oskari.mapframework.wmts.service.WmtsLayerModelBuilder*
Heavily refactored since capabilities are no longer parsed here

*Oskari.mapframework.wmts.service.WMTSLayerService*
Currently responsible for loading capabilities and creating the WMTS layer object for the map engine.

### coordinatedisplay

Added possibility to configure how many decimals coordinates are rounded. If not configured then using zero decimals.

### coordinatetool

Added possibility to configure how many decimals coordinates are rounded. If not configured then using zero decimals.

Fixed map double click handling, now when double clicked map the coordinate textboxes are updated map centeer values (if show mouse coordinate is not checked).

### mapwfs2

Wfs layer rendering is improved. Improvements also made in the backend Transport service for this item

### Analysis  / aggregate method

Resultset content format is changed in backend. There is now one record for each property with aggregate function values.

Resultset was earlier one record with json attributes.

## 1.31.2

Fixed a bug when saving a view with statsgrid on

## 1.31.1

Removed console.log() calls.

## 1.31

### admin

The generic admin bundle now has a request to add functionality in tabs. This is done by sending a request with name 'Admin.AddTabRequest'.

### metrics

Initial version for a metrics display for admins. Adds a tab for the admin bundle to show metrics gathered by the serverside functionality.

### tools

Locked karma version to 0.12.31 since it works while not specifying a version doesn't.

### analyse

Added possibility to show aggregate analyse results in popup without saving the analyse layer.

Added possibility to use aggregate method with spatial join.

### coordinatestool

*New  bundle!* Add new tool to show or set coordinates. Tool can present mouse move coordinates or map click coordinates to lon and lat inputs. You can also write your coordinates and then center map here.

### routingUI

*New bundle(POC)!* Adds new tool for giving parameters to route and requests route with parameters. Listens RouteSuccessEvent to render route and instructions.

### routingService

*New bundle (POC)!* Gets route from the service with parameters got from UI. Sends RouteSuccessEvent with geoJson and route instructions.

### VectorLayerPlugin

Vector layer plugin fixed so that more than one feature can be added at once to the layer.

### divmanazer/visualization-form

Improved checkbox selection, now custom color selection can be done with clicking label.

### Admin layerselector

New checkbox "manual refresh" for WFS layer, when inserting new layers to Oskari environment

### WFSLayerPlugin

Manual refresh event for manual refresh of wfs layers.

Event is trigged when pushing "Feature Data" button or when pushing "Refresh" button.

"Refresh" button is invisible, if there are no manual-refresh layers in selected map layers.

Manual refresh layers are not rendered automatically on a map

### layerselecton2

New "refresh" icon besibe "close" icon, if layer is manual-refresh layer.

Manual-refresh layer is rendered when clicking the icon.

### layerselector2

Improved checkbox selection, now layers can be selected/unselected by clicking layer name.

Added filter buttons on each tabs. User can now filter layers.

Now not show group if group has not any layers.

Renamed AddLayerListFilterRequest to ShowFilteredLayerListRequest.

### maplegend

Added currently selected style name as a sub header for legend flyout.

### layerselector2/AddLayerListFilterRequest

*New request!* Adds new filter buttons and functionalities to layerlist.

### publisher2

Added GetInfoTool. GetInfoTool has now colour schema selection on extra options.

PanelMapSize renamed to PanelMapPreview. PanelMapPreview allow select map preview mode in two different modes (mobile/desktop).

### mapmodule-plugin/MapModule

Added getMaxExtent function. This return max map extent.

### Sandbox/map layer service

Added new getNewestLayers(count) method to find newest layers corresponding to given count.

### WMSLayerPlugin/WMTSLayerPlugin

Real time layers are now shown with current time parameter.

## 1.30.4

Userguide styles and analysis localizations fixed.

## 1.30.3

ReleaseNotes updated

## 1.30.2

Gfi responses of type text/html now allows br-tags

## 1.30.1

Couple of debuggers deleted.

## 1.30

### highlight and feature selection renewed

On the normal map mode feature is highlighted only when Ctrl is down, otherwise feature info is shown.
When feature selection is made with selection tool, Ctrl will add features to selection. Feature info is never shown at the same time with selection.

#### mapwfs2/service

Mapwfs2 has now new service called WFSLayerService, which handles WFS layers' states, for example selected features, top WFS layer, selected WFS layers etc. Service should be used always when setting selected features, selection mode etc.

Mediator uses now WFSLayerService for setting highlighted features.

#### featuredata2/PopupHandler

Selection tool stays selected unless user clicks the tool again to unselect it or selects another tool.

renderSelectionToolButtons -function can be used to add selection tools to any container.

#### analyse

Selection tools are now available in analyse panel and they use the same functions as toolbars selection tools.

Selection can be made only from the selected layer, and only one layer can have selections at a time.

### divmanazer

DefaultFlyout now has a close() function which closes the flyout.
DefaultFlyout now onOpen() and onClose() functions that are called when flyout is opened/closed.

### applications

oskari.org application has been removed as the sample/servlet application is the same thing.

### tools

Gruntfile reconfigured to use applications/sample/servlet as default application (instead of paikkatietoikkuna.fi).
Added shortcut to build script: 'npm run build' and examples for build-paikkis, build-asdi and build-elf.
Release assumed path with Oskari/bundles with capital O when copying resources, now it works with oskari/bundles as well.

Known issue with frontend build and Grunt: The used grunt-sass doesn't work on node.js 0.12.x. It works with (atleast) 0.10.x versions.

### core/sandbox

Fixed sandbox.createURL(url). If the param url didn't include the domain part the port was included twice.
Sandbox.createURL(url, true) now takes a second parameter that can be used to prepare the querystring part of the URL.
Sandbox.findRegisteredModuleInstance() now returns all registered modules if name parameter is not given (for debugging purposes).

Fixed sandbox.syncMapState(blnInitialMove, mapModule). If mapModule param is defined then calculate max zoom level there. If not then used default 13 max zoom level.

### admin-layerselector

Fixed theme or organization locale inputs when adding new group.

### toolbar

Fixed the link tool to get path from browser if not provided in configuration.

Removed default print tool as it requires backend support that hasn't been available in preconstructed views. One should use
the printout bundle with corresponding backend implementation instead to get proper print functionality.

### mapmodule-plugin/MapModule

Added getMaxZoomLevel function. This return max OL zoom level.

### mapmodule-plugin/LogoPlugin

The logo is now a link to the map service even if configuration is not provided. Uses browser location by default.

### mapmodule-plugin/VectorLayerPlugin/AddFeaturesToMapRequest

Fixed centerTo parameter handling.

### myplacesimport

If GDAL cannot determine CRS from the data, the import now assumes the current maps CRS (previously assumed EPSG:2393).

### mapfull

Fixed setState syncMapState function call to add mapmodule param.

## 1.29

### rpc

New events are enabled by default:

 - 'AfterAddMarkerEvent' notifies a marker was added and includes an id for the marker
 - 'MarkerClickEvent' notifies a marker being clickd and includes the id of the clicked marker

Now always allows messages from origin starting with 'http://localhost' to help with developing features.
Prints warnings if RPC messages come from other than allowed origins.
GetLayers-call now returns the layers UI-name in addition to id, opacity and visibility.

### publisher2

*New bundle!* This is the first step of the refactoring of publisher. It is not yet ready for use!

### analyse

Analyse parameters panel has now info buttons for parameter labels.

### core

User now has an getAPIkey() function. Parsed from user data returned by GetAppSetup.

Oskari.util has been added to /Oskari/bundles/bundle.js. It holds generic helper-functions that are used
throughout Oskari code:

    - isNumber()
    - isDecimal()
    - decimals()
    - hexToRgb()
    - rgbToHex()

### analysis

Now adds the PersonalData tab correctly if started after PersonalData bundle. Previously expected to be started before PersonalData.

### admin-layerselector

Fixed theme or organization locale labels when adding new group.

### admin-users

Fixed admin-users bundle user search.

### catalogue/metadatagatalogue

Improvements in show metadata coverage. Icons changes and now active metadata coverage is showed different icon.

### coordinatedisplay/CoordinatesPlugin

Moved plugin location to bottom of MyLocationPlugin.

### divmanazer/Button

Added blur and isFocus functions.

### divmanazer/Grid

Sort improved for non numeric values.

Improvements in Excel/csv export
("only selected features" option, metadata request url, expanding object column values, type conversion in values)

### divmanazer/Popup

Now checks correctly buttons focuses.

### elf/elf-license

In successfully license conclude now shows same information popup as concluded license.


### featuredata2/Flyout

Sort improved for non numeric values.

### featuredata2/PopupHandler

Unfocusing popup buttons.

### mapmodule-plugin/BackgroundLayerSelectionPlugin

Fixed to show selected background layer.

### mapmodule-plugin/SearchPlugin

Now handles zoomScale in search results correctly.

### mapmodule-plugin/MarkersPlugin

Removing single marker is now possible with 'MapModulePlugin.RemoveMarkersRequest'.

Modifying a marker is now possible by sending 'MapModulePlugin.AddMarkerRequest' with the same id and different values:

    Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest',[{x : 385868, y : 6671782, color: "ffde00" }, 'Marker1']);
    Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest',[{x : 385868, y : 6671782, color: "ff0000" }, 'Marker1']);

Removed possibility to attach eventlisteners to markers since it didn't work correctly. Planning to generate a MarkerClickedEvent on clicks that can be used for interaction.

MarkerClickEvent is now sent when a marker is clicked. Id of the clicked marker is sent with the event.

### mapmodule-plugin/MyLocationPlugin

Moved plugin location to top of CoordinatesPlugin.

### mapwfs2

Fixed highlight error when user has highligted and unhighlighted feature and then moved map (the feature appears again highlighed).

Now prefers using APIkey from sandbox.getUser().getAPIkey() instead of JSESSIONID cookie as session info. Fails fast on init if session info
is not available and backs down on tries to reconnect to prevent spamming messages.

Now buffers messages until init is completed. After init success, sends out the buffered messages.

## 1.28.1

### heatmap

Now works correctly when there are no weighted properties.

### publisher

No longer assumes a LogoPlugin being present in the main map.

### featuredata2

Error handling improved for missing DOM-elements.

## 1.28

### Generic

Cleaned up deprecated code/bundles. Removed:

    - bundles/deprecated/*
    - bundles/framework/featuredata/*
    - bundles/framework/mapwfs/*
    - sources/deprecated/*
    - packages/framework/bundle/featuredata
    - packages/framework/bundle/mapwfs

### tools

Added script shortcuts for linting and trimming trailing spaces from bundles. Run `npm run trim` and `npm run lint` respectively.

### framework/heatmap

*New bundle!* Adds heatmap functionality to layers configured to support it (WMS-layers only at the moment). Configuration is done by adding the following information to a layers JSON:

    {
        attributes : {
          geometryProperty : "the_geom",
          layerWorkspace : "ows",
          heatmap : ["properties to use", "as heatmap weighted property"]
        }
    }

SelectedLayers bundle will show heatmap-enabled layers with an additional "Heatmap" tool in the layer frame to access the functionality. Note! Generated SLD expects Geoserver as the WMS-service.

### divmanazer components

Popup.createCloseButton('label') label parameter is now optional. Popup now uses button component
Oskari.userinterface.component.buttons.CloseButton and sets the button title if label is given.

Fixed VisualizationForm open issue when form is opened second time after that when it's closed by pressing Cancel button.

### mapwfs2

ModelBuilder no longer assumes featuredata2 is present in the application setup. Feature data tool is not added to layers by default.

Added a statushandler to keep track of requests in progress and errors. Still work-in-progress and can change completely.
To enable debug messages in developer console run:

    Oskari.__debugWFS = true;

To get the tracking info in developer console run:

    Oskari.___getWFSStatus();

Now limits setLocation calls to single layer/request when triggered by 'MapLayerVisibilityChangedEvent' (using config.deferSetLocation=true).

New event WFSStatusChanged is sent when layer update is requested/completed/resulted in error.

### featuredata2

Adds 'Feature Data' tool for any layers that are capable of showing it (WFS-based layer types).

Now shows a status indicator for layers (loading/error) based on WFSStatusChanged event (sent by mapwfs2).

### layerselection2

Now handles MapLayerEvent with type 'tool' and updates the selected layers tools accordingly.

### analysis/analyse

Analysis now supports do geometry filter.

### framework/maplegend

Now handles only these layers where have a legend url and also it can be loaded succesfully. Informs the user if any legend images will not be displayed.

### framework/mapmodule-plugin

bringToTop() now supports buffer as a second parameter. Buffer adds this integer value to layer z-index. If parameter is not set then using default 1;

### framework/mapmodule-plugin  - FeatureDataPlugin

Fixed plugin locale handling.

### framework/mapmodule-plugin  - LogoPlugin

Fixed plugin locale handling.

### framework/mapmodule-plugin  - MarkersPlugin

Fixed at Markers layer stays on top of map layers.

### framework/mapmodule-plugin  - MyLocationPlugin

Fixed plugin locale handling.

### framework/mapmodule-plugin - SearchPlugin

Now supports zoomScale in search results.

### framework/publisher

Fixed tools states when changing language.

### elf/elf-lang-overrides

*New bundle!* This bundle is used to override default locales in ELF application.

### elf/elf-license

*New bundle!* Extends metadatacatalogue search to show user license information. User can unconclude/conclude license to it self.

### elf/elf-language-selector

Hardcodings removed and now uses the configured supported languages.

### integration/admin-layerselector

Management of ArcGis93-type maplayers (Rest feature layer type) in Oskari maplayer configuration
Inserting/editing/removing ArcGisRest-layers in admin-layer UI.

### core

#### localization handling

Oskari.getLocalization() now supports language as a second parameter. Notice that the locale still won't be loaded automatically.

Oskari.registerLocalization() now supports override languages a second parameter. Locales are merged to each other.
Notice that at this not override old locales, so if you want override default locales the language override bundle need start first.

#### AbstractLayer

AbstractLayer: if name, description, Inspire theme and organization is missing for users language the default language version is used.
AbstractLayer now checks for duplicates before adding tools.
Added new Object-typed field for generic layer attributes (setAttributes()/getAttributes()).

#### default language

Oskari.getDefaultLanguage() no longer crashes if supported locales are not set. Returns Oskari.getLang() in such case.

#### MapLayerService and MapLayerEvent

New method added to service addToolForLayer(layer, tool) for adding tools for layers. Signals other components with
MapLayerEvent typed as 'tool' about the updated layer.

MapLayerService now parses attributes from layer JSON.

### framework/admin-layerrights

Fixed layer table breaking when layer name is short.

### framework/personaldata

Personaldata bundle supports now logInUrl configuration.

LogInUrl config can be a:
* string, when using this login url for all languages
* object, when try to get current locale log in url. If not found then using default locale.

```javascript
// Example 1. String logInUrl configuration.
{
    "conf" : {
        "logInUrl": "/web/en/login"
    }
}

// Example 2. Object logInUrl configuration.
{
    "conf" : {
        "logInUrl": {
            "en": /web/en/login",
            "fi": /web/fi/login",
            "sv": /web/sv/login"
        }
    }
}
```

### framework/userguide

Renamed function Flyout.getUserGuideTabs() to Flyout.getUserGuides().

Can now be configured with alternative flyout implementation that will get content from server based on
configured tags (defaults to "userguide"). Includes current language as a tag if includeLang is
configured as true (defaults to false).

    {
        "conf" : {
            "flyoutClazz": "Oskari.mapframework.bundle.userguide.SimpleFlyout",
            "tags" : "userguide",
            "includeLang" : true
        }
    }


### catalogue/metadatagatalogue

Show metadata coverage on the map tool is added to Metadatacatalogue search results.

Metadatacatalogue bundle now requires vectorlayer plugin to be in use in frontend.

### core/abstractmapmodule

GetImageUrl() always return now '/Oskari/bundles' folder location.

### arcgis

New layer type `arcgis93layer`  (ArcGis93Layer.js) for ArcGis REST server layer (feature, group)

### framework/mapmodule-plugin/plugin/getinfo

Get feature info support for `arcgis93layer`

### framework/mapmodule-plugin/plugin/vectorlayer

Added handling for two *new requests* (MapModulePlugin.AddFeaturesToMapRequest and MapModulePlugin.RemoveFeaturesFromMapRequest).

### framework/mapmodule-plugin/plugin/vectorlayer/MapModulePlugin.AddFeaturesToMapRequest

Added support to add features to map. Supported formats are 'WKT' and 'GeoJSON'

Features can be added via requests as follows:

```javascript
var reqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.AddFeaturesToMapRequest');
if (reqBuilder) {
    var layer = null,
        layerJson = {
            wmsName: '',
            type: 'vectorlayer'
            isQueryable: false,
            opacity: 60,
            orgName: 'Test organization',
            inspire: 'Test inspire',
            id: 'Test layer',
            name: 'Test layer'
        },
        style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']),
        mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService'),
        vectorlayer = mapLayerService.createMapLayer(layerJson);

    style.pointRadius = 8;
    style.strokeColor = '#D3BB1B';
    style.fillColor = '#FFDE00';
    style.fillOpacity = 0.6;
    style.strokeOpacity = 0.8;
    style.strokeWidth = 2;
    style.cursor = 'pointer';

    // Example 1 add features on the map and also create layer to selected layer list and also map layers list
    var request1 = reqBuilder(
        'POLYGON ((199519.8148320266 7256441.554606095, 199519.8148320266 7779004.414678753, 614614.2197851419 7779004.414678753, 614614.2197851419 7256441.554606095, 199519.8148320266 7256441.554606095))',
        'WKT',
        { id: 1},
        vectorlayer,
        'replace',
        true,
        style,
        true
    );
    this.sandbox.request(this.getName(), request1);

    // Example 2 Shows only features on the map
    var request2 = reqBuilder(
        'POLYGON ((199519.8148320266 7256441.554606095, 199519.8148320266 7779004.414678753, 614614.2197851419 7779004.414678753, 614614.2197851419 7256441.554606095, 199519.8148320266 7256441.554606095))',
        'WKT',
        { id: 1 },
        null, // no layer specification --> not add layer to selected layer list and map layers list
        'replace',
        true,
        style,
        true
    );
    this.sandbox.request(this.getName(), request2);
}
```

### framework/mapmodule-plugin/plugin/vectorlayer/MapModulePlugin.RemoveFeaturesFromMapRequest

Added support to remove features to map.

Features can be removed via requests as follows:

```javascript
var reqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.RemoveFeaturesFromMapRequest');
if (reqBuilder) {
    var layer = null,
        layerJson = {
            wmsName: '',
            type: 'vectorlayer'
            isQueryable: false,
            opacity: 60,
            orgName: 'Test organization',
            inspire: 'Test inspire',
            id: 'Test layer',
            name: 'Test layer'
        },
        mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService'),
        vectorlayer = mapLayerService.createMapLayer(layerJson);

    // Example 1 remove all features from the map
    var request1 = reqBuilder(
        null,
        null,
        vectorLayer
    );
    this.sandbox.request(this.getName(), request1);

    // Example 2 Removes selected features from map
    var request2 = reqBuilder(
        'id',
        1,
        vectorLayer
    );
    this.sandbox.request(this.getName(), request2);
}
```

### sample/tetris

*New bundle!* Created new easter fun "tetris" bundle. This bundle add new Tile and Flyout for playing tetris game.
You can start this bundle also in sample applications in Oskari/applications/sample/tetris/index.html

### Folder structure changes

Preparing for version 2 of the changes, please change your bundles to following folder structure.

```
<your root dir>
|--bundles
|  |--<mynamespace>
|     |--<bundle-identifier>
|           |--instance.js
|           |--resources
|           |  |--css
|           |  |  |--style.css
|           |  |--images
|           |  |  |--image.png
|           |  |--locales
|           |      |--en.js
|           |      |--fi.js
|           |      |--sv.js
|           |--scss
|              |--style.scss
|--packages
|  |--<mynamespace>
|     |--bundle
|        |--<bundle-identifier>
|           |--bundle.js
```

#### Migration Guide (Preparing for version 2 of changes)
* Create `<bundle-identifier>` folder under the `bundles/<mynamespace>` folder
* Move all files and folders in `bundles/<mynamespace>/bundle/<bundle-identifier>` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Delete `bundles/<mynamespace>/bundle/<bundle-identifier>` folder
* Delete also `bundles/<mynamespace>/bundle` folder if it's empty
* Create `resources` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Move all files and folders in `resources/<mynamespace>/bundle/<bundle-identifier>` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources` folder
* Delete `resources/<mynamespace>/bundle/<bundle-identifier>` folder
* Delete also `resources/<mynamespace>/bundle` folder if it's empty
* Check all stylesheet files under the `bundles/<mynamespace>/<bundle-identifier>/resources/css` folder at the images paths are correct (`../images`)
* Create `locale` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources` folder
* Move all files in `bundles/<mynamespace>/<bundle-identifier>/locale` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources/locale` folder
* Delete `resources/<mynamespace>/bundle/<bundle-identifier>/locale` folder
* Create `scss` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Move all files and folders in `bundles/<mynamespace>/bundle/<bundle-identifier>/scss` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Delete `bundles/<mynamespace>/bundle/<bundle-identifier>/scss` folder
* Fix all bundle file locations on the `packages/<mynamespace>/bundle/<bundle-identifier>/bundle.js` file
** JavaScript files: `bundles/<mynamespace>/<bundle-identifier>/..`
** Locale files: `bundles/<mynamespace>/<bundle-identifier>/resources/locale/..`
** CSS files: `bundles/<mynamespace>/<bundle-identifier>/resources/css/..`

#### Grunt tool

Grunt tool has been modified to support folder structure changes.

## 1.27.3

GetInfoPlugin now handles it's config correctly again.

## 1.27.2

Fixed statistics classification plugin so that it is shown only when statistic layers are shown.

## 1.27.1

Fixed a broken locale file: bundles/framework/bundle/layerselection2/locale/fi.js had an extra comma.

## 1.27

### admin-layerselector

Fixed JavaScript alerts and confirm dialogs to use Oskari.userinterface.component.Popup.

### core/user

User loginName has been renamed as email. User.getLoginName() is still available and if user object doesn't get the email property, loginName is used instead. However loginName should be considered deprecated and email should be preferred.

### findbycoordinates

*New bundle!* Creates a service and a user interface for searching nearest address on a map and adds a button to the toolbar for reverse geocode search. Requires server side functionality.

### featuredata

Fixed feature selection popup to show only one popup when clicking tool again.

### featuredata2

Fixed feature selection popup to show only one popup when clicking tool again.

### metadatacatalogue

Metadatacatalogue can now be show extra action element in search results list. This functionality need to be actived AddSearchResultActionRequest.

### metadatacatalogue/AddSearchResultActionRequest

Added support to show extra action element in metadatacatalogue search results list.

Action element can be added via requests as follows:

```javascript
var reqBuilder = this.sandbox.getRequestBuilder('AddSearchResultActionRequest');
if (reqBuilder) {
    var data = {
        actionElement: jQuery('<a href="javascript:void(0)"></a>'),
        callback: function(metadata) {
            console.log('Get license information');
            console.log(metadata);
        },
        bindCallbackTo: null,
        actionTextElement: null
    };
    var request = reqBuilder(data);
    this.sandbox.request(this.getName(), request);
}
```

### mapwfs2/WfsLayerPlugin

Highlighting of border features is fixed in map move event.
Ctrl-select of Wfs features is fixed (no duplicate features allowed any more)


## 1.26.1

### statistics

Fixed statistical variable functionality in the drop-down list.

## 1.26

### core

Oskari now prints a warning to console if a requesthandler will be overwritten.

### mapmodule-plugin/DrawPlugin

DrawPlugin can now be configured to NOT register (and unregister) requests. This helps when there are multiple DrawPlugins on map.
For now start the plugin with { requests : false } config if you have more than one. Otherwise the latest will receive all requests.
Better solution should be developed for this.

### search

Now prefers zoomScale over zoomLevel on result items.

### mapmodule-plugin/MapMoveRequest

Added support to zoom to a scale. MapMoveRequests zoom parameter can be given as an Object with scale property:

```javascript
    { scale : 10000 }
```

### mapwmts

WmtsLayers can now use options and params on layer JSON to override default layer parameters.

### toolbar

Sending enabled = false in Toolbar.AddToolButtonRequest now automatically disabled the button when added.
Removed handling of disabled = true so we are consistent with enabled-flag. If you used disabled = true,
please update the code to use enabled = false instead.
Disabled = true just made the visual disabling, not actual clickhandler disabling anyway.

### publisher

Semi-configurable URL (conf.urlPrefix) used in GFI-preview functionality has been changed to use window.location.
The configuration is no longer needed/used.

### metadatacatalogue

Metadata search has now advances search option Search area which enables metadata searching by limiting the search area on the map.

### Openlayers

OpenLayers.Control.TransformFeature was added to Openlayers full-map.js to enable transformations of drawn feature.

## 1.25.5

### Core

Fixed logging functions so they won't be called if they don't have .apply (i.e. don't break IE9).

## 1.25.4

### Publisher

Fixed editing old published maps

## 1.25.3

### statistics

Fixed issue with filtering button not working

## 1.25.2

### publisher

Fixed issues with editing embedded maps

## 1.25.1

### mapmodule/LogoPlugin

Clicking the logo now sends the mapstate as parameters as it was before.

## 1.25

### personaldata

No longer uses publishedMapUrl from config. GetViews JSON now includes URLs to views. Checkout oskari-server release notes for more details.

### publisher

No longer uses publishedMapUrl from config. Publish JSON now includes URL to published view. Checkout oskari-server release notes for more details.

### core/sandbox

Now has a convenience method createURL(baseUrl) that fills in protocol/host/path if missing from baseUrl.

### catalogue/metadataflyout

Rewritten to use JSON backend, any code relying on the old implementation is likely to break.
New implementation has full localization.

### analysis/analyse

New spatial join method is available in analysis methods (join attributes of two layers)
Field naming and styling of difference-method is changed

### integration/admin-layerselector

Management of WFS-type maplayers in Oskari maplayer configuration
Inserting/editing/removing WFS-layers in admin-layer UI.

## 1.24.7

### mapfull

Additional check for existance when referencing DOM element properties so size setting is compatible with published.jsp in oskari-server.

## 1.24.6

### publisher

Fixed map sizing, .oskariui-left is now always floated left. If you have a customized version of applications/yourapp/css/portal.css please make sure you include:

```javascript
.oskariui-left {
  float: left;
}
```

## 1.24.5

### publishedstatehandler

Fixed state handling (history tools) for published map. Notice that 'publishedstatehandler' needs to be part of the startupSequence for
published map that has history tools enabled on toolbar.

### publisher

Fill screen option is now again available in size options. Map size handling is now more consistent when thematic maps are enabled.

## 1.24.4

### publishedmyplaces2

Now checks if Toolbar.ToolButtonStateRequest is present before trying to send one.

### myplacesimport

Changed translations to not reference "Paikkatietoikkuna"

### publisher

Fixed typo in finnish translations

## 1.24.3

### applications/elf

Typo fixed in index.js

## 1.24.2

###  featuredata2 / Flyout

Implemented clickable links in the grid. Improved table header style. Fixed a nested table issue with My places data.

###  mapmodule-plugin / GetFeatureInfoFormatter

Modified image position.

## 1.24.1

### mapmodule/LogoPlugin

Fixed link binding for terms-of-use. It's now more specific instead of binding to all a-tags in plugin content.

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

Added DefaultModule to get boilerplate methods through inheritance. Based on DefaultExtension but removed flyout/tile/view methods. Usage example:

```javascript
Oskari.clazz.define('Oskari.mynamespace.bundle.mybundle.MyClass',
    function () {
        this.start();
    },
    {
        "name" : "mybundle.MyClass",
        afterStart : function(sandbox) {

        },
        "eventHandlers": {
            "AfterMapMoveEvent" : function(e) {
                console.log(e);
            }
        }
    },
    {
        "extend" : ['Oskari.userinterface.extension.DefaultModule']
    }
);
```

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
