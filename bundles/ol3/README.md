
/bundles/ol3
=======================


# Summary

Proof-of-Concept ol3 ( https://github.com/openlayers/ol3 ) based mapfull/mapmodule implementation
for oskari.

This is only a partial implementation and will change. 

# Features migrated

mapmodule-plugin 
- map-module
- wms layers plugin
- wmts layers plugin
- basic navigation 
- panbuttons plugin
- basic events
- basic requests

infobox
- openlayers popup plugin
 
openlayers 2 to ol3 minimal compatibility layer (bounds, some utils) to get the app starting


# Impact on other bundles

Only mapmodule plugins need rewriting. This is howere dependent on the style of coding.
Some parts of OpenLayers 2 have spread across codebase such as basetypes Bounds, Point, ...

Many bundles require no changes at all.
 
