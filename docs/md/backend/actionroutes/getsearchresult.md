# GetSearchResult (POST)
The action route is responsible for handling the location search query based on the search key the user submitted and the language which is used.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>searchKey</td>
    <td>String</td>
    <td>User input search key</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>String</td>
    <td>The language where the search will be targeted to</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "totalCount": "<Total count from all result items>",
  "locations": [ // Array from search result items
    {
      "id": "<result identifier>",
      "rank": "<semantic ordering number>",
      "lon": "<longitude>",
      "village": "<municipality>",
      "name": "<name>",
      "zoomLevel": "<zoom level>",
      "type": "<result type>",
      "lat": "<latitude>"
    }
  ]
}
```

### Error
Returns HTTP code 200 with an error message as a string in response body.
Will return an error if the `searchKey` param is empty, if it contains the `*` character and is under 4 characters long or if it contains more than one `*` characters.

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSearchResult`

With POST params:
<table>
  <tr>
    <th>name</th>
    <th>value</th>
  </tr>
  <tr>
    <td>searchKey</td>
    <td>Hiihtomäentie 35</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>fi</td>
  </tr>
</table>

Response:

```json
{
  "totalCount":2,
  "locations":[
    {
      "id":0,"rank":50,"lon":"390968.165","village":"Helsinki","name":"Hiihtomäentie 35","zoomLevel":"10","type":"Osoite","lat":"6675689.387"
    },
    {
      "id":1,"rank":50,"lon":"261353.172","village":"Vöyri","name":"Hiihtomäentie 35","zoomLevel":"10","type":"Osoite","lat":"7009010.485"
    }
  ]
}
```

### Example curl request