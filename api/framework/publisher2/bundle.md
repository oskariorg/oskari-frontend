# Map Publisher 2

Allows creation of embedded maps

## Description

This Bundle provides functionality to define an embeddable map and save it to server so it can be published on another page. 
The user defines the domain the map will be published on, name and language for the map. The user can set the size of the published map, 
a selection of tools that will be overlayed on the map and affect the maplayers that are initially visible when the map is shown. 
The main map is modified to show a preview of the published map when the publisher is opened and it resumes to normal view once the publisher flyout is closed. 

Users can select styling for the published map in 'Layout' panel. The colour scheme for GFI popups can be selected from 
six predefined colours and an own colour scheme with RGB codes can be created, font can be chosen from two predefined 
font sets (serif and sans-serif) and the style of the tools (pan buttons, zoombar, search plugin and layer selection plugin) 
can be selected from three predefined style sets: 'rounded', 'sharp' and '3d' all of which can be selected as either 
dark or light versions.

Compared to the original publisher this refactored version aims to be more extendable where other bundles can provide 
publisher settings.

## TODO

- complete refactoring to support functionality of the original publisher 
- document the extension hook for tools

## Screenshot

### Start publishing
![start](publisher_start.png)

### Map publishing
![map](publisher_map.png)

## Bundle configuration

Some configuration is needed for URLs:
* loginUrl and registerUrl are shown as links for guest users to appropriate site pages (can be localized with an object notation or used with single url)
* urlPrefix is used when displaying a preview for GFI popup. It is always appended with '/web/' and users language.
* tileElement can be used to to give a reference to an element that should start the publisher functionality. The normal Oskari Tile is not added to the menu as a result, but clicking the element will start the publisher. An 'activePublish' class is added to the element when publisher is open and removed on close to allow styling. Value needs to be a DOM-selector (string).

```javascript
"conf": {
  "loginUrl": {
    "en": "/en/login",
    "fi": "/fi/login",
    "sv": "/sv/login"
  },
  "registerUrl": "/register",
  "toolsConfig" : {
    "<tool>" : {
      ...
    }
  },
  "tileElement": "#publisherButton"
}
```
Toolsconfig can be used to configure bundle configurations for tools that are user selectable. Most configs can be included in the publish-template, but this makes publisher more versatile and allows different views in the same Oskari instance to have different preselected tool configurations. When initializing publisher tools the configuration is passed to the tool based on tool name. First one to utilize this feature is coordinatetool where you can specify projections transform support to be included in embedded maps. 

Example for coordinatetool:
```javascript
{
  "toolsConfig" :  {
      "coordinatetool" : {
          "supportedProjections": ["EPSG:3067", "NLSFI:etrs_gk", "NLSFI:ykj", "EPSG:4258", "LATLON:kkj", "EPSG:3046", "EPSG:3048", "EPSG:3873", "EPSG:3874", "EPSG:3875", "EPSG:3876", "EPSG:3877", "EPSG:3878", "EPSG:3879", "EPSG:3880", "EPSG:3881", "EPSG:3882", "EPSG:3883", "EPSG:3884", "EPSG:3885"]
          "roundToDecimals": 6,
          "isReverseGeocode" : true,
          "reverseGeocodingIds" : "WHAT3WORDS_CHANNEL"
      }
  }
}
```

## Bundle Panels

All panels needs implement following functions:
* getValues(): This is used to gather selected values from current panel. For example in `Tools panel` this function gather all tools selected values and return a config.

### General information panel

The first panel of the publisher.

Panel contains following fields:
* Website url (text input): The website url where the map will be embedded
* The name of the map (text input): The name of published map.
* Language (selection): The map language

## Map size panel

The second panel has some predefined size options for the map. Tools can react to size changes. Size is communicated by changing the preview map-window size which triggers  MapSizeChangedEvent.

### Tool panels

The publisher locates tool selections by finding loaded Oskari-classes implementing `Oskari.mapframework.publisher.Tool`.
Each tool has a group which is used to setup different tool panels based on group.

The `Oskari.mapframework.publisher.Tool` protocol needs implement following functions:
* getTool(): This is used to describe the tool object:
 - id is the Oskari class name
 - name is used as part of the localization key (see below)
 - config is the tool configuration
