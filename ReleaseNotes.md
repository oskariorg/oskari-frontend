# Release Notes

## 3.2.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/57?closed=1

### React version updated 16 -> 18

The new version requires some modifications to current code for any app specific bundles.
See React migration guide for details: https://react.dev/blog/2022/03/08/react-18-upgrade-guide

Examples for changes needed on oskari-frontend can be found on https://github.com/oskariorg/oskari-frontend/pull/2869

For most bundles can be migrated with these steps:

Replace: `import ReactDOM from 'react-dom';`
With `import { createRoot } from 'react-dom/client';`

Add a helper for maintaining root element reference:
```javascript
getReactRoot (element) {
    if (!this._reactRoot) {
        this._reactRoot = createRoot(element);
    }
    return this._reactRoot;
},
```

Replace: `ReactDOM.render(<jsx/>, element)`
With: `this.getReactRoot(template[0]).render(<jsx/>)`

PropTypes are not functioning with the new React version like before. As they are being removed from React:
 https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-deprecated-react-apisv 
 It's easiest to replace most current non-working PropTypes values with type `any`.
 We are considering adding TypeScript support to address this: https://github.com/oskariorg/oskari-documentation/issues/124

## 3.1.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/55?closed=1

### RPC

- New function for RPC `getGroupsWithLayerIds()` that returns the group-structure for layers that is used on the geoportal layer listing. This enables reusing the groups information that geoportal applications have and recreating a layer grouping structure on an RPC-based application.

- `SearchRequest` can now be used to get reverse geocoding results by sending and object with coordinates instead of the query text. Requires search channel on the server that supports reverse geocoding queries.

### Publisher / published maps

- Refactored code in publisher functionality:
    - https://github.com/oskariorg/oskari-frontend/pull/2853
    - https://github.com/oskariorg/oskari-frontend/pull/2847
    - https://github.com/oskariorg/oskari-frontend/pull/2850
    - https://github.com/oskariorg/oskari-frontend/pull/2851
    - https://github.com/oskariorg/oskari-frontend/pull/2826
