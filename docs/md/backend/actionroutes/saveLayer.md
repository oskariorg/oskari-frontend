# SaveLayer (POST | GET)
Save layer - If there is layer id provided this means update, otherwise it's insert. User needs to be logged in and have admin rights.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>layer_id</td>
    <td>String</td>
    <td>Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>lcId</td>
    <td>String</td>
    <td>Layer class id</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>nameFi</td>
    <td>String</td>
    <td>Layer name in Finnish</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>nameSv</td>
    <td>String</td>
    <td>Layer name in Swedish</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>nameEn</td>
    <td>String</td>
    <td>Layer name in English</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>titleFi</td>
    <td>String</td>
    <td>Short description in Finnish</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>titleSv</td>
    <td>String</td>
    <td>Short description in Swedish</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>titleEn</td>
    <td>String</td>
    <td>Short description in English</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>wmsName</td>
    <td>String</td>
    <td>Mapped to OpenLayers WMS "layers" and "layerId" parameters</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>wmsUrl</td>
    <td>{String}</td>
    <td>base url for getting tile images for the layer</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>opacity</td>
    <td>Number</td>
    <td>initial opacity for the layer (between 0 and 100)</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>style</td>
    <td>Base64</td>
    <td>Layer's SLD style in base64 format.</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>minScale</td>
    <td>Double</td>
    <td>minimum scale where the layer should be shown. (i.e. 1/minScale)</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>maxScale</td>
    <td>Double</td>
    <td>maximum scale where the layer should be shown. (i.e. 1/maxScale)</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>descriptionLink</td>
    <td>String</td>
    <td>Description for this layer</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>legendImage</td>
    <td>String</td>
    <td>URL pointing to a legend image for the layer (optional)</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>inspireTheme</td>
    <td>Integer</td>
    <td>Sets Inspire theme</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>dataUrl</td>
    <td>URL</td>
    <td>data</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>metadataUrl</td>
    <td>URL</td>
    <td>Id for layers metadata</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>orderNumber</td>
    <td>Number</td>
    <td>Order of layers inside organization</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>layerType</td>
    <td>String</td>
    <td>For WMS layers' this is "wmslayer"</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>tileMatrixSetId</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>tileMatrixSetData</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>wms_dcp_http</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>wms_parameter_layers</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>resource_url_scheme</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>resource_url_scheme_pattern</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>resource_url_client_pattern</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>resource_daily_max_per_ip</td>
    <td>Integer</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>xslt</td>
    <td>Base64</td>
    <td>//TODO</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>gfiType</td>
    <td>String</td>
    <td>Get Feature Info type</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>selection_style</td>
    <td>Base64</td>
    <td>//TODO</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>version</td>
    <td>String</td>
    <td>Interface version</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>epsg</td>
    <td>Integer</td>
    <td>map </td>
    <td>**true**</td>
  </tr>
</table>


## Response

### Success
```javascript
{
  layer_id : "<layer_id>",
  orgName  : "<Finnish_organization_name>",
  updated  : "<update_time_in_millis>"
  // added data as JSON
}
```

### Error
http status code 500 with null