* getValues(): This is used to gather selected values.

```javascript
getTool: function() {
    return {
        id: 'Oskari.mapframework.bundle.mapmodule.plugin.MyTool',
        name: 'MyTool',
        config: {}
    };
}
```
    
* setEnabled(enabled): This is used to enable or disable tool (checkbox functionality). This function change tool state.enabled variable to true/false to handing tool state. For example tool getValues() function checks it and if tools state is enebled then return tool JSON, otherwise return null.
* getExtraOptions(): This is used to add extra options to tool. This function returns jQuery element to add after to tool checkbox. If null then nothing added.
* getName(): This is used to show tool name in checkbox label. 
* isDisplayedInMode(mode): This is used for checking if tool is showed in mode (mobile/full).
* isDisplayed(): This is used to check at is the tool displayed. For example, depending on the state of map or depending of selected layers (ShowStatsTableTool).
* getGroup(): This is used to get tool group (what panel tool appears)
* getIndex(): This is used to get tool index in group. A smaller number is upper and higher number is lower.
* getAllowedLocations(): This is used to get tool allowed locations.
* getValues(): This is used to get tool values to saving published map.
* validate(): This is used to validate tool when saving published map.
* isStarted(): This is used to check at if tool plugin has started. If plugin has started then we can call plugin stop function when disabling tool. When plugin starts, change tool __started variable to true, when stopped change it to false.

The panels title is fetched from localization `Publisher2` with key `BasicView.[group].label`. The tool label is fetched 
with key `BasicView.[group].[tool name]` where tool name is returned by `getTool().name`.

    "BasicView" : {
        ...
        "maptools" : {
            "label" : "Tools",
            "MyTool" : "The UI text for the tool" 
            ...
       }
       ...
    }

The publisher provides some default tools:
- scalebar
- indexmap
- pan buttons
- zoombar
- search
- my location
- controls (moving map by dragging/keyboard)


## Requests the bundle sends out
<table class="table">
<tr>
  <th> Request </th><th> Where/why it's used</th>
</tr>
<tr>
  <td> userinterface.AddExtensionRequest </td><td> Register as part of the UI in start()-method</td>
</tr>
<tr>
  <td> userinterface.RemoveExtensionRequest </td><td> Unregister from the UI in stop()-method</td>
</tr>
<tr>
  <td> AddMapLayerRequest </td><td> If any layer is marked for promotion, the user can add it from the publisher. When the publisher is closed, adds any layers that were removed because user didn't have publish rights.</td>
</tr>
<tr>
  <td> RemoveMapLayerRequest </td><td> If promoted layer is added via publisher, it can be removed as well. Also removes layers from selection that the user can't publish</td>
</tr>
<tr>
  <td> userinterface.UpdateExtensionRequest </td><td> Requests close on the flyout when publisher is closed and close to any other flyout when the publisher is opened.</td>
</tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td> Updates the flyout to reflect current maplayer selections</td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Updates the flyout to reflect current maplayer selections</td>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Updates the flyout to reflect current maplayer selections</td>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Updates coordinate information in publisher if applicable</td>
  </tr>
  <tr>
    <td> userinterface.ExtensionUpdatedEvent </td><td> Determines if the layer was closed or opened and enables/disables preview view accordingly</td>
  </tr>
  <tr>
    <td> Publisher.MapPublishedEvent </td><td> Publisher views send this event so personaldata can refresh its listing. Publisher instance also listens the event to show user HTML code for embedding the map to a page.</td>
  </tr>
</table>


## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Lo-Dash](http://lodash.com/) </td>
    <td> Linked in oskariui </td>
    <td> Used to deep clone state objects</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](/documentation/bundles/framework/divmanazer) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality and accordion/form components</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer component - UIHelper](/documentation/bundles/framework/divmanazer/uihelper) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for help functionality for UI elements</td>
  </tr>
  <tr>
    <td> [Backend API](/documentation/backend/mappublisher) </td>
    <td> N/A </td>
    <td> Publisher backend functionality</td>
  </tr>
</table>
