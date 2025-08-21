# SearchRequest [RPC]

Make a search query

## Use cases

- Make a generic search to get location results

## Description

Requests search results (addresses, locations) by given params. After the search is completed a ``SearchResultEvent`` is triggered where following data is available:
- event.getSuccess(), returns boolean. If ``true``, search is done and there is no errors
- event.getResult(), returns search result object. Look at searchresultevent.md for more details
- event.getRequestParameters(), returns the `query` that was used for searching
- event.getOptions(), returns options used when requesting search if any

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* query</td><td> String | object </td><td> address or location to be searched, object query expected to have lon and lat keys with coordinate values</td><td> </td>
</tr>
<tr>
  <td> options</td><td> Object </td><td> Arbitratry options to send to server side implementation. These might get handled or not depending on the backend implementation/search channel. A common handling is for key `limit` so client can request less or more results than the instance default. However the instance admin can set a hard limit for results.</td><td>{}</td>
</tr>
</table>

## Examples

Get search result in an RPC application:
```javascript
  var query = "Finland";
  channel.postRequest('SearchRequest', [ query ]);
```

Same search but limit results to 10:
```javascript
  var query = "Finland";
  channel.postRequest('SearchRequest', [ query, { 'limit': 10 } ]);
```

Search based on coordinates (requires a search channel with reverse geocoding capabilities on the server):
```javascript
  var query = {
    lon: 380894,
    lat: 6686612
  };
  channel.postRequest('SearchRequest', [ query ]);
```

## Related api

- SearchResultEvent