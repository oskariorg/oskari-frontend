# GetAnalysisLayers (GET)
This action route returns all the analysislayers which are accessible by the current user. Layer selector flyout (i.e. flyout in layerselector2 bundle) is created using this data.  

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
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
  "analysislayers": [
    {
    // layer1 data
    },
    {
    // layer2 data
    }
  ]
}
```

### Error
Returns HTTP code 200 with an error message as a string in response body.


## Examples

### Example query for Paikkatietoikkuna
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetAnalysisLayers&lang=fi

Response:
```javascript
{
    "analysislayers": [{
        "result": "",
        "wpsUrl": "/karttatiili/wpshandler?",
        "type": "analysislayer",
        "id": "analysis_217_490",
        "minScale": 1500000,
        "wpsName": "oskari:analysis_data_style",
        "orgname": "",
        "name": "Analyysi_Rakennusti",
        "locales": ["ID", "rakennustunnus", "kiinteistotunnus", "tarkistusmerkki", "rakennusnumero", "luontiAika", "muutosAika", "kaytossaolotilanne", "kayttotarkoitus"],
        "wpsLayerId": 490,
        "subtitle": "",
        "opacity": 80,
        "inspire": "",
        "maxScale": 1,
        "fields": ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"]
    }, {
        "result": "",
        "wpsUrl": "/karttatiili/wpshandler?",
        "type": "analysislayer",
        "id": "analysis_217_491",
        "minScale": 1500000,
        "wpsName": "oskari:analysis_data_style",
        "orgname": "",
        "name": "Analyysi_Rakennusti",
        "locales": ["ID", "rakennustunnus", "kiinteistotunnus", "tarkistusmerkki", "rakennusnumero", "luontiAika", "muutosAika", "kaytossaolotilanne", "kayttotarkoitus"],
        "wpsLayerId": 491,
        "subtitle": "",
        "opacity": 80,
        "inspire": "",
        "maxScale": 1,
        "fields": ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"]
    }, {