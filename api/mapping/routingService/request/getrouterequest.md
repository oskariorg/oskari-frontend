# GetRouteRequest

This request is used to get route plan between two points.

## Examples

#### Get route insctructions between two points:
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

After the routing is completed a ``RouteSuccessEvent`` is triggered where following data is available:
- event.getSuccess(), tells at routing request founds some route and there is no errors
- event.getPlan(), tells routing plan. Plan is same format as OpenTripPlanner respose with some conditions (geoJSON added, point coordinates are transfredded same coordinate reference system as map projection)
- event.getRequestParameters(), tells request paremeters of routing
