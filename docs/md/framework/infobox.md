# Infobox

|| Bundle-Identifier || infobox ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.infobox.InfoBoxBundleInstance link] ||

## Description

Provides functionality for other bundles to show an infobox on the map. For example information about a search result. Defines a plugin for mapmodule that handles the infobox as an Openlayers popup with customized UI. Also extends jQuery by an outerHtml method. Templates are created with jQuery but Openlayers popup needs the actual HTML, this is where we need outerHtml. 

## Screenshot

[[Image(infobox.2.png, nolink)]]

## Bundle configuration

No configuration is required.

## Bundle state

{{{
state : {
  popups : [
     {
        id : <popup id>,
        title :  <popup title>,
        data :  <data as given in Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest.getContent()>,
        lonlat : <OpenLayers.LonLat as location for the popup>
     }
  ]
}
}}}

## Requests the bundle handles

|| '''Request''' || '''How does the bundle react''' ||
|| InfoBox.ShowInfoBoxRequest || Infobox is opened on given location and with given content based on request data ||
|| InfoBox.HideInfoBoxRequest || Infobox is removed - single box if id is given or all if not specified ||

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies (e.g. jquery plugins)

|| '''Dependency''' || '''Linked from''' || '''API''' || '''Purpose''' ||
|| jQuery || Version 1.7.1 assumed to be linked (on page locally in portal) || http://api.jquery.com/ || Used to create the component UI from begin to end ||
|| Oskari mapmodule || Expects to be present in application setup || [wiki:DocumentationBundleMapmodule mapmodule] || To register plugin to map/gain control to Openlayers map ||
|| OpenLayers || Expects OpenLayers already linked || http://openlayers.org/ || To control map and show an Openlayers popup on it ||
