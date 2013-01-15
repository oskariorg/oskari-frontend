# Coordinate Display

|| Name || Coordinate Display ||
|| ID || coordinatedisplay ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance link] ||
|| Description || This bundle provides a plugin (Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin) for mapmodule that shows coordinates on mouse location. ||


## Screenshot
[[Image(coordinate_display.png)]]


## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles 

This bundle doesn't handle any requests.

## Requests the bundle sends out 

This bundle doesn't send any requests.

## Events the bundle listens to 

|| Event || How does the bundle react ||
|| MouseHoverEvent || Updates the coordinates gotten from event to the UI. ||
|| AfterMapMoveEvent || Updates the updated coordinates for map center. ||

## Events the bundle sends out 

This bundle doesn't send any events.

## Dependencies (e.g. jquery plugins) 

|| Dependecy || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
