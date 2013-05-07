# SaveOrganization
Save organization which offers map layers. Without layerclass_id this creates a new organization - otherwise this is handled as an update. User needs to have admin rights.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>layerclass_id</td>
    <td>String</td>
    <td>Organization's id. This is needed when updating organization's data</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>parent_id</td>
    <td>String</td>
    <td>Organization's id. This is needed when the current layer is a sublayer.</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>sub_maplayers_selectable</td>
    <td>String</td>
    <td>Allow selection of sub maplayers</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>sub_legend_image</td>
    <td>String</td>
    <td>Legend image of sublayers</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>sub_data_url</td>
    <td>String</td>
    <td>Data url for sublayers</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>group_map</td>
    <td>String</td>
    <td>//TODO</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>name_fi</td>
    <td>String</td>
    <td>Name of organization in Finnish</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>name_sv</td>
    <td>String</td>
    <td>Name of organization in Swedish</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>name_en</td>
    <td>String</td>
    <td>Name of organization in English</td>
    <td>**false**</td>
  </tr>
</table>

## Response

### Success
HTTP statuscode 200 and null

### Error
HTTP statuscode 500 and error stacktrace

## Examples

### Example query for Paikkatietoikkuna
(POST|GET)
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=SaveOrganization&layerclass_id=333&name_fi="testi"&name_sv="testen"&name_en="test"

Response:
null
