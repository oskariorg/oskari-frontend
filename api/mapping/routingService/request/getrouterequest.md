# GetRouteRequest [RPC]

Get route plan between two points.

## Description

Request forwards route parameters to the request handler. Parameters include coordinates of two points, coordinate system and other optional route parameters.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>/* SRS </td><td> String </td><td> Coordinate system of the route coordinates, for example EPSG:3067</td><td> </td>
</tr>
<tr>
  <td>/* fromlat </td><td> Number </td><td> y coordinate of the starting point </td><td> </td>
</tr>
<tr>
  <td>/* fromlon </td><td> Number </td><td> x coordinate of the starting point </td><td> </td>
</tr>
<tr>
  <td>/* tolat </td><td> Number </td><td> y coordinate of the arrival point </td><td> </td>
</tr>
<tr>
  <td>/* tolon </td><td> Number </td><td> x coordinate of the arrival point </td><td> </td>
</tr>
<tr>
  <td> date </td><td> Number </td><td> Date for route plan </td><td> </td>
</tr>
<tr>
  <td> time </td><td> Number </td><td> Time for route plan </td><td> </td>
</tr>
<tr>
  <td> mode </td><td> String, String, .. </td><td> Routing vechiles </td><td> </td>
</tr>
<tr>
  <td> arriveby </td><td> Boolean </td><td> Is the time to the destination </td><td> false </td>
</tr>
<tr>
  <td> maxwalkdistance </td><td> Number </td><td> Max walk distance to nearest stop </td><td> 1000 m</td>
</tr>
<tr>
  <td> wheelchair </td><td> Boolean </td><td> Wheelchair passanger </td><td>false </td>
</tr>
<tr>
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td>
</tr>
<tr>
  <td> showIntermediateStops </td><td> Boolean </td><td> Intermediate stops are included in the response </td><td> false </td>
</tr>
</table>


## Parameter description

http://dev.opentripplanner.org/apidoc/0.15.0/resource_PlannerResource.html

Allowed parameter values http://dev.opentripplanner.org/apidoc/0.15.0/model.html  / Data Types

### Oskari request parameter defaults
There are also parameters, which are not in request api, but are defined in OPT server and Oskari server configs

<u>Oskari server configs</u>

>routing.user = USER

>routing.password = PASSWORD

>routing.srs = EPSG:4326

>routing.url = http://beta.digitransit.fi/otp/routers/finland/plan?

>routing.default.maxwalkdistance = 1000

>routing.default.mode = TRANSIT,WALK

>routing.forceXY = false

## Examples

Get route insctructions between two points:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('GetRouteRequest', [{
        fromlat: "6733840",
        fromlon: "360448",
        srs: "EPSG:3067",
        tolat: "6675728",
        tolon: "394240"
    }]);
```

## Related api

- RouteResultEvent