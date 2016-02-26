# AddLayerListFilterRequest

Layerlist new filter buttons can be added by sending AddLayerListFilterRequest. The request must contains the tool text, tool tooltip text,
filter function, button icon style class name when tool is active, button icon style class name when tool is deactive and filter name.

The filter name parameter is used in ShowFilteredLayerListRequest request when activating allready defined filter.

## Examples

### Add publishable filter to layerlist

```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('AddLayerListFilterRequest');
if (reqBuilder) {
    var request = reqBuilder(
        'Publishable',
        'Show publishable layers',
        function(layer){
            return (layer.getPermission('publish') === 'publication_permission_ok');
        },
        'layer-publishable',
        'layer-publishable-disabled',
        'publishable'
    );
    sb.request('MainMapModule', request);
}
```