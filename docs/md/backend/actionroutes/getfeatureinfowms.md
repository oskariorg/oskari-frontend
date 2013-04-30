# GetFeatureInfoWMS (INCOMPLETE)
Description here. What need does the action route fulfill? Is it GET or POST?

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>layerIds</td>
    <td>String</td>
    <td>Comma separated layer ids</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>projection</td>
    <td>String</td>
    <td>Projection code</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>x</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>y</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>lon</td>
    <td>Float</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>lat</td>
    <td>Float</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>width</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>height</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>bbox</td>
    <td>String</td>
    <td>Comma separated coordinates</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>zoom</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>srs</td>
    <td>String</td>
    <td></td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "response": "here",
  "and": "here"
}
```

### Error
What's the HTTP status code and does it have an error message or does it return null?

```javascript
{
  "error" : "here"
}
```

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetFeatureInfoWMS`

With (POST|GET) params:

Response:
```json
{
  "layerCount":1,
  "data":[
    {
    "content":{
      "parsed":{
        "layer":"Oma karttataso","places":[
          {"description":"foo","link":"","name":"test"}
        ],
        "publisher":""}
      },
      "presentationType":"JSON",
      "type":"wmslayer",
      "layerId":
      "myplaces_6066"
    }
  ]
}
```

### Example curl request