# AddLayerListFilterRequest

Layerlist new filter buttons can be added by sending AddLayerListFilterRequest.

## Use cases

- add layerlist filter

## Description

Layerlist new filter buttons can be added by sending AddLayerListFilterRequest.

The filter name parameter is used in ShowFilteredLayerListRequest request when activating allready defined filter.

The request must contains the tool text, tool tooltip text,
filter function, button icon style class name when tool is active, button icon style class name when tool is deactive and filter name.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>* toolText</td><td>String</td><td>Filter button text</td><td> </td>
</tr>
<tr>
  <td>tooltip</td><td>String</td><td>Filter button tooltip text</td><td> </td>
</tr>
<tr>
  <td>iconClassActive</td><td>String</td><td>Filter button active icon style class</td><td> </td>
</tr>
<tr>
  <td>iconClassDeactive</td><td>String</td><td>Filter button deactive icon style class</td><td> </td>
</tr>
<tr>
  <td>* filterName</td><td>String</td><td>Identifier for request</td><td> </td>
</tr>

</table>

## Examples

### Add publishable filter to layerlist

```javascript
// Add layer filter to map layer service
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('publishable', function(layer){
    return (layer.getPermission('publish') === 'publication_permission_ok');
});

// Add layerlist filter button
Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest', [
    'Publishable',
    'Show publishable layers',
    'layer-publishable',
    'layer-publishable-disabled',
    'publishable'
]);
```

Icon style classes:
```
.layer-publishable {
    width: 16px;
    height: 16px;
    background-image: url('icons.png') !important;
    background-repeat: no-repeat !important;
    background-position: -1461px 0px !important;
}

.layer-publishable-disabled {
    width: 16px;
    height: 16px;
    background-image: url('icons.png') !important;
    background-repeat: no-repeat !important;
    background-position: -1445px 0px !important;
}
```

### Create own filters and add button for this

Create own filter (this we wanted to show only layers with name start 'a' or 'A') and use new filter the code below:
```javascript
// Register new filter
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('find_layers_name_start_a', function(layer){
    var name = layer.getName().toLowerCase(),
            nameFirstChar = name.substring(0,1);
        return (nameFirstChar === 'a');
});
// Add layerlist filter button what use previously created new filter
Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest', [
    'Layers what name start "A"',
    'Show layers whatn name starts a',
    'layer-start-a',
    'layer-start-a-disabled',
    'find_layers_name_start_a'
]);
```

Icon style classes:
```
.layer-start-a {
    height:16px;
}

.layer-start-a:before {
    content: "A";
    font-size: 16px;
    color: #00cd98;
    line-height: 16px;
    text-align: center;
    font-weight: bold;
}

.layer-start-a-disabled {
    height:16px;
}

.layer-start-a-disabled:before {
    content: "A";
    font-size: 16px;
    color: #cccdcc;
    line-height: 16px;
    text-align: center;
    font-weight: bold;
}
```