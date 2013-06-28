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
    "childrens": [      
    ],
    "nameFi": "Turun kaupunki"
  },
  // etc.
}

## TODO 
* group with inspireThemes!