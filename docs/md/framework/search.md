# Search

|| ID || search  ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.search.SearchBundleInstance link]  ||

## Description

Provides (address etc) search functionality with a flyout UI.

### Screenshot

[[Image(search_flyout.png)]]


### Bundle configuration

No configuration is required, but it can be used to set ajax URL. If not set, sandbox.getAjaxUrl() with action_route#GetSearchResult is used instead.

{{{
{
"url" : "http://www.google.com"
}
}}}

### Bundle state

No statehandling has been implemented for the bundle.

### Requests the bundle handles

This bundle doesn't handles any requests.

### Requests the bundle sends out

|| Request || How does the bundle react ||
|| MapMoveRequest || When a search result is clicked, the map is centered on the location. ||
|| InfoBox.ShowInfoBoxRequest || When a search result is clicked, information about the results is shown on an Infobox ||
|| InfoBox.HideInfoBoxRequest || Hides search result infobox. ||
|| MapModulePlugin.RemoveMarkerRequest || When the search keyword is removed, any markers on the map are removed. ||

### Events the bundle listens to

This bundle doesn't listen to any events.

### Events the bundle sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
|| OpenLayers || Expects mapmodule to be present and OpenLayers already linked || [http://openlayers.org/] || To control map and show an Openlayers popup on it ||
|| Oskari DivManager || [http://www.oskari.org/trac/wiki/DocumentationBundleDivManazer DivManazerBundle] ||   || Provides flyout/tile functionality ||
|| Backend functionality || N/A ||  [wiki:DocumentationBundleSearchBackend Backend API] || Search is handled in backend ||
