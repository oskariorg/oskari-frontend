# GetAdminMapLayers (POST | GET)
This action route returns all the maplayers which are accessible by the current user and all admin data of those layers. This is needed when layers are created and updated by admins.

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
    <td>int</td>
    <td>If defined this action route will return info of just that particular layer.</td>
    <td>**false**</td>
  </tr>
  <tr>
    <td>lang</td>
    <td>String</td>
    <td>Localization. If no lang parameter is given, backend will default to Finnish.</td>
    <td>**false**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "layers": [
    {
      // layer data
      // + admin related layer data
    }
  ]
}
```

### Error
Returns HTTP code 500 with an error message as a JSON in response body.
{"error":"Couldn't request DB service - get map layers"}
{"error":"Map layer listing failed - get map layers"}

## Examples

### Example query for Paikkatietoikkuna
(POST|GET)
http://demo.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetAdminMapLayers&lang=fi

Response:

### Example curl request
```javascript
{
  "layers": [
    {
      // layer data
      // + admin related layer data
    }
  ]
}
```