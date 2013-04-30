# GetSearchResult (POST)
The action route is responsible for performing the location search based on the search key the user submitted and the language which is used.

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
    <td>true</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>String</td>
    <td>The language where the search will be targeted to</td>
    <td>true</td>
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
      "name": "<Name>",
      "zoomLevel": "<zoom level>",
      "type": "<result type>",
      "lat": "<latitude>"
    }
  ]
}
```

### Error
Returns HTTP code 200 with an error message as a string in response body.

```javascript
{
  "error" : "here"
}
```

## Examples

### Example query

### Example curl request