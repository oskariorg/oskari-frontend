# GetAnalysisLayers (GET)
This action route returns all the userlayers which are accessible by the current user. Layer selector flyout (i.e. flyout in layerselector2 bundle) is created using this data.

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
  "userlayers": [
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
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetUserLayers&lang=fi

Response:
```javascript
{
    "userlayers": [{
                          wmsName:   	"Kulta10"
                          params:   	Object {}
                          baseLayerId:   	-1
                          type:   	"userlayer"
                          orgName:   	"oskari.org"
                          renderingUrl:   	"/karttatiili/userlayer?"
                          legendImage:   	""
                          isQueryable:   	true
                          refreshRate:   	0
                          renderingElement:   	"oskari:user_layer_data_style"
                          id:   	"userlayer_29"
                          minScale:   	1500000
                          source:   	"Tukes"
                          realtime:   	false
                          wmsUrl:   	"wfs"
                          description:   	"ttt"
                          name:   	"Kulta10"
                          subtitle:   	""
                          opacity:   	50
                          maxScale:   	1
                          fields:   	["Kivennäise", "Päätöspvm", "the_geom", 4 more...]
                          options:   	Object {}
                       }, {
       ...
    }, {