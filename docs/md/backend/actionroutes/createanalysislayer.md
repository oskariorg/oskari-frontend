# CreateAnalysisLayer (POST)
1. Receives parameter for WPS processing and for analysis db transactions
2. Creates WPS execute request to GeoServer
3. Proxy request WPS execute and transforms response results (FeatureCollection) to WFS-T
4. Executes WFS-T (analysis geom data) through GeoServer to Analysis DB
5. Stores other data (column mappings, styles) to Analysis db (iBatis)
6. Responses results back to front


## Parameters
- analyse=JSON
<table>
  <tr>
    <th>name</th>
    <th>method</th>
    <th>fields</th>
    <th>layerId</th>
    <th>layerType</th>
    <th>methodParams</th>
    <th>opasicty</th>
    <th>style</th>
    <th>bbox</th>
    <th>filter</th>
  </tr>
  <tr>
    <td>Analyysi_*</td>
    <td>buffer||aggregate||union||intersect</td>
    <td>eg. {name, address,..}||all||none</td>
    <td>eg. 270</td>
    <td>eg. {distance:100}</td>
    <td>eg. 80 (0-100)</td>
    <td>eg. {style:...}</td>
    <td>eg. {"left":32818,...}</td>
    <td>eg. {}</td>
  </tr>
</table>

### Raw example analyse=
{
    "name": "Analyysi_Pirkanmaan",
    "method": "buffer",
    "fields": "all",
    "layerId": 270,
    "layerType": "wfs",
    "methodParams": {
        "distance": "100"
    },
    "opacity": 100,
    "style": {
        "dot": {
            "size": "4",
            "color": "CC9900"
        },
        "line": {
            "size": "2",
            "color": "CC9900"
        },
        "area": {
            "size": "2",
            "lineColor": "CC9900",
            "fillColor": "FFDC00"
        }
    },
    "bbox": {
        "left": 328184.757,
        "bottom": 6821539.408,
        "right": 331604.757,
        "top": 6823401.408
    }
}

## Response

### Raw example
{
    "result": "",
    "wpsUrl": "",
    "type": "analysislayer",
    "orgName": "Analysis",
    "id": 270,
    "minScale": 80000,
    "wpsName": "",
    "name": "Analyysi_Pirkanmaan",
    "subtitle": "",
    "opacity": 100,
    "wpsLayerId": 136,
    "inspire": "Analysis",
    "maxScale": 1,
    "fields": ["nimi", "osoite"]
}


### Success
- new Analysis layer in Analysis DB  (new WPSlayerId in the response)

- if WpsLayerId == -1, then WPS method doesn't return FeatureCollection (eg. aggregate method) and there is no new analysis layer
- if WpsLayerId == 0 --> something went wrong
- if WpsLayerId > 0  --> ok, new analysis layer is created 

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=CreateAnalysisLayer&analyse=%7B%22name%22%3A%22Analyysi_Tampereen%20%22%2C%22method%22%3A%22buffer%22%2C%22fields%22%3A%22all%22%2C%22layerId%22%3A262%2C%22layerType%22%3A%22wfs%22%2C%22methodParams%22%3A%7B%22distance%22%3A%22100%22%7D%2C%22opacity%22%3A100%2C%22style%22%3A%7B%22dot%22%3A%7B%22size%22%3A%224%22%2C%22color%22%3A%22CC9900%22%7D%2C%22line%22%3A%7B%22size%22%3A%222%22%2C%22color%22%3A%22CC9900%22%7D%2C%22area%22%3A%7B%22size%22%3A%222%22%2C%22lineColor%22%3A%22CC9900%22%2C%22fillColor%22%3A%22FFDC00%22%7D%7D%2C%22bbox%22%3A%7B%22left%22%3A328488%2C%22bottom%22%3A6821717.5%2C%22right%22%3A330198%2C%22top%22%3A6822648.5%7D%7D`

