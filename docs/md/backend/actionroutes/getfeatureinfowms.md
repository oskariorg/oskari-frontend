# GetFeatureInfoWMS (POST) (INCOMPLETE)
DESCRIPTION MISSING

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required (WMS)?</th>
    <th>Required (WFS)?</th>
  </tr>
  <tr>
    <td>layerIds</td>
    <td>String</td>
    <td>Comma separated layer ids</td>
    <td>**true**</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>projection</td>
    <td>String</td>
    <td>Projection code</td>
    <td>**true**</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>x</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
    <td>false</td>
  </tr>
  <tr>
    <td>y</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
    <td>false</td>
  </tr>
  <tr>
    <td>lon</td>
    <td>Float</td>
    <td>Longitude</td>
    <td>false</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>lat</td>
    <td>Float</td>
    <td>Latitude</td>
    <td>false</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>width</td>
    <td>Integer</td>
    <td></td>
    <td>false</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>height</td>
    <td>Integer</td>
    <td></td>
    <td>false</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>bbox</td>
    <td>String</td>
    <td>Comma separated coordinates</td>
    <td>**true**</td>
    <td>false</td>
  </tr>
  <tr>
    <td>zoom</td>
    <td>Integer</td>
    <td></td>
    <td>**true**</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
For a myplaces layer:
```javascript
{
  "layerCount": "<total number of layers>",
  "data": [
    // An object for each layer
    {
      "presentationType": "<eg. JSON>",
      "type": "<layer type>",
      "layerId": "<id of the layer>",
      "content": {
        "parsed": {
          "layer": "<layer name>",
          "places": [
          // An object for each place
            {
              "description": "<text>",
              "link": "<optional>",
              "name": "<text>"
            }
          ],
          "publisher": "<optional>"
        }
      },
    }
  ]
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

With POST params:
```javascript
  "layerIds": "myplaces_6066",
  "projection": "EPSG:3067",
  "x": 785,
  "y": 313,
  "lon": 381630.02310593,
  "lat": 6672749.2979804,
  "width": 1608,
  "height": 603,
  "bbox": "373780.023106,6669849.29798,389860.023106,6675879.29798",
  "zoom": 7,
  "srs": "EPSG:3067"
```

Response:
```json
{
  "layerCount":1,
  "data":[
    {
      "content":{
        "parsed":{
          "layer":"Oma karttataso",
          "places":[
            {
              "description":"bar",
              "link":"",
              "name":"foo"
            }
          ],
          "publisher":""
        }
      },
      "presentationType":"JSON",
      "type":"wmslayer",
      "layerId":"myplaces_6066"
    }
  ]
}
```
## TODO
* This is overloaded action route - instead of fetching WMS (as name suggests) it fetches also old WFS and MyPlaces info.
* this seems to have dublicate sets of parameters(?)
  - x,y,width, height vs. lon, lat, bbox
