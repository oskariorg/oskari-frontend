# RouteResultEvent

Used to notify the ``GetRouteRequest`` is received a reply from routing.

# Event methods

## getName

Get event name.

## getSuccess

Get routing success status. If it's true then there are also route plan. If false then routing not success.

## getPlan

Get routing plan. Get OpenTripPlanner formatted plan answer with following exceptions:
- all coordinates are tranformed to map projection
- any itinerary (e.g. itineraries[0]) block contains new geoJSON block, where is full GeoJSON formatted route line
- any legGeometry block (e.g. itineraries[0].legs[0].legGeometry) block contains new geoJSON block, where is full GeoJSON formatted leg line

## getRequestParameters

Get request parameters. Get OpenTripPlanner formatted requestParameters answer with following exceptions:
- all coordinates are tranformed to map projection

## getParams

RPC needed function. Tells event parameters.