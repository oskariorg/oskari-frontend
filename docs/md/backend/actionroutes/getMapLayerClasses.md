# GetMapLayerClasses (GET|POST)
Returns layers grouped by organizations

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
</table>

## Response

### Success
```javascript
{
  "19": {
    "id": 19,
    "isselectable": true,
    "isgroupmap": false,
    "nameSv": "Åbo stad",
    "nameEn": "City of Turku",
    "maplayers": {
      "239": {
        "wms_dcp_http": "",
        "resource_url_scheme_pattern": "",
        "titleEn": "",
        "layerType": "wmslayer",
        "wms_parameter_layers": "",
        "wmsName": "Opaskartta_kaupunginosat",
        "titleSv": "",
        "inspireTheme": <inspire_theme_id>,
        "tileMatrixSetId": "",
        "legendImage": "",
        "style": "",
        "nameSv": "Åbo stadsdelar",
        "dataUrl": "",
        "opacity": 100,
        "gfiType": "",
        "metadataUrl": "",
        "tileMatrixSetData": "",
        "maxScale": 1,
        "titleFi": "",
        "nameFi": "Turun kaupunginosat",
        "resource_url_scheme": "",
        "resource_daily_max_per_ip": -1,
        "nameEn": "Turku Quarters",
        "descriptionLink": "",
        "minScale": 250000,
        "xslt": "<base64_encoded_styles>",
        "wmsUrl": "<wms_url>",
        "orderNumber": <order_relative_to_other_layers_of_this_organization>
      },
      // etc.
    },
    "childrens": [      
    ],
    "nameFi": "Turun kaupunki"
  },
  // etc.
}
```

### Error
What's the HTTP status code and does it have an error message or does it return null?

```javascript
{
  "error" : "Layer class listing failed"
}
```

## Examples

### Example query for Paikkatietoikkuna
(GET)
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetMapLayerClasses

Response:
{
  "19": {
    "id": 19,
    "isselectable": true,
    "isgroupmap": false,
    "nameSv": "Åbo stad",
    "nameEn": "City of Turku",
    "maplayers": {
      "239": {
        "wms_dcp_http": "",
        "resource_url_scheme_pattern": "",
        "titleEn": "",
        "layerType": "wmslayer",
        "wms_parameter_layers": "",
        "wmsName": "Opaskartta_kaupunginosat",
        "titleSv": "",
        "inspireTheme": 2,
        "tileMatrixSetId": "",
        "legendImage": "",
        "style": "",
        "nameSv": "Åbo stadsdelar",
        "dataUrl": "",
        "opacity": 100,
        "gfiType": "",
        "metadataUrl": "",
        "tileMatrixSetData": "",
        "maxScale": 1,
        "titleFi": "",
        "nameFi": "Turun kaupunginosat",
        "resource_url_scheme": "",
        "resource_daily_max_per_ip": -1,
        "nameEn": "Turku Quarters",
        "descriptionLink": "",
        "minScale": 250000,
        "xslt": "<base64_encoded_styles>",
        "wmsUrl": "<wms_url>",
        "orderNumber": <order_relative_to_other_layers_of_this_organization>
      },
      // etc.
    },
    "childrens": [      
    ],
    "nameFi": "Turun kaupunki"
  },
  // etc.
}

## TODO 
* group with inspireThemes!