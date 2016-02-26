# ShowFilteredLayerListRequest

Layerlist showed layers can be filtered by sending ShowFilteredLayerListRequest. The request must contain the filter function 
or selected filter as well as optional paramater, which is open layer list.

## Examples

### Filter layerlist by default filters

Default filter are:
* newest, this shows 20 newest layers on layerlist
* stats , this shows only analysable layers on layerlist
* publishable, this shows only publishable layers on layerlist

You can use default filters only when filter buttons are showed on layerlist.

Filter layerlist to show only newest layers using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFilteredLayerListRequest');
if (reqBuilder) {
    var request = reqBuilder(null, 'newest', false);
    sb.request('MainMapModule', request);
}
```

Filter layerlist to show only analysable layers using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFilteredLayerListRequest');
if (reqBuilder) {
    var request = reqBuilder(null, 'stats', false);
    sb.request('MainMapModule', request);
}
```

Filter layerlist to show only publishable layers using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFilteredLayerListRequest');
if (reqBuilder) {
    var request = reqBuilder(null, 'publishable', false);
    sb.request('MainMapModule', request);
}
```

### Create own filters

Create own filter (this we wanted to show only layers with name start 'a' or 'A') using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFilteredLayerListRequest');
if (reqBuilder) {
    var request = reqBuilder(function(layer){
        var name = layer.getName().toLowerCase(),
            nameFirstChar = name.substring(0,1);
        return (nameFirstChar === 'a');
    }, null, false);
    sb.request('MainMapModule', request);
}
```

### Open layerlist when sending request

Open layerlist when sending request (same code as upper but changed latest param from false to true) using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFilteredLayerListRequest');
if (reqBuilder) {
    var request = reqBuilder(function(layer){
        var name = layer.getName().toLowerCase(),
            nameFirstChar = name.substring(0,1);
        return (nameFirstChar === 'a');
    }, null, true);
    sb.request('MainMapModule', request);
}
```