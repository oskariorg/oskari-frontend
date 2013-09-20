
/bundles/leaflet
=======================


# Summary

Proof-of-Concept leaflet ( https://github.com/openlayers/Leaflet/Leaflet ) based mapfull/mapmodule implementation
for oskari.

This is only a partial implementation and will change.
Work-in-Progress. 

# Features migrated

mapmodule-plugin 
- map-module
- wms layers plugin
- basic navigation 
- basic events
- basic requests

missing basics
- layer ordering

infobox
- popup plugin (not tested)
 
openlayers 2 to leaflet minimal compatibility layer (bounds, some utils) to get the app starting


# Impact on other bundles

Only mapmodule plugins need rewriting. This is howere dependent on the style of coding.
Some parts of OpenLayers 2 have spread across codebase such as basetypes Bounds, Point, ...

Many bundles require no changes at all.
 

# Restrictions

Only the minimum required was coded.

# Future work

Remove duplicate PoC code and implementations.

Generalise implementations for ol2,ol3,leaflet, other-map.

Design and document dependencies for bundles dependent on ol2, ol3, leaflet or a generic dependency of 
a map implementation.

