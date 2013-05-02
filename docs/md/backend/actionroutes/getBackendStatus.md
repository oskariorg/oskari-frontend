# GetBackendStatus (POST)
Returns the backend status of different services (Subset=AllKnown) or just those services which are down (Subset=Alert). Default value is 'Alert'

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>Subset</td>
    <td>AllKnown/Alert</td>
    <td>Gives info about backendstatus of different services. If value is "AllKnown" it returns statuses of all known services. Alert returns just those which are down.</td>
    <td>**false**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "backendstatus": [
    {
      "id": 187,
      "infourl": "http://directory.spatineo.com/service/3466/",
      "ts": "Tue Oct 30 13:14:06 EET 2012",
      "status": "DOWN",
      "maplayer_id": "95"
    }
  ]
}
```

### Error
Returns HTTP code 200 with an error message as a string in response body.


## Examples

### Example query for Paikkatietoikkuna
(POST) http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetBackendStatus&Subset=AllKnown

Response:

```javascript
{
  "backendstatus": [
    {
      "id": 187,
      "infourl": "http://directory.spatineo.com/service/3466/",
      "ts": "Tue Oct 30 13:14:06 EET 2012",
      "status": "DOWN",
      "maplayer_id": "95"
    }
  ]
}
```

### Example curl request