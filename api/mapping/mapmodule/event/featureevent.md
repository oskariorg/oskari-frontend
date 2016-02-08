# FeatureEvent

Used to notify about add, remove and click events for features.

# Event methods

## getName

Get event name.

## getParams

RPC needed function. Returns an object with keys 'features' and 'operation' where operation is one of: 'add', 'remove', 'click', 'zoom' and 
features is an array containing objects presenting the features that were affected. Each feature object has the following properties:

- id : id for the feature
- geojson : the feature with attributes as geojson
- layerId : id of the layer that the feature is/was on