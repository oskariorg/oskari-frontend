# ShowFilteredLayerListRequest

Filter layers shown on layerlist.

## Use cases

- filter layerlist

## Description

Layers shown to the user can be filtered by sending ShowFilteredLayerListRequest.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>* selectedFilter</td><td>String</td><td>Used layerlist filter identifier</td><td> </td>
</tr>
<tr>
  <td>openLayerList</td><td>Boolean</td><td>Open layerlist flyout</td><td>false</td>
</tr>
</table>

## Examples

### Filter layerlist by default filters

Default filter are:
* newest, this shows 20 newest layers on layerlist
* featuredata, this shows only featuredata layers on layerlist

Bundles registered filters:
* publishable, this shows only publishable layers on layerlist. Added by publisher2 bundle if the user is logged in.

You can use default filters only when filter buttons are showed on layerlist.

Filter layerlist to show only newest layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['newest']);
```

Filter layerlist to show only vector layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['featuredata']);
```

Filter layerlist to show only publishable layers using the code below:
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['publishable']);
```

If you want also open layerlist (layerselector2 Flyout) then send request with second parameter true.
```javascript
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['newest',true]);
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
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['find_layers_name_start_a']);
```

### Open layerlist when sending request

Open layerlist (layerselector2 Flyout) when sending request (same code as upper but added second parameter true) using the code below:
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