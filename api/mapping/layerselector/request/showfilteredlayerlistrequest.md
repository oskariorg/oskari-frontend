# ShowFilteredLayerListRequest

Layerlist showed layers can be filtered by sending ShowFilteredLayerListRequest. The request must contain the filter function
or selected filter as well as optional paramater, which is open layer list.

## Examples

### Filter layerlist by default filters

Default filter are:
* newest, this shows 20 newest layers on layerlist
* featuredata, this shows only featuredata layers on layerlist

Bundles registered filters:
* publishable, this shows only publishable layers on layerlist. Available only then if publisher2 bundle started and user is logged in.

You can use default filters only when filter buttons are showed on layerlist.

Filter layerlist to show only newest layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['newest', false]);
```

Filter layerlist to show only vector layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['featuredata', false]);
```

Filter layerlist to show only publishable layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['publishable', false]);
```

### Create own filters

Create own filter (this we wanted to show only layers with name start 'a' or 'A') and use new filter the code below:
```javascript
// Register new filter
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('find_layers_name_start_a', function(layer){
    var name = layer.getName().toLowerCase(),
            nameFirstChar = name.substring(0,1);
        return (nameFirstChar === 'a');
});
// Use new filter by request
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['find_layers_name_start_a', false]);
```

### Open layerlist when sending request

Open layerlist when sending request (same code as upper but changed latest param from false to true) using the code below:
```javascript
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('find_layers_name_start_a', function(layer){
    var name = layer.getName().toLowerCase(),
            nameFirstChar = name.substring(0,1);
        return (nameFirstChar === 'a');
});
// Use new filter by request
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['find_layers_name_start_a', true]);
```