- Added a way to inject panels into publisher UI from other bundles: https://github.com/oskariorg/oskari-frontend/pull/2852
- Removed unused `Publisher2.ColourSchemeChangedEvent`
- When getting the HTML snippet from My data, user can adjust the center coordinates and zoom level for the snippet without opening the publisher functionality (https://github.com/oskariorg/oskari-frontend/pull/2830)

### Mobile use

- The height of the oskari-root-el that is used to cover the whole page has been changed from 100vh to 100svh that should make the geoportal easier to use on mobile and as the full screen page no longer has any scrolling behavior itself.
- Added hitTolerance to feature clicks for touch events (https://github.com/oskariorg/oskari-frontend/pull/2854) so map features are easier to hit on touch screens
- Close icons on flyouts now have larger hitboxes and are easier to "click" on touch screens

### Other fixes and additions

- Map legends now always show a link to the legend when there is some kind of URL to be used as legend. This allows linking for example a PDF-file as the legend even if we can't show it as part of the UI. This affects both geoportal and embedded maps (https://github.com/oskariorg/oskari-frontend/pull/2870)
- Admin can now see the users created/updated timestamps when editing user details.
- GetFeatureInfo/Infobox popup now uses theming instead of `Publisher2.ColourSchemeChangedEvent` and listens to theme changes.
- Cleaned up references to LESS styling.
- Component FileInput now has better error handling when user cancels the dialog
- Clicking the metadata icon on geoportal map legends panels no longer toggle the panel itself (https://github.com/oskariorg/oskari-frontend/pull/2863)
- Coordinate tool now does it's thing when pressing enter on the coordinate input instead of requiring the user to move focus away from the field
- Fixes for content on the guided tour
- Updated dependencies:
    - cesium/engine 10.1.0 -> 20.0.1
    - ol 9.2.4 -> 10.6.0
    - ol-mapbox-style 12.3.5 -> 13.1.0
    - olcs 2.20 -> 2.22.1
    - Removed less and less-loader

## 3.0.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/56?closed=1

- Fixed an issue where browsers printing functionality was not printing the map as expected
- Fixes to several publisher tools for their "No UI"/"RPC Only" flags
- Removed lodash as we don't use it anymore (our dependencies still use it)
- Fixed alignment issues on announcement banner having long messages
- Fixed an issue with `InfoBox.ShowInfoBoxRequest` where theme colors were used instead of colors passed with the request
- Updated dependencies:
  - dompurify 2.5.8 -> 3.2.5
  - corejs and babel related updates

## 3.0.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/53?closed=1

This release mostly focuses on server-side and updating the Java-version Oskari is built with. Most of the frontend changes are cleaning up older code and moving things around. While we didn't finish all of the work for the frontend cleanup that was dreamed of, you should be able to see where we are going with this. While it might seem a lot of manual migration of frontend changes for this upgrade, doing it while rotating the major version is what major versions are for. This allows us to improve developer experience of Oskari and make things better for future development. This means that there are quite a few changes that Oskari-based applications require when upgrading to Oskari 3.0, but it should be fairly straightforward and mostly changing references to bundles.

### New base class for bundle instances

Introduced in https://github.com/oskariorg/oskari-frontend/pull/2794 and usage is demonstrated on the sample-applications `sample-info` bundle: https://github.com/oskariorg/sample-application/tree/ea1bc81852f306fe1f31707f8626500ca9a1eb7a/bundles/sample-info

The bundle might have more comments on what it does and why so it should be pretty easy to follow. Main things are the new `index.js` and that you can now import a base ES class for your bundle instance and might not need to care about the `Oskari.clazz.define()` way of doing things. A very simply bundle with id `hello-world` that prints out a dev-console message on startup can now be defined like this:

```javascript
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';

class MyBundleInstance extends BasicBundleInstance {
    start () {
        console.log('Hello world')
    }
}

Oskari.bundle('hello-world', () => new MyBundleInstance());
```

### Publisher

The publisher bundle now uses React.js for rendering most of the UI. This means that any publisher tools _other bundles_ want to show on the publisher UI now need to be React-based. What such publisher tool controls doesn't matter as much, but the tool implementation requires React-based code.

Example publisher tool migrations from 2.14.0:
- coordinatetool-bundle:  https://github.com/oskariorg/oskari-frontend/pull/2728 
- time and camera controls for 3D-map: https://github.com/oskariorg/oskari-frontend/pull/2741

An issue with layers being loaded asynchronously was fixed (affecting the map legend tool):
- https://github.com/oskariorg/oskari-documentation/issues/81

Thematic maps panel is now toggled on the publisher UI if statistical data layer is added/removed while using the publisher.

### Changes for bundle registrations 

The packages folder that Oskari-frontend uses and it's connection to the bundles folder has raised quite a few questions during the years. With this release we have started moving the "bundle definition" files (`bundle.js`) from under `packages` folder to be next to the actual implementation files under `bundles` (as `index.js` files). In the progress we have also simplified the format (_removing roughly 95+% of the content/all of the boilerplate of these_).

Since we have the new format for `index.js` per bundle we also needed new loaders to process the new way of importing bundles to applications. New loaders are now available for application `main.js` usage:
- `oskari-bundle` replaces oskari-loader and supports more streamlined bundle registrations (https://github.com/oskariorg/oskari-frontend/pull/2791)
- `oskari-lazy-bundle` replaces oskari-lazy-loader for adding support to lazy-load bundles with the streamlined bundle registration (https://github.com/oskariorg/oskari-frontend/pull/2792)

This allows linking bundles like this:
```javascript
import 'oskari-bundle!oskari-frontend/bundles/admin/admin';
```
instead of:
```javascript
import 'oskari-loader!oskari-frontend/packages/admin/bundle/admin/bundle.js';
```
and removes the unnecessary complication that comes with the packages-folder.

The frontend now always requires a build process and we use it to automate how localization files for a bundle are linked. The new loader detects localization files for the bundle by searching `resources/locale` folder for localization files (relative to the `index.js` file) so you don't need to link them manually like on `bundle.js`. The old loader is still required for bundles that need to link files under libraries with the "expose-loader" or ones that link localization from other bundle folders. We will continue working on this.

#### Migrated bundles

These bundles have been migrated from under `packages` to `bundles` and/or to the new bundle-loader syntax. Applications will need to modify the `main.js` files like describe here: https://github.com/oskariorg/oskari-frontend/pull/2793. The pull request also shows how much easier it is to declare a bundle with the new format.

```diff
- import 'oskari-loader!oskari-frontend/packages/framework/layerlist/bundle.js';
+ import 'oskari-bundle!oskari-frontend/bundles/framework/layerlist/';
```

- bundles/catalogue/metadata/bundle.js -> bundles/catalogue/metadataflyout
- packages/catalogue/metadatasearch/bundle.js -> bundles/catalogue/metadatasearch
- packages/admin/bundle/admin-announcements/bundle.js -> bundles/admin/admin-announcements
- packages/admin/bundle/admin-layereditor/bundle.js -> bundles/admin/admin-layereditor
- packages/admin/bundle/admin-permissions/bundle.js -> bundles/admin/admin-permissions
- bundles/admin/admin-layeranalytics/bundle.js -> bundles/admin/admin-layeranalytics
- packages/framework/bundle/admin-users/bundle.js -> bundles/admin/admin-users
- packages/admin/bundle/admin/bundle.js -> bundles/admin/admin
- packages/admin/bundle/appsetup/bundle.js -> bundles/admin/appsetup
- packages/admin/bundle/metrics/bundle.js -> bundles/admin/metrics
- packages/framework/layerlist/bundle.js -> bundles/framework/layerlist
- packages/framework/featuredata/bundle.js -> bundles/framework/featuredata
- packages/framework/bundle/language-selector/bundle.js -> bundles/framework/language-selector
- packages/framework/bundle/announcements/bundle.js -> bundles/framework/announcements
- packages/framework/bundle/backendstatus/bundle.js -> bundles/framework/backendstatus
- packages/framework/bundle/coordinatedisplay/bundle.js -> bundles/framework/coordinatedisplay
- packages/framework/bundle/coordinatetool/bundle.js -> bundles/framework/coordinatetool
- packages/framework/bundle/guidedtour/bundle.js -> bundles/framework/guidedtour
- packages/framework/bundle/feedbackService/bundle.js -> bundles/framework/feedbackService
- packages/framework/bundle/findbycoordinates/bundle.js -> bundles/framework/findbycoordinates
- packages/framework/bundle/mapfull/bundle.js -> bundles/framework/mapfull
- packages/framework/bundle/maplegend/bundle.js -> bundles/framework/maplegend
- packages/framework/bundle/myplaces3/bundle.js -> bundles/framework/myplaces3
- packages/framework/bundle/myplacesimport/bundle.js -> bundles/framework/myplacesimport
- packages/framework/bundle/publishedstatehandler/bundle.js -> bundles/framework/publishedstatehandler
- packages/framework/bundle/printout/bundle.js -> bundles/framework/printout
- packages/framework/bundle/routingService/bundle.js -> bundles/framework/routingService
- packages/framework/bundle/publisher2/bundle.js -> bundles/framework/publisher2
- packages/framework/bundle/postprocessor/bundle.js -> bundles/framework/postprocessor
- packages/framework/bundle/search/bundle.js -> bundles/framework/search
- packages/framework/bundle/routingUI/bundle.js -> bundles/framework/routingUI
- packages/framework/bundle/timeseries/bundle.js -> bundles/framework/timeseries
- packages/framework/bundle/statehandler/bundle.js -> bundles/framework/statehandler
- bundles/statistics/statsgrid/bundle.js -> bundles/statistics/statsgrid
- bundles/framework/mydata/bundle.js -> bundles/framework/mydata
- bundles/framework/layeranalytics/bundle.js -> bundles/framework/layeranalytics
- packages/framework/bundle/usagetracker/bundle.js -> bundles/framework/usagetracker
- packages/framework/bundle/userguide/bundle.js -> bundles/framework/userguide
- packages/framework/bundle/geometrycutter/bundle.js -> bundles/framework/geometrycutter
- packages/mapping/dimension-change/bundle.js -> bundles/mapping/dimension-change
- packages/mapping/camera-controls-3d/bundle.js -> bundles/mapping/camera-controls-3d
- packages/mapping/time-control-3d/bundle.js -> bundles/mapping/time-control-3d

#### Changes to internals

These changes shouldn't really affect an Oskari-based application that has been migrated to 2.0+ before, but things that have changed inside the "engine":

- New core component `src/BundleRegister` for managing bundles and exposes `Oskari.bundle()` (previously part of src/loader.js) and `Oskari.lazyBundle()` functions. These also validate the parameters and try to offer friendlier error messages when trying to pass non-Oskari-bundle'ish references.
- `Oskari.bundle_manager` functions removed:
    - `registerDynamic()` - replaced by `BundleRegister.lazyBundle()` that is exposed as `Oskari.lazyBundle()`
    - `loadDynamic()` - moved to `src/loader.js` as private function as it doesn't need to be exposed

Removed support for `minifierAppSetup.json` files. These haven't been used after we migrated to main.js usage on applications and the support for parsing them on build was now removed.

### Styling changes

Removed support for styling using LESS as that was added for AntD and AntD no longer uses it. For styling we currently prefer styled-components, but also support CSS and SCSS.

### Cleaning up

Removed bundles (jQuery -> React implementations):

- `framework/admin-layerrights` replaced by `admin/admin-permissions`
- `catalogue/metadatacatalogue` replaced by `catalogue/metadatasearch`
- `framework/featuredata2` replaced by `framework/featuredata`
- `catalogue/metadataflyout` implementation switched in-place from jQuery to React-implementation (React-impl was previously in folder `catalogue/metadata`, but as the jQuery-based version was removed the React-version was renamed to match the bundle id)
- `statistics/statsgrid2016` replaced by `statistics/statsgrid` (bundle id remains `statsgrid`)
- `framework/admin-publish-transfer` removed as app specific
- `sample/*` removed as they were not maintained and it's better to build these on the sample-application repository

Removed jQuery-components that were not used by anything on this repository:
- https://github.com/oskariorg/oskari-frontend/pull/2805
- The `SelectList` and `chosen.js` library were restored for now, but can be considered deprecated and waiting for removal as well: https://github.com/oskariorg/oskari-frontend/pull/2808
- React-based components are the currently maintained components in the library and we will continue removing the jQuery components. If you use these on your application, you do have a choice of copying the removed implementation to be part of your application and continue using them like before.

## 2.14.2

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/54?closed=1

- Fixed an issue with metadata not saving the current metadata for links/state.
- Fixed zoombar visually when 3D-effect was used for map controls.
- Fixed an issue where map layer sub groups were not properly shown on `layerlist` and `admin-layereditor`.

## 2.14.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/52?closed=1

Fixed an issue where layers with URL templates couldn't be added with the admin UI.

Removed postinstall script that did not work properly when dev-mode was not used. It was replaced with a Babel-plugin that can handle Cesium quirks.

Updated dompurify 2.3.6 -> 2.5.8

## 2.14.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/48?closed=1

### Publisher

Most of publisher tools have been migrated from jQuery to React.
For users, this means they need to be listed on a different panel in publisher than the jQuery-based tools.
For applications with custom publisher tools, this is a good time to migrate the application specific tools to React.

We will be migrating the whole publisher UI to React in a future release where _jQuery-based tools will either break or not be listed on the publisher UI_.
Before that happens we still need to migrate the (jQuery-based) tool for GFI-popup where we are moving the theming related settings for it under the theming panel.

Publisher tools that control plugins under `mapmodule` have been moved from `publisher` to `mapmodule` (bundles/mapping/mapmodule/publisher/tools.js)).

Fixed an issue that allowed an embedded map to be opened on the publisher even when the projection on the embedded map did not match the current map projection. Now the popup for this is modal and prevents modifying an embedded map with the wrong projection and forces the user to reload the page with the proper projection before allowing editing.

### Admin

- `admin-layereditor` now shows the layers parsed capabilities JSON in the `JSON` tab instead of the `Additional` tab
- `admin-users` bundle now separates the built-in system roles from any additional roles listing to improve usability.
- `admin-permissions` now show unsaved changes on the UI and the handling for changes have been refactored.
- `admin-layereditor` now offers a button to remove saved default style for layer when all styles have been removed from the service (capabilities). This uncommon situation could not be solved through the UI until now and resulted in annoying popup for admins.
- `announcements` now default to banner instead of popup since this is the more likely option for announcements.

### Other changes

- `layerswipe` has been migrated to React and now supports touch screens as well. But due to changes in OpenLayers now does not work properly on _vector layers with transparency_.
- `statsgrid` publisher tools now includes a button to open data search for statistical data. This enables changing the statistical data indicators while editing a previously published map.
- `statsgrid` React-implementations of search and user indicator UIs and statehandling has been refactored for maintainability (https://github.com/oskariorg/oskari-frontend/pull/2737).
- `mydata` no longer shows "show on map" for embedded maps listing as it was a bit misleading. To preview the map the user can click the name like before to open the embedded map in another browser window.
- `BackgroundLayerSelectionPlugin` now shows a "no selection" text if the configured layers are not available instead of defaulting to the name of the layer that is already on the map.
- `metadataflyout` has been rewritten with React and can be switched on main.js by importing `bundles/catalogue/metadata/bundle.js`.
- `metadataflyout` actions tab now filters layers properly instead of listing too many.
- `metadatasearch` now checks if there are advanced search options available before showing a link to show them (The options are not available by default on Geonetwork 4.x with GetDomain not implemented: https://github.com/geonetwork/core-geonetwork/issues/4727)
- `timeseries` restoring saved state (on embedded maps/saved views) wasn't working as expected and now it is.
- `featuredata` selecting features by drawing a selection on map is now more user-friendly.
- `mapmodule` now has a getVersion() function that returns the version of the map engine implementation (OpenLayers/Cesium version depending on the 2D/3D map implementation).
- removed some resource files like unused pngs and (s)css that are no longer used.
- 3D time control plugin has been migrated to React.
- `drawtools` fixed an issue where stopping a drawing with other id than the current one also stopped the current drawing (https://github.com/oskariorg/oskari-frontend/pull/2711).

### Changes to UI component library

Most UI components that use AntD directly or through the `oskari-ui` component library needs to be wrapped with `<ThemeProvider>` with `import { ThemeProvider } from 'oskari-ui/util';`.
Otherwise they will use for example different font than the rest of the UI. `ThemeProvider` includes the new Theming mechanism for AntD 5 components.
See https://github.com/oskariorg/oskari-frontend/pull/2668 for examples.
Notes about AntD 5 migration: https://ant.design/docs/react/migration-v5

- `ColorPicker` component has been changed to use the one from AntD component library.
- `RichEditor` (WYSIWYG-text editor) component implementation has been changed from (no longer maintained) `draft-js` to (maintained) `jodit`.
- `Button` component now also exposes a `ThemedButton` that uses theming values.
- `Slider` component now also exposes a `ThemedSlider` that uses theming values.
- `TextIcon` is a new component that can include text as value but can be treated like SVG-icons.
- `Message` component now has a fallback-prop that can be used to render something else if the requested localization is not found.
- `Message` component added a bunch of unused onClick handlers to the UI for debugging purposes. It no longer does this by default, but the debugging can be activated when needed (https://github.com/oskariorg/oskari-frontend/pull/2736)

### Library updates

Added a [guide](UpdatingDependencies.md) for dependency updates that can be used to document restrictions and other notes for consideration when updating dependencies.

- OpenLayers 7.2.2 -> 9.2.4
- cesium 1.91 -> cesium/engine 10.1.0 (required a post install script for oskari-frontend)
- olcs 2.13.1 -> 2.20 (2.21.0 released after this update is required when updating to OpenLayers 10: https://github.com/openlayers/ol-cesium/commit/fa317f96d1621c4bce17482a581de82eb83c9517)
- antd 4.24.8 -> 5.21.6 (changes to many React components. See [antd migration notes](https://ant.design/docs/react/migration-v5))
- @ant-design/icons 4.6.3 -> 5.5.1
- node-sass replaced with sass which allows to use newer node.js version. Oskari-frontend can now use at least node 18 & 20 instead of being limited to node 16.
- webpack 3.43.0 -> 4.47.0
- webpack-cli 3.3.11 -> 4.10.0
- webpack-dev-server 3.8.0 -> 4.15.2
- expose-loader 0.7.5 -> 1.0.3 (see changes in https://github.com/oskariorg/oskari-frontend/pull/1751 if used on apps directly)
- loader-utils -> removed as unnecessary
- babel 7.23.5 -> 7.25.2 
- jest 27.0.6 -> 29.7.0 (required new dependency jest-environment-jsdom)
- other less interesting dependencies, see package.json for details
- storybook -> removed for now as updating it is a bigger task and it had a lot of old dependencies that flagged a lot of false positives on scans. The stories.js files are still on the codebase with hopes to restore this and make it more visible part of Oskari development in the future.

## 2.13.2

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/50?closed=1

- Fixed an issue when importing statistical data from clipboard with region ids: https://github.com/oskariorg/oskari-frontend/pull/2640
- Fixed an issue with the older jQuery version of statistical data functionality where the publisher tools for statistical data were not properly shown on the publisher.
- Fixed issues when showing layer metadata properly from metadata search results and layer admin.
- Fixed some localization issues on metadata search functionality.
- Fixed an issue where clicks on the map were not properly received by the map on the lower part of the map. For example GFI didn't work at the bottom of the map etc.
- Fixed an issue where setting a custom cursor on map was not properly reseted for popups on the map: https://github.com/oskariorg/oskari-frontend/pull/2644
- Fixed an issue with layer admin vector hover style form where editing the hover style could lead to a situation where it could no longer be edited.
- Added handling for colors with alpha channel under the hood (no UI yet). This enables a polygon style with semi-transparent fill and fully opaque strokes.

## 2.13.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/49?closed=1

- Restored synchronous state updates to other parts of the frontend than thematic maps (an AsyncStateHandler is now an option for developers though). This fixes cursor jumping to the end of an input field while user is editing the input text. See https://github.com/oskariorg/oskari-frontend/pull/2626 for more details.
- Added max-width for tooltips so they are more usable on large screens.
- Fixed an issue where feature data table would not work properly when vector layers are present when starting the application (for example on embedded maps).
- Fixed some icons on time series player that were not using theme variables properly.
- Added default duration for announcements (one day).
- Fixed an issue where thematic maps search UI breaks when indicator listing has duplicates of the same indicator.
- Fixed an issue where thematic maps opacity was not properly restored on embedded maps/saved views.
- Added highlighting for selected region on thematic maps table. Also highlights the region on map when user selects a region on the table.
- Fine-tuned the session expired modal.

## 2.13.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/45?closed=1

### Improvements for mobile devices / small screens

- Adding a marker now only shows one popup at a time making it more usable on small screens/mobile devices.
- Marker and measurement tools now automatically hide the main navigation on geoportal when used on small screens to show more of the map when these tools are activated.
- The XY-tool now detects if the user has a mouse-controller and hides the "show coordinates at mouse location" toggle if mouse is not detected.
- The main navigation on geoportal now shows a scroll indicator to signal that there's more content on the navigation than fits the end-users screen. This helps users find functionalities that don't fit on their screen and are not familiar with the UI to know where to search them.
- Banner-announcements are now more usable on small screens and work better with dark themes (https://github.com/oskariorg/oskari-frontend/pull/2481).
- The announcements tile in geoportal main navigation is now hidden on small screens when there are no announcements to be listed.
- The UI for browsing sparse timeseries data like historical ortophotos has been improved for small screens: https://github.com/oskariorg/oskari-frontend/pull/2565
- Pinch zooming the page (outside the map/in the main navigation or flyout/popup content) on mobile devices can result the user losing access to part of the UI (usually the main navigation) as its rendered outside the device physical screen after pinch zooming. We now try to detect this condition and offer a button for reseting the page zoom when this happens. This is experimental and unfortunately doesn't seem to work on all devices (notably not working on iOS based devices). See https://github.com/oskariorg/oskari-frontend/pull/2534 for more details.

### Other improvements for end-users

- Swipe tool for comparing layers side by side can now be published as part of an embedded map. Options are to add the tool, auto-activate it on startup (this can also be activated with a URL-parameter) and hide the UI (the end-user can't switch the tool off). 
- Link tool includes the URL-parameter for activating the swipe tool when opening the link if the swipe tool was active when a link was generated.
- The swipe tool now uses the accent color from theme for the splitter color instead of always being the default yellow color.
- My data user details now shows account creation date and last login date.
- Again fine-tuned tooltips when dragging layers on selected layers listing.
- Layer coverage area can now be shown on the map. This is useful for locating content on the map when the layer content is on a smaller area. Relies on service capabilities/metadata to be correct on the service itself (https://github.com/oskariorg/oskari-frontend/pull/2429).
- Fixed the map legend tool selection for embedded maps in publisher not being saved correctly. The map layer legends button can now be used on embedded maps again.
- Reverse geocoding search now zooms the map to show results more clearly.
- Announcements are now polled by the frontend to allow showing any _new_ announcements that have been added/scheduled to be shown _after_ the page has been loaded and/or when the page has been left open for a long time without refreshing the page (https://github.com/oskariorg/oskari-frontend/pull/2519).
- Fixed an issue where opening an infobox on the map _while_ panning the map resulted in the map moving to weird locations (mostly reproducible with wmts-layers https://github.com/oskariorg/oskari-frontend/pull/2523).
- Markers can now be edited and removed by clicking on a marker when the marker tool is active.
- Coordinates can now be included on a PDF-printout (https://github.com/oskariorg/oskari-frontend/pull/2537).
- Coordinates info can now be included on the infobox UI (https://github.com/oskariorg/oskari-frontend/pull/2566). Requires activating it on the database for any appsetups that wish to show the coordinates.
- Reversed map layers legends listing order for consistency/matching the layer order on selected layers.
- Fixed an issue with infobox header not growing with the content (https://github.com/oskariorg/oskari-frontend/pull/2577)
- Text selection now uses theme colors
- Timeseries UI now supports theme colors

### Admin functionalities

- Layer admin now has a new tab for JSON-configuration fields (options/attributes/capabilities). This also adds UI for managing the params-field for layers (https://github.com/oskariorg/oskari-frontend/pull/2438).
- Layer admin permissions tab now always shows the column headers on screen even when there are roles that require scrolling.
- Layer admin can now show the structure of the service when adding layers from a WMS-service: https://github.com/oskariorg/oskari-frontend/pull/2542
- Layer admin now allows selecting a geometry type for vector layers. This cleans up the style editor for both admins and end-users by hiding for example point and area style forms from layers that only have lines etc.
- Layer admin now has a UI for managing vector layer hover-styling (https://github.com/oskariorg/oskari-frontend/pull/2439). Previously managed through JSON-based free text fields.
- Button for adding announcements is now on the top of the announcements list instead of being at the bottom so it's easier to find when there are multiple announcements and for being more consistent for example with the layer admin tools.
- User admin (`admin-users` bundle) now has swedish localizations and shows a nicer message for empty search result
- `admin-permissions` bundle now tries to maintain scroll position after permission change. This makes it more user-friendly as toggling a permission doesn't reset scrolling back to top.
- WMS-layers that offer GetFeatureInfo in JSON-format now benefit from the same formatting improvements as vector layers when looking at the GFI data on the `infobox`. The layer admin UI for selecting/renaming properties and format values that is available for WFS-layers has not been added for WMS-layers but it's now technically possible to use the same formatting for these kinds of WMS-layers and even by default is usually looks better than the default HTML returned by services (https://github.com/oskariorg/oskari-frontend/pull/2525).
- Optional metadata url: https://github.com/oskariorg/oskari-frontend/pull/2594 Allows admin to configure a layer specific url for fetching the layers metadata through `layer.attributes`. This only supports showing the metadata for the layer. It doesn't add support for searching from multiple metadata services.

### New bundles

- `metadatasearch` is a React-based drop-in replacement for jQuery-based `metadatacatalogue` for searching metadata. Requires db migration as well as linking the new implementation on main.js as the bundle id changed, but the old version is also still available.
- `featuredata` is a React-based drop-in replacement for jQuery-based `featuredata2` for feature data table. This was included in the last release as an optional preview version but is now working as intended and good for replacing the old one. This also adds pagination for results to make it usable in the case where the screen is full of features. It also adds a toggle for condensed view to show more rows on screen at once even when feature property values might have very long content. Requires db migration as well as linking the new implementation on main.js as the bundle id changed, but the old version is also still available.
- `personaldata` bundle has been removed from the source code. The drop-in replacement is the `mydata` bundle that has been available for a couple of releases already. Requires linking the new implementation on main.js as the bundle id changed.
- `statsgrid` has a full React rewrite for thematic maps/statistical data functionality https://github.com/oskariorg/oskari-frontend/pull/2599. Requires linking the new codebase (https://github.com/oskariorg/sample-application/pull/33), but doesn't require db migration since bundle id remains the same. This makes it easy to switch the implementation to test it out.

### For developers

- Added `Oskari.util.mouseExists()` for detecting if user has a mouse present. This can be used to determine if we should hide UI-elements based on mouse like showing coordinates for pointer hovering the map (See [XY-tool](https://github.com/oskariorg/oskari-frontend/pull/2422)).
- New component under `mapping/mapmodule/MapModuleTextButton` for allowing text-based buttons on map that respect theming etc. Similar to MapModuleButton which handles icons, but this one is for buttons with text.
- Moved layertype icons from `layerlist` to `src/react/components/icons/LayerIcon.jsx` so they can be accessed more easily from anywhere.
- The publisher functionality now has generic ReactToolsPanel and ToolsHandler for React-based publisher tools.
- The publisher size setting panel has been rewritten with React.js
- Added support for vertical scrollbar in React-based Flyouts (https://github.com/oskariorg/oskari-frontend/pull/2491).

## 2.12.1

For full list of changes after 2.12.0 see both:
- https://github.com/oskariorg/oskari-frontend/milestone/47?closed=1
- https://github.com/oskariorg/oskari-frontend/milestone/46?closed=1

- Added changes from 2.11.2 for 2.12.0.
- Fixed an issue where GFI popups were not always opened correctly (for proxied layers).
- Fixed an visual issue with some buttons that were previously round, but after browser update became square.
- Decreased screen height limit from 650px to 500px when detecting small screen (fixes an issue where the geoportal was shown on mobile mode too eagerly).
- Fixes for announcements functionality in embedded maps/RPC.

## 2.12.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/43?closed=1

### Mobile improvements

The geoportal views now allow users with small screens to toggle the main navigation to reveal more of the map UI and the navigation starts hidden on small screens.
Server configuration can be used to switch functionalities off or even start new ones when the frontend requests a mobile version.
In general the UI has seen a number of improvements for users with small screens.

The specifics:
- `GetAppSetup` route now accepts a new parameter than can be used to fine-tune mobile functionalities (`mobile=Oskari.util.isMobile()`). This triggers handling of server-side configuration as described here: https://github.com/oskariorg/oskari-server/pull/995
- The `divmanazer` bundle now initializes a new plugin/button on the map on small screens that allows the user to toggle the navigation on and off. This helps users to work with the UI on mobile devices and small screens in general.
- New functions in Oskari.dom -> `showNavigation(bln)`, `isNavigationVisible()` and `getNavigationEl()` that can be used to toggle and query the main navigation state.
- The `FullScreenPlugin` that does a similar thing to the new plugin also detects mobile mode and removes itself from the screen on "mobile mode" to prevent having two very similar functionalities on the map at the same time. The FullScreenPlugin does more to hide any additional elements on the page, but hiding such elements on small screens should be the responsibility of the page Oskari is rendered to.
- Plugins at the bottom part of the map now flow a bit better on smaller screens (layout improvement so plugins don't overlap each other).
- Tooltips work better on small screens now.
- Popup placement works better on small screens now.
- Map layer legend is now scaled to fit better on small screens (added a link to open the legend on a new browser tab for zooming purposes)
- The `metadataflyout` no longer shows the "Actions" tab for metadata when it is used on embedded maps as the actions on the tab don't really make sense/work on embedded map setting.
- The `zoombox` tool is no longer shown when the geoportal is started on a small screen/"mobile mode"
- The marker form now works better on small screens

### Map layer management and admin improvements

We now have a very nice UI for fine-tuning how WFS-layers should be presented for the end-users! Admins now have an actual UI to:
- select what properties to show/hide and in which order (even based on end-user language)
- filter out features based on property values
- style features based on property values
- localize and rename properties
- select a formatter for values of properties

All of these could already be done with a JSON config, but it was previously hard to use and maintain without the UI.
The admin can also select geometry type for a layer so for example style editor can show only relevant parts of the form based on the geometry type and the value is defaulted based on layer capabilities.

Another new functionality is that the admin can now select a feature property to act as unique identifier for features on a WFS-layer.
This helps with layers where features have a property that can be used as unique identifier for features, but the service providing the data is configured to generate feature ids instead of using a persistent one.
Features with autogenerated ids can result in for example the featuredata showing like there are multiple features on the same location even if there should be only one (since feature id can't be used to determine duplicates).

There is also a new implementation for the admin bundle for settings layer permissions (`admin-permissions` bundle replacing `admin-layerrights`).
This is a React.js based UI with similar look and feel to the permission settings on map layer admin, but offers a way of setting permissions for multiple layers at once.
The new UI provides paged results instead of a long list and has built-in search functionality.

The regular layer listing functionality (`layerlist` bundle) now allows admin users to search layers by layer id and technical name in addition to the name, data provider and group name accessible by other users.
This makes it easier for admins to find a specific layer that is for example referenced on server logs.

Improvements to user management:
- The user managements bundle (`admin-users`) now starts without a config using default values
- Added validation to frontend to make adding/editing users more user-friendly
- Added a view to list users by role to make it easier to find users with specific role

### React migration progress

- `BackgroundLayerSelectionPlugin` has been rewritten using React.js and now looks and feels a bit different, but also works better on small screens
- Added more features to the React.js based `featuredata` bundle that will eventually replace the current jQuery based `featuredata2` bundle
- `featuredata` exposes a new request `Featuredata.ShowFeatureDataRequest` for opening the feature data table for given layer
- Refactored layer list group/theme and data provider popups to use React.js based popups instead of jQuery ones.
- Session expiration popups has been refactored from jQuery to React.js based UI: https://github.com/oskariorg/oskari-frontend/pull/2347
- Replaced `enzyme` with `testing-library` to make it easier to move to newer React versions in the future. At this time the AntD icons library blocks upgrading to React 17.

### Component library changes

- `Badge` component now uses/supports theming (and has a new prop `color` to override the badge color).
- `Badge` now defaults to showing even with zero value (override with prop `showZero=false` ).
- `ThemedBadge` component removed as the `Badge` can be used as a drop-in replacement.
- Added `accept` and `reject` to common icons
- Added theme based hover effect for `IconButton`
- `InfoIcon` now adds margins by default (and has a new prop `space=false` to prevent margins)
- `MetadataIcon` now checks if the `catalogue.ShowMetadataRequest` is available in addition to metadata identifier being passed to it to decide if it should render itself.

### Other changes

- Marker handling refactored
- Fixed issues when programmatically hiding/showing markers that were already showing or hidden. Mostly concerns RPC usage.
- Fixed GetFeatureInfo functionality when the map has been rotated (previously didn't take rotation in to account when querying for data).
- Revised tests for RPC-functionalities and updated the `Jasmine` test library 2.5.2 -> 5.1.0
- Fixed issues on coordinate tool configuration on the publisher functionality
- Fixed an issue with language selection on the publisher functionality
- The admin UI for selecting announcements for an embedded map on the publisher functionality now has the option to hide the announcements UI on the embedded map (for using announcements programmatically).

## 2.11.2

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/46?closed=1

- Fixed timing issues with runtime vectorlayers (mostly affecting some RPC-based apps).
- Fixed an issue with layer opacity when the service is provided by ArcGIS server.
- The issue is mainly on RPC-based apps where layers are initialized directly on app startup.

## 2.11.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/44?closed=1

- Fixed timing issue with functionalities using AddMapLayerRequest and expecting the layer to be immediately on the map. This fixes for example the background map layer selector that tried to rearrange layers on map immediately after changing the layers on the map.
- Fixed some issues for users with Firefox as browser.
- Fixed an issue where the correct style for vector layers were not always selected when opening the map with a link or when using an embedded map.
- Fixed an issue with publisher/statsgrid when LogoPlugin is NOT part of the appsetup.
- Fixed an issue with spammy notification on map layer admin UI.
- Tuned delay when searching map layers.

## 2.11.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/42?closed=1

### Vector layer styling

End-users can now save styles for vector layers!
 Defining styles for vector layers was possible before, but they were runtime only and lost on page refresh.
 Now the styles can be saved which means they are restored when logged in and can be used in embedded maps and links etc.
 End-users have a new tab on mydata to manage styles like other user generated content.
 Admins also have an improved UI for configuring styles.

### Improved search UI

The `SearchPlugin` implementation has been improved to support functionalities that have been previously available only on the geoportal search UI.
This means you can have the same search UI on geoportal apps and on embedded maps and provide users easier access to search.
This also means that the search UI on embedded maps has been improved.
The plugin is a bit larger than before to accommodate mobile users when it's showing the search input and minimizes to search icon when the map is used.

The plugin has new configuration options (for database/appsetup) on how to handle search result click and for enabling user to select channels (backend services) which are used for searching:
- https://github.com/oskariorg/oskari-frontend/pull/2166
- https://github.com/oskariorg/oskari-frontend/pull/2126

The search results are now shown per channel which enables adding different kinds of channels for the search like searching for map layers,
 statistical indicators etc as the channel result can be handled differently based on result type. The channel with most results is shown first.

Metadata search has been improved to detect if the search flyout is present.
The metadata search will create its own "tile"/menu item on the main menu if the flyout is not available and metadata search can't be injected into it.

### Initial mobile support changes for geoportal

The frontend now uses 650px as breaking point on both width and height for transforming to "mobile mode". 
The element size that is tracked is the root element of Oskari.
Previously the measurements were 500px x 400px and the monitored element was the map element.

- Added `Oskari.util.isSmallScreen()` so mobile breakpoint is managed in one place. Oskari.util.isMobile() uses this in addition to determining user device.
- Flyouts in mobile mode now cover the screen and are not draggable.
- Flyouts in general respect the maximum screen space available and can't be bigger than the available screen space.
- Search flyout now closes in mobile mode when search result is clicked so user can see the result on map.
- Layer listing has been modified to allow elements of the UI to work with smaller screen.
- Legend for statistical data now handles smaller screens by NOT growing out of screen.

### Publisher

- Map layer related tools and controls have been moved under the map layer accordion panel to make them easier to find.
- Tools that are only valid for RPC-based apps are now grouped under a new RPC-tools panel.
- The publisher tools that are the under these new panels (RCP-tools and Map layers) have been rewritten as React-implementations.
- More tools can now be relocated on the publisher like the tools for statistical data functionalities.
- Vector feature hover styles are now disabled when tools are dragged on publisher.
- The fiddly left/right hand toggle has been replaced with "switch sides" button that swaps tools from left to right and vice versa.

On the developer side, the publisher tool interface/API has been streamlined and unnecessary functions have been removed.
This might affect instances that have added their own application specific publisher tools:
- Documentation added: https://oskari.org/documentation/features/publisher/tools
- https://github.com/oskariorg/oskari-frontend/pull/2164
- https://github.com/oskariorg/oskari-frontend/pull/2180
- publisher tool handlers can now implement onLayersChanged() function to get notified of layer changes: https://github.com/oskariorg/oskari-frontend/pull/2191
- tool.isDiplayed() now receives the embedded map payload so it can determine if the tool should be shown or not based on the data
- New base class for tools: https://github.com/oskariorg/oskari-frontend/pull/2218

`ShowFilteredLayerListRequest` can now be used to open the selected layers tab of the geoportal layer listing UI.
This is used by the publisher so we can use the existing UI for all layer related operations.

### Other UI related changes

- Layer admin UI fixes for capabilities scheduling and handling for invalid scale limits
- Layer analytics UI for admins now includes quality of life improvements like searching
- User admin (admin-users bundle) has been reimplemented with React.js and includes a small facelift and improves the functionality in instances with a lot of users.
- Time series UI has been improved (and we'll continue working on theme support on these)
- The layer comparison control (swipe-tool) and the crosshair on map is now shown under the infobox-popup instead of on top of it.
- Fixed a bunch of broken tooltips
- Disabled statistical data histogram from being edited when classification is disabled.
- Statistical regions are now sorted on the user data input form.
- Some SVG-icons were not shown properly (mostly on Safari or zoomed in pages) - these have been fixed
- Theming:
    - Badge component supports theming
    - User style forms like dataset import and adding additional layers for myplaces now uses theme color as default color
    - Printout sidebar now respects theming colors

### Map plugin changes for developers

Plugins no longer need to care if they are in publisher "drag mode".
Previously disabling clicks were handled by plugins and the drag handle was added by plugins.
Now the publisher handles all of this so creating new plugins is much easier and less error-prone.
Overall they work much better out of the box with the publisher functionalities and makes developer experience more enjoyable.

Changes to map plugin interface/API:
- Documentation: https://oskari.org/documentation/features/map/mapplugin
- Added new functions like:
    - `resetUI()` (to clean up any popups/menus for major UI changes) 
    - `refresh()` called when the UI needs to be updated (replaces changeToolStyle(), redrawUI() and several other similar functions for cleaner developer experience)
     - More details in https://github.com/oskariorg/oskari-frontend/pull/2200
- Removed old toolstyle references from plugins and mapmodule (using theme instead)
- Removed unused functions from plugins and mapmodule (mostly relating to old "toolstyle"): https://github.com/oskariorg/oskari-frontend/pull/2163
- Changes to how plugin visibility is handled: https://github.com/oskariorg/oskari-frontend/pull/2201

### Layer handling changes for developers

The layers loaded for listing purposes no longer includes all the data for the layer.
Instead a `DescribeLayer` call to the server is done to load things like vector layer styles and WMTS tilematrices etc.
Layers now have handleDescribeLayer() that can be overridden in layer types to add spcecific handling.
Going forward DescribeLayer will be improved to make similar routes (like `GetWFSLayerFields` for `WFS` and `GetLayerCapabilities` for `WMTS`) unnecessary and this work has already started on this version.

The `AbstractLayer` baseclass now has more developer friendly functions:
- `isVisible()` returns the status if the layer visibility has been changed by the user
- `isVisibleOnMap()` can be used to detect if the layer is actually shown on the map. This takes into account:
    - if the user has hidden the layer
    - if the map is out of the scale range for the layer
    - if the layers coverage area is not on the map viewport
    - if the layer can't be shown (due not being supported like 3dtiles on non-3D map)

### Other changes for developers

- Upgraded dependencies to enable NodeJS 16
    - `node-sass` prevents using NodeJS 18 at the moment
- Upgraded `AntD` - this might require changes to app specific code: https://github.com/oskariorg/oskari-frontend/pull/2165
- Changed `moment.js` to `day.js` - this might require changes to app specific code
- Upgraded D3 and it is now linked in `package.json`/used through `npm install`
- The printout code has been cleaned https://github.com/oskariorg/oskari-frontend/pull/2144
- Table implementations are now more consistent: https://github.com/oskariorg/oskari-frontend/pull/2151
- Oskari.util.formatDate() is now used for time formatting through out the functionalities
- Fixed an error on coordinate tool (sometimes sending coordinates to server with separator `,` instead of `.`)
- Fixed an issue with markers where trying to hide an already hidden marker resulted in an error where the marker couldn't be restored on screen
- Added error handling when a layer can't be shown on the map: https://github.com/oskariorg/oskari-frontend/pull/2234
- Popups are no longer attached to document body, but under Oskari root element.
- Popup (and MovableContainer) now detects size changes and tries to keep the container on screen. So if the content grows beyond screen viewport the container is moved to accommodate content change.
- Lots of popups opened by toolbar tools have been migrated from jQuery to React.
- Added/improved components:
    - `MovableContainer` (oskari-ui/window) acts like popups, but don't have the header part of popups. Can be used to add a draggable object on the screen. Used for example on the legend for statistical data.
    - `Sidebar` for publisher, printout etc functionalities
    - Flyout now has a new option `resizable` to make it resizable by user and 
    - New (themed) `Header` component that is used for Popup and Sidebar
    - `IconButton` component includes the common icons used on buttons with tooltips, confirmation dialogs etc.
    - `CopyField` and `CopyButton` for system clipboard handling

## 2.10.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/40?closed=1

### Base HTML structure improvements

A set of new helper functions have been added for referencing "base elements" on the page and add CSS classes for styling these elements.
All of this is about:
- ground work for an upcoming UI improvement
- making it easier to document things
- documenting the base elements to make it easier to customize
- cleaning of the base HTML (unnecessary elements have been removed from the base HTML on the sample-server-extension)

| Prev. selector | JS-getter                        | New selector for styling   | Role                       |
|----------------|----------------------------------|----------------------------|----------------------------|
| `body`         | `Oskari.dom.getRootEl()`         | `.oskari-root-el`          | Everything Oskari generates goes under here |
| `#contentMap`  | `Oskari.dom.getMapContainerEl()` | `.oskari-map-container-el` | Container for the Oskari map |
| `#mapdiv`      | `Oskari.dom.getMapImplEl()`      | `.oskari-map-impl-el`      | Container for map engine/impl (inside "contentMap") |

The root element now defaults to element with id `oskari` or the `body` tag when not available.
The `oskari` id can be used when the elements need to be controlled more tightly to work with other content on the page and Oskari should not take control of the page fully.
Using the custom root element means that the size of the root element need to be set/controlled as well (is NOT handled by Oskari though we might introduce min-size in the future).
If the whole page is controlled by Oskari the size is set to cover the whole browser window by assuming the root is the body tag.

The elements with ids `contentMap` and `mapdiv` are created under the root element if they are not present.
The new CSS classes are attached automatically and have styling attached to them.
The old id's have been kept for compatibility reasons and are no longer used by code under `oskari-frontend`.
The JS getters should be used for referencing the elements (instead of the old id's) and CSS classes for styling.
A helper `Oskari.dom.isEmbedded()` was also added for detecting if the app is an embedded map as some tools use this information.

For now the navigation bar that holds toolbar and tile/menu items of Oskari is assumed to be a `<nav>` element directly under the root element.
The map elements are appended after it by default, but having for example the `#contentMap` element on the page before the `nav` controls which side of the map the navigation is.
The Oskari flyouts now use this information to determine initial the Flyout location instead of hard coded values.
The navigation element creation and content is planned to be moved to code as well as there are future requirements for making the navigation element more dynamic.

For more details see: https://github.com/oskariorg/oskari-frontend/pull/2042

This change makes the map size handling much simpler:
- `.oskari-map-container-el` defines maximum size that the map can have
- `.oskari-map-impl-el` defines the size of the map itself (can be smaller than `.oskari-map-container-el` but not bigger. Used for example to preview publisher size setting)
- `mapmodule` bundle now monitors its own element size for changes without external notifications required
- `MapSizeChangedEvent` is still sent when the map size changes so other parts of the code base can react to size changes
- This makes the following requests unnecessary and they have been removed from the code base: `MapFull.MapResizeEnabledRequest`, `MapFull.MapSizeUpdateRequest`, `MapFull.MapWindowFullScreenRequest`

### Theme

[ThemeHelper](https://github.com/oskariorg/oskari-frontend/blob/2.10.0/src/react/theme/ThemeHelper.js) now has a function for easily getting theme selections that can be used for navigational elements like the buttons on the map: `ThemeHelper.getNavigationTheme({...theme})` in a similar way that  `ThemeHelper.getHeaderTheme({...theme})` was previously used for windowing elements. The helper is still work-in-progress and comments about it are welcome. The idea is to provide getters that can try several settings from the theme JSON before returning a value for given theme variable. This way we can offer specific choices for theme setting but also provide fallbacks so a simple theme JSON could be given instead of giving a setting for every little detail in the theme.

Theme now also injects global style overrides to enable jQuery-based windowing elements have theming support and add initial theming support for the main navigation menu. See details in: https://github.com/oskariorg/oskari-frontend/pull/2100 This is similar to what Oskari-based applications do to override the default colors.

### Map theme

Handling for a new subobject named "map" was added to the theme enabling the map controls to use similar theme structure as the rest of Oskari application but individual toggles that can be adjusted just for the map. An example would be a case where the buttons on the map and the popups they open need to have a different color scheme as the rest of the geoportal. This was the case before theming support where the default UI on Oskari had yellow colored flyouts/popups, but similar components opened by buttons on the map had dark headers instead.

The way the "map" theme works is it can have the same structure as a normal theme JSON, but the mapmodule generates a theme for itself by combining the geoportal theme and overriding it with keys from the map subobject. As an example:
```
{
    color: {
        primary: 'yellow',
        accent: 'red'
    },
    map: {
        color: {
            primary: 'gray'
        }
    }
}
```
The mapmodule uses its own ThemeProvider context for its components. The map components would (in the example above) get a theme where the primary color is gray while non-map components would see the primary color as yellow. Both types of components would see the accent color as 'red' as it's not overridden under the map key. The mapmodule has `set/getMapTheme()` methods and it listens to changes on the geoportal theme to update the theme for map components.

Some of these are listed in https://github.com/oskariorg/oskari-frontend/pull/2069 and this will be documented in more detail in oskari.org.

### Publisher functionality

Enabled by the new theme support the publisher functionality now includes an initial theme editor for the embedded maps. This allows the end user to select for example colors that affect the controls on the map and the popups they open. The visual options that were previously offered have been changed to preset values for the new theme editor so they can be used as a starting point for more customized theme.

The tool placement/dragging mode in publisher now shows handles for tools as a visual reminder that tools can be dragged. Most restraints for plugin placement have been removed so they can be moved more freely.

### Draw tools

The drawtools bundle has been rewritten to make it easier to read and maintain. When requesting buffered features for drawing, they are now generated for all features in a multi feature collection. An issue has been fixed on perimeter/outer ring length measurements for polygons. The measurement tooltips no longer block clicks on the map so it's easier to edit measurements. Updated StopDrawingRequest documentation to match implementation.

### Map controls

All of the map controls (buttons on top of map etc) that are included in `oskari-frontend` have been rewritten as React-based components. They can now be styled using theme variables and have icons changed to SVG enabling hovering and more flexible styling options. The popups they open are theme-aware as well and some of the controls gained new functionalities:

- Search can now be minimized to a smaller icon when clicked on the map
- The previous pan buttons tool now only shows the reset button by default but it can be configured (using publisher UI) to show the arrows when required
- **The concept of "mobile mode" with the toolbar on top of the map has been removed**
- Tools now modify their own UI to fit a smaller screen more properly. As an example the zoombar hides its slider and makes its buttons bigger.

To make it easier to migrate any customized plugins to the new plugin structure the deprecated methods in `BasicMapModulePlugin.js` have been kept as no-op functions with logging to tell developers they should migrate a plugin that uses them:
- getMobileDefs()
- removeToolbarButtons()
- addToolbarButtons()

For details see: https://github.com/oskariorg/oskari-frontend/pull/2082

Also documentation about customization for some common cases can be found in:
- https://oskari.org/documentation/customize/logo
- https://oskari.org/documentation/customize/indexmap

### Build scripts

Parameters can now be passed on command line in another way (https://github.com/oskariorg/oskari-frontend/pull/2064)
Both of these work with version 2.10: 
```
npm run build -- --env.appdef=applications
npm run build --appdef=applications
```
Build script now allows generating builds to non-default domain with parameter: `--env.domain=https://cdn.domain.org`.

### New React components

- `MapButton` under `oskari-ui` for generic button on the map
- `MapModuleButton` under `mapmodule` uses MapButton and adds theme handling
- `SidePanel` under `oskari-ui` is currently used for printout options panel (publisher and others will be migrated to this in future release)
- `Tooltip` component should now clear from the screen properly when the element they are attached to is not shown

### Other improvements

- VectorTileLayerPlugin now receives the actual map resolutions array instead of using OpenLayers defaults. This might affect styling of vector tile layers: https://github.com/oskariorg/oskari-frontend/pull/2115
- Thematic map now allows classification with 2 values if method is not `jenks` and histogram view has been improved
- Fixed issues with layer list in embedded map: layers are now listed in correct/reversed order and style select is no longer shown if there is only one style to select from
- Added bundle documentation for `mydata`
- Fixed a visual issue with infobox title
- Fixed an issue with opacity setting and vector layer features in 3D
- My places now checks polygon feature validity so users can't save a self-intersecting polygon
- Fixed an issue with userlayer import: input for providing missing projection information is now shown when required
- Printout options panel has been rewritten with React
- Added a workaround for OpenLayers issue with features having a property named `geometry`: https://github.com/oskariorg/oskari-frontend/pull/2110
- Metadata search (`metadatacatalogue`) bundle can now function without the `search` bundle being present in the application. It now creates its own tile/menu item if it can't inject itself into the normal search UI.
- Library updates:
    - OpenLayers 7.1.0 -> 7.2.2
    - moment.js 2.29.1 -> 2.29.4 


## 2.9.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/41?closed=1

- Fixed an issue with GFI functionality on 3D-map module
- Fixed an issue with "Add map layer" button in publisher functionality
- Fixed an issue with removed layers in layer analytics listing for admin
- Fixed a visual issue in background layer selection plugin for map
- Improved metadata search form
- Improved user location tracking visualization so it can't hide itself as well on problematic parts of the background map

## 2.9.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/39?closed=1

### Draw tools

Added an option for draw tools to use a validation limit for length of a line and area of a polygon.
The limits can be set with `StartDrawingRequest` options:

```
{
    ...,
    limits: {
        area: `number in m2 limiting area size`,
        length: `number in meters limiting line length`
    }
} 
```

Enabled modifying a geometry with a limited shape for `Circle`, `Box` and `Square`. Previously modifying a polygon shape was always done in a way that resulted in losing the original shape (new points could be added and individual points could be moved to skew the geometry). The previous method for editing is still available when using the shape `Polygon` to be used for editing.

Fixed issues with intersection checks and measurements results when editing a feature.

### Guided tour

Guided tour implementation has been migrated from jQuery to React. This might affect custom/app-specific bundles that add content to the Guided tour.

Text content should work like before/without changes but any custom actions that for example open a functionality etc needs to be migrated. You can see the changes required for bundles on this PR: https://github.com/oskariorg/oskari-frontend/pull/1927/files

### Admin layer-editor

Admin now has an option to visualize the layer coverage area (when available) on the map in the layer admin visualization tab. This is helpful for debugging issues where layer contents are not shown properly due to coverage area issues.

Vector tile layers now have an option to enable "declutter" which draws labels separately from features. This has some performance implications but can be used to fix an issue where labels are clipped at tile edges.

### Swipe tool

Hover on vector features is now disabled when the "swipe" tool is active. This prevents an issue where features that are not shown due to swipe could be hovered on, bringing them visible.

GFI/vector object data is no longer queried for clicks on "hidden" side of the swipe tool for the layer that is not shown due to swipe.

### Layer selection tool on embedded maps

The layer list implementation for embedded maps has been rewritten with React.

The default UI option is now the rounded dark one with an icon (like most of the other tools) instead of the textual button on the map.

### Publisher

- First steps has been taken on publisher for jQuery -> React migration
- Layer selection tool now allows showing metadata links for layers (option in publisher)
- Fixed an error where map size was not always properly reset from preview size to full size when exiting the publisher
- Fixed an issue where the mobile toolbar was not shown properly when tools were added with the map size preview set to small

### Other fixes

- Marker size backward compatibility fix: https://github.com/oskariorg/oskari-frontend/pull/1947
- Improved support to show diverging statistical data with choropleth visualization
- Searching/filtering layers with text has been improved
- Replaced lot of custom Delete-button impls with the generic on under oskari-ui
- Fixed a visual issue where some icons on buttons were clipped from the bottom when using Safari as browser
- The frontend no longer expects WMTS-layers to have resource urls
- An error notification is now displayed to user if there is a technical problem showing a WMTS-layer (tile matrix can't be parsed etc)
- Added a notification when user adds a layer to map that was previously hidden (a very specific scenario where user adds a layer, hides it, removes it from map and adds it to map again)
- Fixed an issue with the table-component where large continuous content on a cell (like my places feature with a long name without any spaces etc) could push the rest of table columns "off screen"
- Restored proper data provider "groups" for user generated content (my places, userlayers etc)
- Fixed an issue where removing a personal default view on geoportal could reload the page with an unexpected system default (like a 3d geoportal instead of the default 2d)
- Vector tile layers are now listed under "raster layers" filter since they behave more like raster than vector layers from end-user perspective (previously they were not listed under any layer type filters)

### Library updates

- OpenLayers 6.13 -> 7.1 (NOTE! OpenLayers 7.0 dropped support for Internet Explorer)
- geostats 1.8.0 -> 2.0.0
- Unused libraries that were stored under oskari-frontend/libraries have been removed: jstree, clipper

## 2.8.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/37?closed=1

### Announcement functionality improvements

- Announcements can now be localized by the admin
- Announcement description content is now edited with a rich text editor instead of a plain text area
- Admin can now select 3 types of announcements: title only, with description, with external link
- Admin can select hour for the announcement date range (previously only dates)
- Admin UI has been integrated to the end-user UI similar to map layer admin
- Announcements that are not shown as popups are now shown with a new banner UI-component (previously user needed to browse the listing to see if there's anything new)
- Announcements are now shown in Oskari-style popups instead of AntD-modals so they look more consistent compared to other UI-elements
- Admin can now preview announcements

### Map layers

- Data providers are now handled in a similar way as layer groups and are available in `Oskari.mapframework.service.MapLayerService`
- Data providers/layer groups can now have descriptions (improved admin UI and added tooltips for end-users)
- Improved error handling in layerlist bundle
- Implementation changed for how features are highlighted as hover effect (https://github.com/oskariorg/oskari-frontend/pull/1799)
- Hover style is now inherited from feature style instead of defaulting to a hard-coded one

### User generated data listings

- New bundle `mydata` is a drop-in replacement for `personaldata` as a React-based rewrite (the "My data" functionality)
- If your app pushed customized content to `personaldata` you will need to migrate to the new API but `personaldata` is still available (but is deprecated and will be removed in a future release)
- Added created/updated fields for user generated items
- User views and user account tabs can now be hidden by config. Also my indicators is no longer shown if the datasource for my indicators is not used by the instance.
- API changed! Instead of using `PersonalData.AddTabRequest` you now use a service provided by the `mydata` bundle:

```
    const myDataService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.mydata.service.MyDataService');
    myDataService.addTab('userlayers', this.loc('tab.title'), UserLayersTab, new UserLayersHandler(this));
```

Where:
- `userlayers` is the id for the tab
- `this.loc('tab.title')` is the label for the tab that is shown to end-users
- `UserLayersTab` is a React-component that handles state and controller props
- `new UserLayersHandler(this)` is a class extending StateHandler from `oskari-ui/util` that will provide the state and controller props for the previous parameter

See example: https://github.com/oskariorg/oskari-frontend/blob/12dba2584287985026eec3e7eb3a453a855d1d04/bundles/framework/myplacesimport/instance.js#L144-L160

### Thematic maps

- Classification UI has been refactored
- Metadata handling for indicators has been improved
- Reset state now clears thematic maps properly
- Improvements in data parsing for adding user generated indicators
- Removing data from user generated indicator now updates UI choices for that indicator
- My indicators tab in My data: indicator name now opens thematic maps so user can more easily add the indicator on the map.

### Usability

- Some clickable elements have been changed to buttons in DOM and cursors are changed for draggable windows, clickable buttons/icons.
- Major state change in application (like reset/useState for whole app) now triggers `UIChangeEvent` (for cleanup before state is changed) and a new event `StateChangedEvent` after state has been changed. This can be used by RPC-applications to detect state reset by built-in buttons: https://github.com/oskariorg/oskari-frontend/pull/1874

### Bug fixes

- `layeranalytics` data is no longer duplicated on UI when reopening the flyout
- Duplicated id-parameter on proxied WMS-urls has been removed
- GFI is no longer queried for layers with opacity 0
- Fixed an issue where editing a measurement feature could result in multiple measurement result windows for a single geometry

### Theming

Initial theming support for React-based UI-components like Flyout/Popup/Banner (Note! Most flyouts are still jQuery-based).
Also affects the "selected layers badge" for layer count and tool hover-color in `mydata`.
This is still very much work-in-progress and subject to change as we fine-tune what can be customized by theming etc.
We would also appreciate any input and feedback for this.

For testing you can add this kind of snippet in your apps main.js or run this in the browser dev-console:
```
Oskari.app.getTheming().setTheme({
    color: {
        icon: '#FFFFFF',
        accent: '#0c3c62',
        primary: '#009fe3'
    }
});
```

At this point most of the structure can be omitted (using default values instead) and reseting to default can be done by calling `setTheme()`.
The goal is to make the theme serializable as JSON so it could be saved to DB/given through RPC etc.
But to make it easier to use in code there's a helper that is currently located in `oskari-ui/theme/ThemeHelper`
that can for example generate a sensible header text color based on the primary color etc.

An example for making React-components "theme-aware": https://github.com/oskariorg/oskari-frontend/pull/1886

### New components to be used in apps (under `oskari-ui`)

- `TextEditor` (draft.js based rich text editor)
- `PrimaryButton`/`SecondaryButton` that include localization for common buttons
- `DeleteButton` (includes confirmation popup/reduces boilerplate in actual code)
- `IconButton` for replacing clickable divs that hold an icon with button
- `Link` for showing links in a consistent way across the UI
- `Pagination`
- icons: `InfoIcon`, `MetadataIcon` from `oskari-ui/components/icons`

### Improvements to components
- New `showBanner()` has been added next to `showPopup()` and `showFlyout()` in `oskari-ui/components/window`.
- These React-based window-instances are now "managed" so they can be closed externally.
- React-based windows are now closed automatically when `UIChangeEvent` is triggered.
- React popup now handles long titles properly
- React popup now recognizes positional flags instead of always opening centered on screen: https://github.com/oskariorg/oskari-frontend/pull/1836
- `ErrorBoundary` can now include debug info controlled by the developer
- `LocalizationComponent` is now much easier to use and required less boilerplate code
- Added a bunch of CSS-selector classes for Selenium testing (prefixed by `t_`) that are always added when using the common components.
- `GenericForm`, `DateRange`, `ColorPicker`, `Modal` are no longer direct exports of `oskari-ui` to reduce amount of referenced code/optimize min.js. When needed import them with `oskari-ui/components/ColorPicker` etc.

## 2.7.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/38?closed=1

- Fixed an issue where `MarkerClickEvent` events were not triggered properly
- Updated `AddMarkerRequest` documentation to match current functionality (size for external graphics is now handled as pixels)
- Fixed an issue where empty GFI results were shown on map clicks

## 2.7.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/36?closed=1

Layer analytics functionality:
- two new bundles: `layeranalytics` and `admin-layeranalytics`
- the `layeranalytics` is used to gather anonymized data about map layer usage and errors end-users experience with map layers
- the admin functionality can be used to analyze the gathered data to see what layers are used the most and what layers have the most problems
- the admin is shown statistics to detect if the layers are fully non-operational/broken by misconfiguration/service changes or if there's some edge cases that could be corrected by limiting the coverage area of the layer or imposing scale-limits etc to improve the end-user experience
- For more details:
  - https://oskari.org/api/bundles#/2.7.0/framework/layeranalytics
  - https://oskari.org/api/bundles#/2.7.0/admin/admin-layeranalytics
  - https://github.com/oskariorg/oskari-frontend/pull/1759

Statistical maps classification improvements:
- classification UI has been mostly rewritten
- new classification options for diverging data
- legend is now more readable
- external metadata handling for indicators has been refined

Improvements to style editor for vector features:
- area fill patterns tuned (preview is now consistent with map presentation/map presentation updated as well)
- the new editor is now used for markers, my places, userlayers and runtime styling for vector layers (and analysis layers on contrib repository)
- Note! VisualizationForm (jQuery-component) is no longer included in frontend build by default. It has been replaced by the new React-based style editor. If you need the jQuery version you can still import it on your own application (example https://github.com/oskariorg/oskari-frontend-contrib/pull/73), but it will be removed on a future release.

RPC improvements:
- now allows appsetup to expose more events/requests through RPC API
- existing conf designed to restrict. New config allows including defaults + appsetup specific additions (https://github.com/oskariorg/oskari-frontend/pull/1750)
- fixed an issue where feature style declaring stroke width 0 (to hide a border of an area etc) resulted in an error

Layerlisting improvements:
- layer count badge now includes layers from subgroups
- handling of long layer/dataprovider names improved
- opacity field controls no longer hide the %-character

Others changes/fixes:
- localized names are now supported for `myplaces` and `userlayer` layers
- `myplaces` layer edit form now has consistent styling with other Oskari popups
- Search UI width is now limited so having longer description text flows/looks better.
- Layer changes at runtime are now reflected on object data tab names and data provider popup
- Layer capabilities structure changed on server and frontend code was changed to accommodate
- Timeseries player-UI is no longer duplicated after using the publisher tool
- Editing an embedded map with GFI query tool disactivated no longer results in the tool becoming activated on the embedded map
- Option to hide service logo from PDF printouts have been removed

Progress for jQuery to React migration:
- Import userlayers form
- My data 
    - Embedded maps listing
    - Saved views listing
    - Account information
- LocalizationComponent improved
- FileInput added as new component
- Improved the API for React-based flyouts/popups

Updated libs:
- OpenLayers 6.6.1 -> 6.13.0
- ol-mapbox-style 6.4.1 -> 7.1.1
- Cesium 1.84.0 -> 1.91.0
- ESLint 7.1.0 -> 8.9.0 (and various ESLint plugins)
- dompurify 2.3.1 -> 2.3.6
- intl-messageformat 9.9.1 -> 9.11.4
- styled-components 5.3.1 -> 5.3.3

## 2.6.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/34?closed=1

### Map module

- New function: getVectorFeatures() that returns the vector features currently in the map viewport. Takes parameters like geometry and properties to filter the features. Code that shows feature properties in an object data table etc have been refactored to use this function instead. More details: https://github.com/oskariorg/oskari-frontend/pull/1696
- New event: DataForMapLocationEvent. The event is used to notify with the result of a map click that is used for rendering the "GetFeatureInfo" style result for the user. Now it's possible to render the result on the embedding page (requires GFI to be enabled on the embedded map).
- GetFeatureInfoPlugin can now be configured to NOT show the GFI-result. This makes the plugin only trigger the DataForMapLocationEvent and let external code to generate the UI for GFI responses for the user.

### RPC/embedded maps

- The map modules getVectorFeatures() function is available through RPC making it possible to get a list of vector features from WFS/OGC API layers on an embedded map.
- New option for GFI-tool on publisher to enable GFI without showing the results automatically on the map. Allowing the embedding page to render the result by listening to DataForMapLocationEvent.
- New request: MetadataSearchRequest to query service metadata through RPC. The result is returned with a new event: MetadataSearchResultEvent. More details: https://github.com/oskariorg/oskari-frontend/pull/1717
- getAllLayers() function now also returns the data block from layer attributes. This can include localized names for fields etc. It also includes metadataIdentifier if the layer has one.
- Enabled more requests to be used via RPC API: RearrangeSelectedMapLayerRequest and ChangeMapLayerStyleRequest.
- Enabled sending options for `SearchRequest`. See https://github.com/oskariorg/oskari-frontend/pull/1688 for details.
- The `showMeasureOnMap` flag now works on `StartDrawingRequest` when modifying features.

### Improved metadata support for statistical maps

- The UI for showing metadata was refactored from jQuery to React. Also it's now draggable.
- The UI now shows dates for last and next update for the data if the information is available for given indicator.
- The style for how data of an indicator should be visualized on the map/classification can now be configured in the metadata (color scheme and choropleth/points style) instead of always defaulting to choropleth.

### Other fixes

- Enabled measurement results for features drawn by users when the draw type is "Box".
- Improvements for the vector feature style editor.
- The default search UI for geoportals has been rewritten using React  (previously jQuery implementation).
- Fixed an issue where WMS layer style was not sent in GFI requests resulting in responses for default style instead of the one user was seeing.
- Most of the restrictions was removed from search UI: https://github.com/oskariorg/oskari-frontend/pull/1705
- GFI layerformatters are now available for WFS layers (previously only WMS) for customizing GFI display
- Fixed an issue where generated layer groups (like for user generated content) were not always shown in layerlisting depending on what bundles the app was using.
- Fixed an error preventing map layer legend functionality from being shown on the embedded map: https://github.com/oskariorg/oskari-docs/issues/252
- Fixed an issue where dashed lines were not triggering click/hover events on the gaps of the line.
- `printout.PrintMapRequest` works again -> allows opening the printout UI when the functionality is part of the app.
- Fix for global legend when a layer has no styles.
- Removed unused events/dead code: https://github.com/oskariorg/oskari-frontend/pull/1690
- Improvements on the vector feature label handling.
- Fixed an issue regarding layer opacity in URL/links to the map.
- Lodash usage reduced (in order to remove it at some point)
- Added a publisher tool for admins to select instance announcements to be shown on a single embedded map (the one they are publishing/editing with publisher).
- Added initial implementation for showing React-based popups and flyouts:
https://github.com/oskariorg/oskari-frontend/pull/1680
- A generic ErrorBoundary component for React was added for oskari-ui/util: https://github.com/oskariorg/oskari-frontend/pull/1713
- The layer admin functionality for timeseries layers now cleans up unnecessary config when admin switches the UI options. Previously the "range" UI option could leave the layer in misconfigured state: https://github.com/oskariorg/oskari-docs/issues/260.
- Other smaller fixes

## 2.5.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/35?closed=1

- Fixed an issue with my places features where new layers didn't show features on map if the layer style was not modified
- Fixed an issue with my places features where the label on map was not shown on the map
- Fixed an issue where hover style for vector features was not properly updated after modifying the layer style
- Fixed an issue which prevented style changes in the editor for Area-shaped features on Firefox
- Fixed an issue with admin-layereditor when administering WMS-T layer with start, end and interval as time dimension
- Fixed an issue with admin-layereditor when a style was no longer available for a WMS-layer but the layer had a legend configured for the missing style

## 2.5.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/33?closed=1

### Improvements to visual vector style editor
- Added "empty fill" option for area/polygon type geometries.
- Added "butt" option for line-ending options.
- Added pre-defined color selection for easier color picking.
- Area and stroke/line type geometries now have their own controls for line joins. Previously the settings was shared when editing with the React-based visual style editor.
- The new editor is now available for end-users on myplaces layer styling (in addition to layer admin functionality).

### Style handling for vector layers
Various changes to style handling implementation like:
- Hover styling implementation changed to improve performance and clarify code.
- Vector features styles definitions are now available through `AbstractLayer.getStyles()/getCurrentStyle()` with `style.getFeatureStyle()` instead of separate `AbstractLayer.getCurrentStyleDef()`.
- Moved end-user UI implementation for vector layer styling to new bundle `userstyle` instead of being built-in to "wfs-support for map" (`mapwfs2` bundle). This enables smaller filesize for embedded maps since the UI is not available to end-users on embedded maps. To keep current functionality you should link `userstyle` bundle import to your geoportal apps: https://github.com/oskariorg/sample-application/pull/17/files

### Selected vector features
New service was added for tracking feature selection. Usage:
```
const service = Oskari.getSandbox().getService('Oskari.mapframework.service.VectorFeatureSelectionService');
// add a feature to current selection
service.addSelectedFeature(layerId, featureId);
// set feature selection for layer replacing current selection
service.setSelectedFeatureIds(layerId, [featureId1, ...featureIdN]);
// remove a feature from current selection
service.removeSelection(layerId, featureId);
// remove all selections from layer
service.removeSelection(layerId);
// remove all selections from all layers
service.removeSelection();
// toggle feature selection in current selection (if already selected -> unselect, otherwise mark as selected)
service.toggleFeatureSelection(layerId, featureId);

// get a list of ids for features that are selected
const selectedFeatureIds = service.getSelectedFeatureIdsByLayer (layerId);
```
Changes to selection trigger `WFSFeaturesSelectedEvent` like it did before and bundles can react to it like before.

### Performance improvements
- Layer coverage data is no longer part of the layer listing. It is fetched separately when a layer is added to the map. This reduces the file size of layer listing by ~75% and improves performance.
- WMTS-layers tile matrix metadata is now provided by the server in JSON-based format and the full capabilities XML is no longer required to be loaded to the frontend. This reduces the amount of data clients need to load and optimizes startup-time and performance.

### Layer admin improvements
- When adding layers from service the layers are now sorted alphabetically in addition to being grouped by "type". Where type is "existing" (already registered as layer), "problematic" (might have problems with layer/projection not supported), "available" (these are the ones you probably are most interested in adding).
- Fixed an issue with selecting default style when style name was very long (input was pushed out of view of the user).

### Other improvements
- `MapModulePlugin.MapLayerUpdateRequest` can now be used to force vector layers to refetch the features from service (after for example editing a feature). Previously it was mostly usable for WMS-layers.
- Map legends functionality for end-users on geoportal was rewritten with React (embedded maps version still uses jQuery)
- Fixed GetFeatureInfo displaying for XSLT formatted responses.
- Fixed a visual issue on Firefox with layerlisting.
- `layerlist` bundle now closes its flyout on `UIChangeEvent` (when publisher etc functionality is opened by the user).
- Modal-component in oskariui now has styling to keep the window on browser viewport and scroll the modal-window content instead of having a page scrollbar for large contents.
- WMTS-layers can now be forced to use the wrapX boolean toggle for OpenLayers by having `{ wrapX: true }` in the layer options.
- Changed when data is being sanitized for layers. Layer name is no longer sanitized in AbstractLayer.setName(). The UI components showing the name now sanitize the value instead. This might affect application specific extensions to functionalities that rely on the name being sanitized. For jQuery-based UIs this means that you need to call `Oskari.util.sanitize(layer.getName())` or use `jQuery.text(name)` instead of `jQuery.append(name)`. For React-based UI this means that you no longer need to use `dangerouslySetInnerHTML` to show the layer name properly but can use it as is.

### Library updates

- @ant-design/icons 4.2.1 -> 4.6.3
- @storybook/react 5.3.18 -> 6.3.7
- antd 4.8.5 -> 4.16.13
- cesium 1.77 -> 1.84
- dompurify 2.0.10 -> 2.3.1
- intl-messageformat 2.1.0 -> 9.9.1 (now loaded with npm instead of having a copy under libraries)
- Jest 26.0.1 -> 27.0.6
- jQuery 3.5.1 -> 3.6.0
- lodash 4.17.19 -> 4.17.21
- node-sass 4.14.1 -> 6.0.1
- moment 2.24.0 -> 2.29.1
- OpenLayers 6.4.3 -> 6.6.1
- ol-mapbox-style 6.3.1 -> 6.4.1
- olcs 2.12 -> 2.13
- React 16.13 -> 16.14
- Styled-components 5.0.1 -> 5.3.1

Also tested a migration to Webpack 5, but there's some compatibility issues with Cesium and Webpack 5 that prevented the update for now. Also the testing library enzyme doesn't support React 17 yet so couldn't update React further for now.

## 2.4.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/31?closed=1

- Refactored feature data handling to clean up some solutions that were necessary for the old (1.x) WFS-backend but could be improved with the current one
- Improved performance on layer list UI
- Groups without layers are now shown in layer listing if they have subgroups that have layers
- Link function now provides a bit cleaner URLs
- Removed deprecated bundles so we can make better solutions for layer handling without worrying backwards compatibility with older UI implementations. Details: https://github.com/oskariorg/oskari-docs/issues/245
- Improved WMS-layer legends handling for admin UI
- Other smaller fixes

## 2.3.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/32?closed=1

Added support to get timeseries metadata from feature property as year (typed number) in addition to parsing year from date.

## 2.3.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/30?closed=1

### Swipe tool

New tool for geoportals to allow users to compare two layers. The tool adds a vertical "splitter bar" in middle of the map where the layers are shown normally on the other side and the top layer is not shown on the other side. This allows the user to compare layers side by side and drag the viewport for easy comparison (especially for fully opaque layers).

![Swipe tool demo gif](https://user-images.githubusercontent.com/1997039/113302102-6648ca80-9308-11eb-841b-8aea1c7980f4.gif)

### Admin functionalities
- Layers are now updated properly on listing and map when admin modifies them (without page reload).
- The additional data tab now provides layer id with created/updated timestamps data.
- Fixes to capabilities handling and "update now" on layer capabilities data.
- Layer metadata UUID improvements: now shows both the original and possible override for it. Previously original wasn't saved so it couldn't be updated automatically from capabilities either.
- WMS layer legend improvements: legend can now be defined per style instead of one per layer and admin is shown the url from capabilities in addition to the one that has been overridden by the admin tools.
- Unique name is no longer required or asked by the admin UI for MVT layers.
- Credentials fields should no longer autocomplete saved passwords when registering layers.
- Improved error handling for unsupported layer types.
- Fixed an issue where the visual vector feature style editor resulted in different color for features compared to the one that was selected on the editor.
- Added maximumScreenSpaceError field for 3D-tiles layers.

### Scattered timeseries user interface improvements
- Added a new mode called "single year" which enables the user to select one year at a time using the timeseries slider.
- The user can now switch between "single year" and "time range" modes when admin selects "range" type UI for end-users.
- Single year UI is the default for end-users.
- Timeseries map tiles are only loaded as singleTile for "player" UI (for buffering) making the scattered timeseries more slick to use with tiled maps (making them cacheable etc).
- Changed how WFS-based metadata is visualized. The features are no longer drawn on the screen if admin doesn't specifically enable them. When zoomed out of range for WFS-metadata the timeseries data "dots" on the UI control used from the WMS timeseries data which is not as accurate. The WFS features are no longer used as an index map.
- The selected time can now be saved as part of appsetup state and requested with a control parameter in URL i.e. a view can be now shared as a link with selected time or range of time.
- Other visual and usability fixes.

### Hierarchy support for layer listing

The React-based layer listing UI have been improved to support group hierarchy as described here:
https://github.com/oskariorg/oskari-docs/issues/234

This change makes the `hierachical-layerlist` bundle obsolete and enables us to move forward with removing the old/deprecated versions of layer listing and administration implementations from oskari-frontend. This will be removed in the next version and allows us to further optimize and enhance the layerlisting to make these functionalities better for everyone.

Note! Layers are now required to have "group" registered in the map layer service to be listed in a group. Previously groups were generated by group names without "tangible" groups to link to.

### Application specific extension hooks added

#### RPC improvements

Application specific code can now register new functions for RPC that can be exposed as API for embedded maps. See an example here: https://github.com/oskariorg/oskari-frontend/pull/1485

#### Custom GFI response formatting

Added support for application specific formatters for GFI response: https://github.com/oskariorg/oskari-frontend/pull/1481

### Runtime vector layer improvements
- Layer can now be registered for frontend service without adding it to the map.
- Adding features to a hidden layer leaves the layer hidden instead of making it partly visible.

### Thematic maps
- Removing the statistical region set layer from map no longer removes selected indicators.
- The statistical region set layer is available in layer listing before any indicators are selected.
- If no indicators have been added and the user adds the region set layer to map the statistical data search window is opened automatically.

### Other
- Changed the way WFS-/vector feature layers handle feature property name localization. The data is now available in a more usable format for the frontend.
- Vectorlayertile now supports options.declutter flag that is passed to OpenLayers if configured.
- GFI requests can now have layer specific additional parameters. For example "time" parameter is now sent to GFI requests for timeseries layers.
- My places descriptions now allow more characters (for example `&`).
- Added a button for end-users to download my places features as GeoJSON.
- Layer names with special characters are now shown correctly.
- 3D tiles layers now support the same "Oskari style" definition structure as WFS layers. Previously the extra featureStyle key was not supported.
- Tooltip and Confirm components in 'oskari-ui' import should no longer give warnings when they have a styled-component as direct child.
- Trying to set application state with "null" or empty object will now be ignored and triggers a warning to dev-console to use resetState() instead.
- Oskari.app.playBundle() no longer causes another `app.start` event to be triggered.

## 2.2.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/29?closed=1

- Fixed build issues that were caused by updates on dependency libraries after 2.1.0: https://github.com/oskariorg/oskari-docs/issues/241
- Added a new bundle `announcements` (and corresponding `admin-announcements`) that can be used to show messages/service announcements for end-users when the page is loaded.
- Optimize printing to drop references for hidden (or fully transparent) layers.
- VectorLayerRequest now supports min/max zoom levels to limit visibility of features on the layer.
- Fixed an issue where sending a VectorLayerRequest with `remove: true` and an unrecognized layerId added a layer instead of ignoring the request. If the layerId was recognized the layer was removed correctly. Now the request is ignored for unknown layers.
- Added a "Modal" component wrapper for AntD modal in oskariui.
- Tuned end-user messages when search returns more results than we are shown on both embedded map and geoportal.
- Fixed an issue with layer list filters.
- Tuned the map loading indicator/progress bar.
- Fixed an issue with selecting/unselecting vector features with clicks.
- Replaced icons on hierarchical-layerlist and corresponding layer admin functionality.

### Time series layers (WMS-T)

Added new options for time series layers configuration. Admins using the admin-layereditor bundle can now configure what controls to show the end-user for time series layer:
- the previously implemented "player" UI
- a new "range selection" UI
- set the layer to ignore time series data (not show any additional controls for the end-users for time series).

The "range selection" is a new UI that helps showing data that is scattered in time and location. An example of this can be orthophotos where the photos are not taken periodically (~yearly) for the whole area (~country) and the data could be from only one region on current year and the next region has data for the following year or a couple years from that. The end-user is allowed to select a range of years that are used as a WMS-T time-parameter giving the end-user view of the data of selected year range. The admin can also link a WFS-layer that will be used as index metadata for the scattered data. The linked WFS-layer is queried for features on the current viewport and based on the attribute data of the features the range selection is enhanced by only highlighting years that have data for the current viewport instead of based on the whole WMS-T time series data.

Image from admin UI: https://user-images.githubusercontent.com/1997039/102089581-1a3f4c00-3e25-11eb-8d8b-052f7b0e9845.gif

Note! This will be further developed for the next version.

### Vector style UI for admin-layereditor

This version adds a new React-based component that can be used to define styles for vector layers. This component has been added to the map layer admin UI in addition to the current JSON-field so we can test it more before migrating the end-user style editors from the current jQuery-based ones to the new implementation. The JSON-field for styles works like before and using the visual editor changes the content of the JSON-field. Having both enables using fancy things like conditional styles (using the JSON field) and helps us make sure that the visual editor works properly and only modifies parts of the style JSON that the visual editor recognizes, ignoring and keeping the JSON-keys that it does NOT recognize.

Also fixes some issues with selecting a default style for a WFS-layer.

### Other changes for admin-layereditor

- Legend image urls can now be configured/overridden for each style a layer has.
- Parsed capabilities JSON is now available for viewing on the admin UI (helps debugging potential problems)
- Fixed an issue where adding a duplicate layer from a service was not possible because confirmation was shown "behind" the UI window preventing admin from seeing it and proceeding.
- Added UI toggles for 3D tileset layers to allow more control on how Cesium renders the tilesets

- Update libraries:
  - AntD 4.3.3 -> 4.8.5
  - Cesium 1.74 -> 1.77
  - olcs 2.11.3 -> 2.12
  - ol-mapbox-style 6.1.4 -> 6.3.1
- Tested updating OpenLayers 6.4.3 -> 6.5.0 but due to point symbol clipping on vectortiles we needed to rollback. The issue has been fixed for the next OpenLayers version but a version including the fix hasn't been released yet.

## Upcoming changes!

We currently have multiple implementations for map layer listing and admin functionalities. We are planning on removing some of the unmaintained ones after 2.2.0 and I'll send an email for this on the mailing list so we everyone following it is aware of this and can affect the decision.

## 2.1.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/28?closed=1

Additions:
- ZoomToFeaturesRequest now supports an additional flag that can be used to limit how "close" the map should be zoomed to/usable when theres a single point feature to be zoomed to or features close to each other.
- VectorLayerRequest now allows vector layers to be cleaned out (previosly you could just remove features from the layers but not the layer itself via RPC)
- Vector features now support progress bar as well (features added with AddFeaturesToMapRequest)
- Added localizations for the new layerlist bundle for french and russian
- Added initial implementation for a generic React-based form component (used in the new my places form)

Functional changes:
- Printing no longer opens a new window for the result. Instead it opens a file download for the pdf/png. This fixes an issue where saving the pdf from the preview window failed on some browsers.
- Added a confirmation when user clicks the "reset map state" button
- Added a tooltip for layers that have "unknown" availability status on the layer listing (previously a popup was shown with the same info).
- The search description is now more generic and no longer mentions things that are specific for each Oskari instance like real estate identifiers. See linked PRs for https://github.com/oskariorg/oskari-frontend/pull/1350 on how to override this in an instance.
- My places form has been refactored. The form is no longer tied to the map location so it can be moved out of the way when editing the geometry. Previously the form could block some parts of the feature geometry making it impossible to modify the geometry on some cases.

Fixes:
- Fixed an issue where adding a my place to an existing layer before opening the layer in my data failed to load the existing places on the layer for listing
- Search in embedded maps now shows a message if the search limit was reached (too many results handling)
- Improved performance of layer listing/adding vector features to the map with vector layer changes. Most visible change in the geoportal performance regarding this is on thematic maps.
- Fixed an issue where metadata search removed all vector features from map when it was closed (for example removed thematic maps)
- Fixed an issue where getting feature attributes from MVT-layers wasn't working as intended
- Changed the way MVT-layers are handled if not supported by the map-implementation (wrong projection/not supported in 3d etc). These layers are now referenced in links if they are in selected layers even when they are not actually shown. Fixes an issue where changing between 2D and 3D appsetups removed MVT-layers from selected layers.

UI-issues fixed:
- Long style names are now handled better in selected layers listing
- Fixed a style bleeding issue with printout bundle/fixed language select width on publisher-bundle when printout-bundle was not part of the appsetup
- Fixed an issue with icons in statistical indicator listing
- Fixed an issue with the mobile toolbar on the map where the map height was not properly calculated on mobile mode.

Updates for libraries:
- Update OpenLayers: 6.3.1 -> 6.4.3
- Update CesiumJS: 1.62 -> 1.74
- Removed special Cesium handling from 3D mapmodule usage. Manual changes required for Oskari-based 3D-applications. See required changes in sample-application: https://github.com/oskariorg/sample-application/pull/15
- Continued replacing lodash usage with native functions

Documentation:
- Printout bundle documentation updated
- Improved ZoomToFeaturesRequest documentation
- Improved VectorLayerRequest documentation
- Improved vector feature styling documentation
- Separated feature attribute based selector documentation to it's own page since it's now used with both styling and filtering vector features
- StartUserLocationTrackingRequest/StopUserLocationTrackingRequest have been marked for RPC usage on documentation so they are easier to find since they have been available with RPC since they were added

## 2.0.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/27?closed=1

The 2.0 release is mainly for upgrading server-side components but we want to keep the frontend and server versions in sync. We do have a couple of bug fixes included since 1.56.0 but nothing that blows your mind with 2.0 fanfares:

- Added possibility to show raw HTML from localization with Message-component
- Fixed a bug in publisher that resulted in wrong tools being selected to embedded maps than ones based on user choices
- Fixed a visual issue with popup height in admin functionality when more than 3 locales are enabled in the Oskari instance
- Fixed an issue with MapMoveRequest when requested coordinates required reprojection
- Bumped node-sass and lodash versions
- Fixed an issue with infobox title height when an empty tag was provided as title
- Fixed an issue with infobox when opened to 0,0 coordinates (coordinates are required as numbers now)
- Fixed an issue with scales (optional field enabled with configuration) in printout 
- Fixed an issue with user generated statistical data import from clipboard
- Fixed an issue with measurement tools on embedded map
- Fixed a visual issue with 3D-timecontrol plugin
- Improved and fixed some translations in publisher and admin for sv and en languages

## 1.56.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/24?closed=1

### Map layer administration (admin-layereditor)

- Possible validation errors are now shown collectively when trying to use the save button instead of the button just being disabled
- Scale limit handling fixed and UI for limits made clearer
- Added "single tile" toggle in the admin-layereditor UI for WMS-layers 
- Render mode/collection type selection fixed

### Print functionality

- Unavailable options are now disabled for PNG format
- Misleading print preview link removed
- Markers done with the coordinate tool can now be printed as well
- Custom styles are now passed to the print functionality

### WFS/Vector features

- Added configurable formatters for WFS-layers featuredata "gfi" popup. For config/details see: https://github.com/oskariorg/oskari-frontend/pull/1307
- Tooltip for WFS-layer features (enabled with styling) should no longer block events from reaching the map making them more useful
- Files that were used by the old "transport" implementation continue to be cleaned out (documentation still has references...)
- My places GFI popups are now handled as WFS-data with formatters (so the formatting is a a bit different in this release)

### Build performance tuning

The recently added examples with 3D-libraries makes build take 3x time. We are still considering how to handle this on the sample app so on-boarding/"unboxing"/first build wouldn't not be too terrifying.
If you don't use the 3D apps we recommend removing them from the application-specific repositories when using sample-application as template.

### AntD UI-components library version update

AntD has been upgraded from 3.x to 4.x. This includes breaking changes for icon usage. See details here: https://github.com/oskariorg/oskari-frontend/pull/1302
The good news is that the change in icon handling reduces the size clients need to download on their browser for Oskari apps by around 500kb (~200kb gzipped).

Also we changed the `<Message />` tag so it can be used without localization (helps when creating tests for example).

### Other library updates and Node JS version

With the latest library updates the required version of NodeJS is now 10 (previously 8).
We noticed that upgrading from NodeJS version 8 to version 12 improves build time by 25% or more so we encourage upgrading to the latest LTS.
Errors from new coding conventions from ESLint upgrade have been overridden as warnings for now. This means that they won't break PRs but will be highlighted in an IDE like Visual studio code.
Jest upgrade affects async tests and/or testing code that uses setTimeout() but should otherwise be transparent to developers.

- Library updates: jQuery, jsts
- Build-library updates: Babel, Webpack
- Test library updates: ESLint, Jest, Enzyme

### Tests for the frontend and lodash removal

Tests have been added for parts of mapmodule and the code has been refactored a bit for better enabling testing. This comes as a by-product of code refactoring for removing the lodash dependency. Lodash was awesome previously but now we can use native JS functions instead of it thanks to the build process change to webpack and transpiling. Most of the code using lodash assumes it is linked as a global _ variable which makes understanding and testing the code more difficult than it should be. It also assumes the version of lodash is 2.x using functions that have been removed from the 4.x version mentioned in package.json so it's even more problematic/misleading.

Any bundles under mapping no longer uses lodash and we will continue working on removing it until we can just drop the dependency. So please use the native versions instead on any new code.

### Other changes

- Thematic maps tool UX/state handling improved
- Accessing map publishing functionality no longer breaks the feature info query tool
- Measurement tool now provides more accurate results
- Map layer filter now includes option for "all layers" - Previously clearing the filter was unnecessarily hidden as a simple x icon (layerlist bundle)
- User-generated public content from other users are now grouped under "no group" instead of "user layers/places" to make it more apparent that they are not the current users layers
- My places features are now loaded in smaller pieces for the my data listing (based on the layer selected instead of one big chunk) improving startup time
- 3D camera mode tool now introduces itself in the guided tour
- Dimension change bundle now tries to transform marker coordinates when changing projection
- Version number for Oskari.VERSION now comes directly from package.json (it's not duplicated on code base)

## 1.55.2

- Fix issue with styles on user generated content (myplaces and userlayer layers)
- Fix visual/layout issues with map scalebar and index map
- Update OpenLayers 6.2.1 -> 6.3.1
- Restore an undocumented option for MapMoveRequest to work with just giving bounds without center coordinates. No documentation added as we don't recommend using MapMoveRequest without mandatory x and y coordinates. As bounds can be used to adjust viewport (location and zoom) as only parameter we will probably move this possibility to another request in the future.

## 1.55.1

Main reason for this hotfix was a problem with a vector tile styling library that prevented vector tile layers from being rendered (fixed in https://github.com/openlayers/ol-mapbox-style/pull/262).

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/25?closed=1

Updates to libraries:

- OpenLayers 6.1.1 -> 6.2.1
- ol-mapbox-style 5.0.2 -> 6.1.1
- React 16.11.0 -> 16.13.0
- Styled-components 4.3.2 -> 5.0.1
- React-beautiful-dnd 12.0.0 -> 13.0.0
- mobile-detect 1.4.3 -> 1.4.4
- Removed html-to-image

Other changes:

- Changed implementation for mapmodule.getScreenshot() to restore support for IE
- Removed misleading old/deprecated documentation/files
- Fix how supported projections for layers are shown on admin-layereditor

## 1.55.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/22?closed=1

New bundle for layer administration: admin-layereditor
- Currently integrated with layerlist bundle (the React-based layerlisting option) but works with the Oskari request/event API and so can be easily integrated with other layer listing bundles as well
- LayerModelBuilders now provide information about the layer data they require to function and the fields shown for specific layer type depends on that
- Also the layer types and versions for layer types that can be managed by the admin is based on layer plugins so this is more extendable approach than before
- Validation is based on mandatory fields metadata provided by server so the frontend can tell the admin if the server will accept the layer info or not before trying to save it
- Error handling is much better when adding layers. Reasons for problems are communicated more clearly and in more detail (timeouts, unexpected response from server and what the admin can try to resolve these)

3D:
- Added a tool/plugin that can be used to control time on the 3D mapmodule. This will affect time in Cesium.js so mostly shadows/sun position at this stage. Time is controllable with the request/event API so RPC can be used for this as well.
- Added a tool/plugin that can be used to control camera for accessibility when mouse/touch dragging is challenging
- SetTimeRequest for 3D mapmodule controlling date/time for shadows etc

React components
- Moved common components and utility to src/react (previously under a bundle)
- Added Message component for showing localized UI texts
- Added Messaging component for showing notifications (might be renamed to avoid confusing it with Message component)
- LocalizationComponent for providing a localizable field for each supported language (common component with admin functionalities)
- Added a sample bundle for documentary purposes: https://github.com/oskariorg/oskari-frontend/blob/develop/bundles/sample/mymodernbundle/

Other fixes/improvements:

- Fixed an issue with infobox on Firefox: https://github.com/oskariorg/oskari-docs/issues/157
- Added support for adding multiple custom styles for vector layers in preparation for allowing user to save them (WFS-styles the end user can modify are currently runtime only)
- Fixed publisher tool layout options
- Fixed issue with indexmap
- Fixed some issues with geolocation tracking functionalities
- Publisher now has a "copy to clipboard" functionality like the link tool
- Allow download of feature data table for user generated content (my places/userlayer)
- Added icelandic translations
- Improvements/fixes for statistical data searches/data fetching/diagram
- Added text overflow support for vector feature label styling


## 1.54.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/23?closed=1

- Fixed an issue where user generated my places seemed to disappear while adding new ones
- Fixed an issue where clicking on an infobox that was NOT opened by map click/GFI caused a new map click to be triggered when clicking the close icon
- Fixed an issue with statistics indicator selector not working properly on some mobile devices/native scroll component.

## 1.54.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/20?closed=1

- Optional 3D-capable mapmodule based on olcesium has been added to Oskari
- OpenLayers version has been updated to 6.1.1 (Note! paths with /ol3/ references have been updated to /ol/ and you might need to manually update the main.js of your app. See oskari-server/MigrationGuide for details.)
- Added new React-based bundle implementation for layer listing: framework/layerlist
- Conditional styling API for vector features has been improved to support ranges etc
- New option for MapMoveRequest to animate movement
- New request MapTourRequest for programmatically moving the map through multiple places in a "tour like experience"
- Performance improvements for vector feature layers
- Fixed an issue on vector feature styling where a png-icon became "colored" unintentionally
- Fixed an issue for autocomplete search where spinner was left spinning indefinitely
- Added new config options for user location tracking (publisher functionality has UI for these to customise embedded maps)
- Oskari.urls.getRoute() now supports a parameter object. Domain validation method has been added to Oskari.util.
- Added some more russian translations
- Other fixes and improvements.

Build & components:
- Added oskari-ui alias for Oskari's React/AntD-based UI-component library.
- Improved naming for UI-components like Panel -> CollapsePanel to separate it from other types of Panels etc
- Introduced a "mutator" concept that is passed to React components via context
- Fixes for conflicts between current styles and AntD styles

## 1.53.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/21?closed=1

- Remove unnecessary scrollbar from search UI
- Fix broken icon on admin-hierarchical-layerlist
- Fix loading spinner on search when search term is invalid
- Fix an error with adding layers on publisher when using it with hierarchical layerlist.
- Allow empty domain for publication on RPC (previously made optional on publisher)

## 1.53.0

Sample application has been removed from oskari-frontend/oskari-server to new repositories sample-application (for frontend) and sample-server-extension (for server). This is the way we see Oskari being used/developed in the future. More as a framework with applications developed on top of it. This also allows better separation of the application content/configuration regarding migrations etc. See README.md on both repositories for details on how to setup your own app.

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/18?closed=1

- New WFS-implementation used be default. See oskari-server/MigrationGuide.md for changes required to application main.js
- Improvements for styling vector features like hovering as all WFS-layers now use vectors on map instead of raster images
- Vector features can now be clustered
- Domain field for embedded maps is now optional
- Loading spinners added and improved for search and statistical maps
- StartUserLocationTrackingRequest/StopUserLocationTrackingRequest are now allowed over RPC by default
- Improved the guided tour functionality
- Added a way to register checks if layer is supported by the current application (projection & 3D checks for example)
- Preparations for including a 3D mapmodule
- Fixed opacity field/slider interaction
- Initial Ant Design components theming with 'less' styles. Future for styling options is still under consideration as we now have SCSS, Less, styled-components and plain css
- Toolbar now works better with light background
- Improvements for user indicators on statistical maps
- Refactored DefaultExtension bundles to use ExtraFlyout instead of DefaultFlyout so flyouts are handled similarly between functionalities.
- Index map now shows the first visible WMS/WMTS layer by default instead of the first layer (that might be a vector layer without any features). 
- Printing uses the same logic for preview image (showing the visible layer)
- Layers with time series now include currently shown time on prints
- Drawtools (like measurements etc) now use smaller snap tolerance on desktop to make it harder to accidentally stop measurement by clicking near the previous point
- Initial test framework for frontend tests added using Jest
- Build scripts now use version from package.json by default (overridable with the same syntax as before)
- Other improvements

## 1.52.1

Fixed an issue where markers added to map were always colored black. Now they can be made as colorful as before.

## 1.52.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/17?closed=1

- Styling for vector features has been improved. See new options in http://oskari.org/documentation/examples/oskari-style
- New bundle "language-selector" has been added. It requires an element with id "language-selector-root" where it renders itself. Allows the user to change between the supported languages of the Oskari instance.
- Added support to show localized variants of placenames on the geoportal search result listing
- Session timeout notification now allows user to extend the session
- Improved performance of the layer listing with long layer lists
- Improved performance of the feature data table when multiple features are selected
- Fixed issues with publisher when preview had open menus and user clicked "change location of components"
- Fixed an issue where publisher terms of use acceptance wasn't handled properly
- Fixed an issue in thematic maps where guest users couldn't view indicators they just added
- Fixed an issue in thematic maps where indicator data having 0 as value was handled as no data
- Fixed an issue on hierarchical layer-admin where some buttons were placed outside the UI on some screen resolutions
- Fixed an issue on hierarchical layer-admin where removing layer group or moving one to a new parent caused an error
- Fixed an issue on hierarchical layer-admin with changing layer style
- Fix for sprite generation tool for customizing icons on an Oskari instance
- Added French and Russian localizations
- Other small fixes and tuning
- ESLint rules tuned
- Library updates

Frontend changes for the new WFS-integration system:
- add "wfsvector" after mapwfs2 bundle import in main.js if you want to try the new backend (see oskari-server migration guide):
```
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/mapwfs2/bundle.js';
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/wfsvector/bundle.js';
```

Initial React-based UI changes (work in progress still):
- Thematic map legend has been rewritten and is now implemented with React components
- Added "Storybook" to improve developer experience on component development (https://storybook.js.org). Run "npm run storybook" to see how it looks.
- Added utils for React-based development to src/react (also has an alias "oskari-ui" for Webpack/imports) 
- Initial React based UI-components added but still need work as they have some global styling that affect rest of the UI
- Added styled-components library to dependencies (current plan is to move away from SCSS start migrating towards styles-components)
- New implementation for React-based maplayer admin has been added to bundles/admin/admin-layereditor (the new UI components are under this bundle for now and the functionality is not finished yet)

## 1.51.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/16?closed=1

- The diagram window for thematic maps functionality is now resizable and the bars are now colored based on the classification.
- Fixed an issue with hovering point symbols on thematic maps.
- Thematic maps now skips empty data sets when user adds multiple indicators at once.
- Thematic maps indicator description is now provided in the UI if data source includes description.
- Thematic maps rendering and performance improvements.
- Thematic maps manual classification now has discrete steps instead of continuous histogram.
- Thematic maps tools are now in the same container in embedded maps instead of being scattered between toolbar and thematic maps UI toggle.
- Build now supports React-based components.
- Fixed an issued with 'Square' shape in drawtools.
- Added an alternative frontend functionality for handling WFS-layers (based on MVT and GeoJSON).
- Link tool no longer shows Guided tour option if it's not available on the instance.
- Link tool now skips any saved state from cookies.
- Layer filtering fixed on hierarchical layerselector.
- Fixed an issue with admin functionalities on hierarchical layerselector.
- Empty searches are no longer sent to server on metadata catalogue.
- Fixed an issue where marker text input was breaking out of the popup it's shown in.
- Fix for attribute name localization on userlayers.
- Unified how decimals are shown on different functionalities showing measurements.
- Unified button order on UIs (cancel/ok in same order on each functionality).
- Added french localizations.
- The latest RPC-client version is now recognized as supported.
- Map rotation is now saved in state (saved views/embedded maps/page reload).
- Myplaces functionality now uses WMS 1.1.1 to work around axis order issues.
- User location detection now supports tracking and drawing the route on map (no UI for this, usable via RPC).
- User location now supports accuracy for location and configurable zoom level.
- Users can now add map layer style menu for embedded maps.
- Toolbar button logic has been rewritten https://github.com/oskariorg/oskari-frontend/pull/754
- Session expiration dialog now shows a countdown and reloads the page after session has expired.
- Support for Bing maps added (required API key from Bing).
- Other small improvements and bug fixes.

## 1.50.0

Updated CometD client library to work with updated server components.

## 1.49.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/14?closed=1

### Build script

The build script has now been completely migrated to Webpack and the old tools-scripts have been removed. Changes for the new script from 1.48.0 is that builds no longer point to a single minifierAppsetup.json but a directory hosting apps that can have the json-file OR main.js file as it's a common use case to have at least one app for the geoportal and another for the embedded maps.
The parameter for builds changed from "env.appdef=applications/application/guest/minifierAppSetup.json" in 1.48.0
 to "env.appdef=applications/application" in 1.49.0. When the build is run it also generates a "main.js" file based on the minifierAppsetup.json. You can remove the json-file after running the build for the
 first time and start using the main.js as the main entrypoint for the app.

 Bundles can now be loaded "lazily" meaning "lazy" bundles are not part of oskari.min.js but can be loaded and started as usual when referenced. This can be used to minimize the initial JavaScript payload users have to download. Bundles that aren't used by all the users like admin bundles should be included in the app as "lazy".

 The devserver now passes additional http headers to Jetty so forwarded requests like logging in work properly with it.

 The separate css-files that were previously referenced on the HTML (forms.css, portal.css and overwritten.css) have all been included in the oskari.min.css file. Icons.css is still a separate file. jQuery is now included in oskari.min.js as well.

#### Other build script improvements
- Build script now provides a way to be used from another repository while referencing code from  oskari-frontend/oskari-frontend-contrib repositories enabling application specific repositories like nls-oskari/pti-frontend.
- Added a flag for build script to use absolute paths instead of relative
- Added a script to create the sprite image for customized/app-specific icons.
- `babel-polyfill` has been added to the build for IE support

### Code quality

The code base has been formatted with ESLint configured settings. Any pull requests made in GitHub are now automatically checked against these rules using Travis CI. You can also check the settings by running "npm run test".

Most of the calls to deprecated functions inside the oskari-frontend code have been updated to use the new versions of the functions so the developer console should only have warning for customized apps using deprecated functions. Note that the deprecated functions will be removed in a future version and you should update your apps to match the changes (see the browsers developer console for details). If you see no warnings it's all good for your app.

### Cleanup

Much of the app-specific functionalities and unmaintained code have been moved to a new repository: oskari-frontend-contrib. These can still be used with any oskari-applications, but they are not "officially" supported.
Now everything in the oskari-frontend repository should work with new versions.

Also removed CSS-files that had corresponding SCSS files so it's clear which one to edit.

### Thematic maps improvements
- Improvements for diagram flyout
- Selected indicators are now listed on the indicator selection flyout and selections can be removed from that listing without the need to go the data table flyout
- Performance improvements
- Flickering reduced on statistical timeseries/indicator switching
- Color animation added for timeseries
- Other improvements and error handling added
- The select component has been changed for indicator selection flyout
- Map region borders are now shown even on point visualization

### Other changes
- Initial support for MVT vector tiles (the new example app now uses OpenMapTiles as basemap)
- Vector tile layers can be styled using the Oskari style definition OR Mapbox styles
- Openlayers updated to 5.2.0 (as npm dependency so using it has changed to ES6 imports instead of using the global "ol" object)
- Some of the code like the mapmodule implementation has started migrating towards ES6-modules.
- User geolocation can no longer move the map outside the map extent
- Color selection for myplaces etc user generated styles now have a new color picker component
- The info icon placement has been modified in printout and publisher to match the UI guide
- MapLayerService.registerLayerModel() now supports functions/constructors as modelbuilders in addition to name to pass to Oskari.clazz.create()
- CSS-styles have been streamlined and references to missing resources have been removed.
- Publisher theme selection and the theme on map are now in sync. Previously you mnight have gotten the geoportal style on preview, but end up with the default style embedded map. This happened if the geoportal had customized style/didn't have the default style
- Content-editor and Download-basket bundles have been updated to work with current Oskari libraries (OpenLayers 5)
- Fixed a bug in printout where zoom-levels on the map got mixed up after visiting the printout functionality
- Admin layerselector now has a field for layer "options" which content is layer type specific (vectortilelayer styles are added using options)
- Metadata presentation fixes and error handling
- Fix for customized styles when user draws on the map
- Link tool now allows user to select if guided tour should be skipped on link and if center marker should be shown
- Toolbars tool selection color now works better on themes with light background
- Fixed https://github.com/oskariorg/oskari-docs/issues/79


## 1.48.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/12?closed=1

- Timeseries support for statistical maps.
- Lots of improvements for statistical maps in general.
- Cross-site request forgery protection added for the server and frontend now sends the token in XHR calls.
- Action routes changed from using HTTP POST instead of GET for write operations to prevent CSRF issues.
- Some (internal) changes to the class system to make it more compliant with Webpack based build and ES6+ modules.
- A new request 'VectorLayerRequest' has been added that enables vector features to have hover functionality in conjunction with 'AddFeaturesToMapRequest'.
- Some of the features in 'AddFeaturesToMapRequest' are now part of 'VectorLayerRequest' and have been deprecated/will be removed in a future version. See api/CHANGELOG.md for details.
- jQuery version compatibility changes. Frontend code now works with 3.3.1 jQuery and server has been updated to use it.
- jQuery 1.10.2 works as well, but from now on it's assumed that the newer version is used.
- jQuery UI has been updated from 1.9.2 to 1.12.1
- Publisher tools handling and resuming normal operations after publisher has been improved.
- Improved placement for UI-elements/plugins that are shown on top of the map.
- API doc improvements
- 3D map engine improvements (under paikkatietoikkuna as it's still app specific)
- Popup now tries harder to stay on screen on small displays.
- Fixed an issue with map layer admin and adding/editing grouplayers.
- A new function Oskari.getNumberFormatter([optional fraction digits count like 2]) has been added to the core for formatting numbers with given decimal accuracy.
- Improved projection/axis order handling for userlayers and my places.
- Improvements to drawtools.
- Measurements for myplaces listing and measurement/draw tools are now calculated with the same method in mapmodule instead of myplaces having another function for it.
- Mapmodules measurement function now works properly for MultiPolygons and degree based projections.
- Fixed an issue where map drag/pan was broken with the Chrome 69 after zooming with double click

New build script has been introduced for 1.48.0. The old one still works, but will be dropped in the next version:

### Webpack build

It is now possible to build the front-end application code with Webpack. In the next release (1.49.0) this will be the only supported build method.

#### Preparations

Make sure you have at least Node 8.x / NPM 5.x. Run `npm install` in the front-end repo root.

#### Run in development

Webpack dev server is used to serve the JS bundle and assets when running in local development. XHR calls will be proxied to the Java backend assumed to be running on localhost:8080.

So that the server knows to look for the JS bundle and assets from the right place, we need to change the Oskari-server `oskari-ext.properties` and add

```
# set development to false or comment it out to load using minified javascript
development=false
oskari.client.version=dist/devapp
```

To start Webpack dev server, we point it to the miniferAppSetup.json file for the application we want to start, here Sample app as example:
`npm start -- --env.appdef=applications/sample/servlet/minifierAppSetup.json`

When you see "Compiled successfully." in the terminal, you can open the app in the browser at localhost:8081.

The dev server has automatic reloading enabled when you save changes to JS code and hot reloading for S/CSS without need for full browser reload.

#### Build for production

To build minifed JS and assets, run:
`npm run build -- --env.appdef=1.48.0:applications/sample/servlet/minifierAppSetup.json`

The number before the colon sets the directory name, here producing files under dist/1.48.0/servlet/

Note: The 1.48.0 release of Oskari server still has a reference to bundles/bundle.js in the JSP. This file is no longer needed because it's part of the webpack bundle. Replace this file with an empty text file on the production server if you intend to use the webpack produced bundle.


## 1.47.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/13?closed=1

- Fix for user generated statistical indicator removal.
- Fix for loading progressbar for layers using single tile loading.
- Fix for coordinatetool localization handling.

## 1.47.0

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/9?closed=1

- Statistical maps now allow for filtering listings based on regionsets and adding more than one indicator at a time
- Users can now use and save custom indicators for statistical maps
- Fixes for statistical maps UI in geoportal
- Layer filters in layer selector are now hidden when selecting the filter would result in empty layer listing
- Geoportal map style is now properly reset after exiting publisher functionality (previously always reset to default style)
- More plugins now support styling in publisher functionality
- Timeseries functionality can now be included in embedded maps (when there's a layer providing timeseries data)
- Publisher can now be opened automatically on startup (Usability improvement when having embedded maps in multiple projections)
- Checking "Don't show this again" in guided tour now works again
- Bugfixes on publisher, hierarchical layerselector and feature data table

## 1.46.3

- Fixed JS errors when saving myplaces features.
- Fixed an issue where featuredata button was shown on the UI when is should have stayed hidden after browser window resize.

## 1.46.2

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/11?closed=1

- publisher now remembers the original tool style and no longer resets to default style on exit
- fixed layer/group sorting issues on the hierarchichal layerselector
- fixed a JS error on layer removal
- fixed an issue where adding imported datasets/userlayers to the map zoomed to the extent of the layer always. Now it just zooms on initial import and when clicking the layer on personaldata listing. This fixes an issue where embedded maps could start from the dataset extent instead of the original saved center point.

## 1.46.1

For a full list of changes see:
https://github.com/oskariorg/oskari-frontend/milestone/10?closed=1

- Layer loading API has been changed from having the layers inside group structure (and possibly multiple times/layer) to a flat array beside the group structure. The groups will still have layers array in the internal runtime data structure, but instead of the JSON presentation the array items are instances of Oskari.mapframework.domain.AbstractLayer like any other layer references returned by the service.
- Iframe snippet in publisher now includes 'allow="geolocation"' because: https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-permissions-in-cross-origin-iframes
- Line width style setting for userlayer/dataset import works properly now on import
- Statistical map now resets when the regionset layer is removed from selected layers
- Statistical map now resets properly when the reset button is hit
- UI fixes for statistical map legend and classification form
- Reverse colors control in statistical map classification form now works instead of doing nothing
- Sandbox.removeMapLayer() was deprecated as unused and Sandbox.getMap().removeLayer() is the drop-in replacement for it.
- Some variable leaking (to global scope) issues fixed.
- Timeseries UI is no longer shown if the layer with timeseries isn't shown to the user (due to being hidden or incompatible CRS)
- Group and organization is now properly removed from the admin UI when deleted from the database.
- Oskari.urls.getRoute() default value changed from 'N/A' to '/action?' as it's the default for Oskari-server
- Oskari.urls.getLocation() default value changed from 'N/A' to undefined so  developers don't need to know the default value for checking if it's configured
- Personaldata, analyse and publisher2 bundles now support Oskari.urls.getLocation('login') and Oskari.urls.getLocation('register') for url configuration. Bundle-specific config is still available and used as priority.

## 1.46.0

For a full list of changes see: https://github.com/oskariorg/oskari-frontend/milestone/7?closed=1

### Core changes

- Oskari.app.getSystemDefaultViews() has been added. It returns an array of basic appsetup information that can be used to detect alternative default apps.
For example if the server instance has different appsetups for different projection setups the options can be found with this function although it can be used to just provide different apps that are available in the system.
- Bundles have been updated to work with jQuery 1.10.x (previously 1.7.x)
- Lots of unused code/libraries have been removed.
- Added some polyfills

### Projection support

- Maplayer listing and selected layers now indicate if a layer does not support the current map projection (requires the information from server).
- Admin functionality now shows information about projections layers support (based on layer capabilities response).
- Admin functionality now has a new button to trigger capabilities update for a layer (previously triggered on layer information save).
- The map publishing functionality now supports multiprojection setups.
- Lists for saved views and embedded map edit links can now handle items that are not in the current map projection. Opening such view or editing a map will trigger a page reload.
- Links now include an uuid that matches a system default appsetup that supports the current map projection. Basically meaning that links are no longer always pointing to the system default view.

### Thematic maps

- Lots of fine-tuning on the user interface
- Tuning the dot presentation on thematic maps
- It is now possible to include a diagram presentation in published thematic maps

### Hierarchical layerselector

- Layer handling have been changed to accommodate a hierarchical group setting for layers.
- A new bundle 'framework/hierarchical-layerlist' has been added. Can be used as a drop-in replacement for current layerselector and layerselection bundles.
- A new admin bundle 'admin/admin-hierarchical-layerlist' has been added. Can be used as a drop-in replacement for current layer admin bundle, but is only compatible with the new hierarchical-layerlist.

### Misc

- Users can now edit the name and style of an imported dataset (userlayer).
- The map popup (infobox) now tries harder to handle the async nature of kinectic scrolling of OpenLayers 3+ based map. Basically sending a MapMoveRequest and ShowInfoBoxRequest next to each other should no longer move to map to entirely different location that was requested.
- Performance improvements on layer handling for systems that have loads of layers
- Fixes for download basket functionality.
- The printing functionality has been changed to use the new server implementation.
- Small glitches throughout the user interface has been squashed.
- Fixed an issue where layer opacity was not handled properly on OpenLayers 3+ based mapmodule (published maps).
- Layer metadata display has been improved

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
