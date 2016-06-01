# SearchRequest [RPC]

Make a search query

## Use cases

- Make a generic search to get location results

## Description

Requests search results (addresses, locations) by given params. After the search is completed a ``SearchResultEvent`` is triggered where following data is available:
- event.getSuccess(), returns boolean. If ``true``, search is done and there is no errors
- event.getResult(), returns search result object. Look at searchresultevent.md for more details
- event.getRequestParameters(), returns request paremeters, which are used for search

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* query</td><td> String </td><td> address or location to be searched</td><td> </td>
</tr>
</table>

## Examples

Get search result in an RPC application:
```javascript
  var query = "Finland";
  channel.postRequest('SearchRequest', [ query ],
```

## Related api

- SearchResultEvent