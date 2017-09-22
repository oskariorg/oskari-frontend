# AddLayerListFilterRequest

Layerlist new filter buttons can be added by sending AddLayerListFilterRequest. The request must contains the tool text, tool tooltip text,
filter function, button icon style class name when tool is active, button icon style class name when tool is deactive and filter name.

The filter name parameter is used in ShowFilteredLayerListRequest request when activating allready defined filter.

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