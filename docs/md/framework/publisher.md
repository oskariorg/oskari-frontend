# Map Publisher

<table>
  <tr>
    <td>ID</td><td>publisher</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>classes/Oskari.mapframework.bundle.publisher.PublisherBundleInstance.html)</td>
  </tr>
</table>

## Description

This Bundle provides functionality to define an embeddable map and save it to server so it can be published on another page. The user defines the domain the map will be published on, name and language for the map. The user can set the size of the published map, a selection of tools that will be overlayed on the map and affect the maplayers that are initially visible when the map is shown. The main map is modified to show a preview of the published map when the publisher is opened and it resumes to normal view once the publisher flyout is closed. The publisher can promote map layers to the user, but at the moment the configuration which layers are promoted and the promotion text is not passed from the server (defined in code so promotion could be easily configured but it isn't for now).

Users can select styling for the published map in 'Layout' panel. The colour scheme for GFI popups can be selected from six predefined colours and an own colour scheme with RGB codes can be created, font can be chosen from two predefined font sets (serif and sans-serif) and the style of the tools (pan buttons, zoombar, search plugin and layer selection plugin) can be selected from three predefined style sets: 'rounded', 'sharp' and '3d' all of which can be selected as either dark or light versions.

## TODO

- promoted map layers configuration

## Screenshot

### Start publishing
![start](<%= docsurl %>images/publisher_start.png)

### Map publishing
![map](<%= docsurl %>images/publisher_map.png)

## Bundle configuration

Some configuration is needed for URLs:

```javascript
"conf": {
  "loginUrl": {
    "en": "https://www.paikkatietoikkuna.fi/web/en/login",
    "fi": "https://www.paikkatietoikkuna.fi/web/fi/login",
    "sv": "https://www.paikkatietoikkuna.fi/web/sv/login"
  },
  "registerUrl": {
    "en": "https://www.paikkatietoikkuna.fi/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
    "fi": "https://www.paikkatietoikkuna.fi/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
    "sv": "https://www.paikkatietoikkuna.fi/web/sv/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
  },
  "publishedMapUrl": {
    "en": "www.paikkatietoikkuna.fi/published/en/",
    "fi": "www.paikkatietoikkuna.fi/published/fi/",
    "sv": "www.paikkatietoikkuna.fi/published/sv/"
  },
  "urlPrefix": "www.paikkatietoikkuna.fi"
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles
<table>
<tr>
  <th> Request </th><th> Where/why it's used</th>
</tr>
<tr>
  <td> publisher.PublishMapEditorRequest </td><td>Enables users to modify the publish maps</td>
</tr>
</table>

## Requests the bundle sends out
<table>
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

<table>
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

## Events the bundle sends out

<table>
  <tr>
    <th> Event </th><th> When it is triggered/what it tells other components</th>
  </tr>
  <tr>
    <td> Publisher.MapPublishedEvent </td><td> Sends when the server returns a valid response that the map has been published.</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality and accordion/form components</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer component - UIHelper](<%= docsurl %>framework/divmanazer/uihelper.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for help functionality for UI elements</td>
  </tr>
  <tr>
    <td> [Backend API](<%= docsurl %>backend/mappublisher.html) </td>
    <td> N/A </td>
    <td> Publisher backend functionality</td>
  </tr>
</table>
