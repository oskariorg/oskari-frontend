# GetWSCapabilities


## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>wmsurl</td>
    <td>URI</td>
    <td>URL encoded wmsurl used in capabilities query</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>key</td>
    <td>string</td>
    <td>Search string for finding specific key inside of capabilities JSON</td>
    <td>**false**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "WMS_Capabilities":{
    // WMS capability result
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
  "EXCEPTION": "Couldn't request WS CetGapabilities"
}
```

## Examples

### Example query for Paikkatietoikkuna (example.com)
(GET) 
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetWSCapabilities&wmsurl=http%3A%2F%2Fexample.com

Response:
{
  "WMS_Capabilities":{
    // capability result
  }
}


### Example curl request


## TODO
* I think we need to change the name of this action route to GetWMSCapabilities.
* Error messages are not good enough
