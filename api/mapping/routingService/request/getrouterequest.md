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
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td>
</tr>
</table>

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