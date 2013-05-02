# GetFeatureInfoWMS (INCOMPLETE)
Description here. What need does the action route fulfill? Is it GET or POST?

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
    <td></td>
    <td>false</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>lat</td>
    <td>Float</td>
    <td></td>
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
If layer is a WMS layer:
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

Response:

### Example curl request