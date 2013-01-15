# Metadata

|| Bundle-Identifier ||metadata ||
|| API || link here ||

## Description

''Describe what the bundle does.''

## TODO

* ''List any planned features''

## Screenshot

[[Image(metadatasearch_bundle.2.png, nolink​)]]

## Bundle configuration

No configuration is required. 

## Bundle state

No statehandling has been implemented. 

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

|| '''Request''' || '''Why/when''' ||
|| ToolSelectionRequest || When areaselecting tool is pressed ||


## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies (e.g. jquery plugins)

|| '''Dependency''' || '''Linked from''' || '''API''' || '''Purpose''' ||
|| jQuery || Version 1.7.1 assumed to be linked (on page locally in portal) || http://api.jquery.com/ || Used to create the component UI from begin to end ||
|| Oskari mapmodule || Expects to be present in application setup || [wiki:DocumentationBundleMapmodule mapmodule] || To register plugin to map/gain control to Openlayers map ||
|| OpenLayers || Expects OpenLayers already linked || http://openlayers.org/ ||  ||