# GetUserLocationRequest

This request is used to get user geolocation.

## Examples

#### Get user geolocation and center map to user location:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MyLocationPlugin.GetUserLocationRequest');
if (reqBuilder) {
	var request = reqBuilder(true);
    sb.request('MainMapModule', request);
}
```

#### Get user geolocation and not center map to user location:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MyLocationPlugin.GetUserLocationRequest');
if (reqBuilder) {
	var request = reqBuilder(false);
    sb.request('MainMapModule', request);
}
```

After the geolocation is completed a ``UserLocationEvent`` is triggered where following data is available:
- event.getLon(), tells user geolocation lon coordinate
- event.getLat(), tells user geolocation lat coordinate
