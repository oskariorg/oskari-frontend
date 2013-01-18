# Search

<table>
  <tr>
    <td>Bundle-Identifier</td><td>search</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.search.SearchBundleInstance)</td>
  </tr>
</table>

## Description

Provides (address etc) search functionality with a flyout UI.

### Screenshot

![screenshot](<%= docsurl %>images/search_flyout.png)

### Bundle configuration

No configuration is required, but it can be used to set ajax URL. If not set, sandbox.getAjaxUrl() with action_route#GetSearchResult is used instead.

```javascript
{
  "url" : "http://www.google.com"
}
```

### Bundle state

No statehandling has been implemented for the bundle.

### Requests the bundle handles

This bundle doesn't handles any requests.

### Requests the bundle sends out

<table>
<tbody><tr><td> Request </td><td> How does the bundle react
</td></tr><tr><td> MapMoveRequest </td><td> When a search result is clicked, the map is centered on the location.
</td></tr><tr><td> InfoBox.ShowInfoBoxRequest </td><td> When a search result is clicked, information about the results is shown on an Infobox
</td></tr><tr><td> InfoBox.HideInfoBoxRequest </td><td> Hides search result infobox.
</td></tr><tr><td> MapModulePlugin.RemoveMarkerRequest </td><td> When the search keyword is removed, any markers on the map are removed.
</td></tr></tbody></table>

### Events the bundle listens to

This bundle doesn't listen to any events.

### Events the bundle sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

<table>
<tbody><tr><td> Dependency </td><td> Linked from </td><td> API </td><td> Purpose
</td></tr><tr><td> [jQuery](http://api.jquery.com/) </td><td> Linked in portal theme </td><td> Used to create the component UI from begin to end
</td></tr><tr><td> [OpenLayers](http://openlayers.org/) </td><td> Expects mapmodule to be present and OpenLayers already linked </td><td> To control map and show an Openlayers popup on it
</td></tr><tr><td> Oskari DivManager[Oskari DivManager](<%= docsurl %>framework/divmanazer.html) </td><td> DivManazerBundle </td><td>   </td><td> Provides flyout/tile functionality
</td></tr><tr><td> [Backend API](<%= docsurl %>backend/search.html) </td><td> N/A </td><td> Search is handled in backend
</td></tr></tbody></table>
