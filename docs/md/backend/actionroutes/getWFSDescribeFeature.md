# GetWSFDescribeFeature


## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>wfsurl</td>
    <td>URI</td>
    <td>URL encoded wfsurl (base wfs service url)</td>
    <td>**true or false - not yet implemented**</td>
  </tr>
  <tr>
    <td>layer_if</td>
    <td>string</td>
    <td>layer_id of WFS layer</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
    "layer_id": "217",
    "propertyTypes": {
        
    }
}
```

### Error
Returns HTTP code 500 with an error message as a JSON in response body.

Key not found (200): null

Incorrect WMS URL (500):
```javascript
{
  "EXCEPTION":"INCORRECT URL"
}
```

Could not request WMS GetCapabilities (500):
```javascript
{
  "EXCEPTION": "Parameter 'wfsurl' is missing or is not in wfs configuration "
}
```

## Examples

### Example query for Paikkatietoikkuna 


### Example curl request

(GET) 
http://.../web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetWFSDescribeFeature&layer_id=217

Response:
{
    "layer_id": "217",
    "propertyTypes": {
        "luontiAika": "xsd:dateTime",
        "kiinteistotunnus": "xsd:string",
        "tarkistusmerkki": "xsd:string",
        "kayttotarkoitus": "xsd:string",
        "kaytossaolotilanne": "xsd:string",
        "muutosAika": "xsd:dateTime",
        "rakennusnumero": "xsd:string",
        "valmistumispaiva": "xsd:string",
        "rakennustunnus": "xsd:string",
        "sijainti": "gml:GeometryPropertyType"
    }
}

## TODO
* Sub element type parsing

