# SearchRequest [RPC]

Get search result of requested search key

## Use cases

- Search for a place and center map to it

## Description

Requests search results (addresses, locations) by given params. After the search is completed a ``SearchResultEvent`` is triggered where following data is available:
- event.getSuccess(), returns boolean. If ``true``, search is done and there is no errors
- event.getResult(), returns search result object. Look at searchresultevent.md for more details
- event.getRequestParameters(), returns request paremeters, which are used for search

## Parameters

[List here the parameters that need to (or can be) given to the request]
(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>* searchKey</td><td> String </td><td> address or location to be searched</td><td> </td>
</tr>
<tr>
  <td> epsg </td><td> String </td><td> Coordinate system, foe example "EPSG:3067"</td><td> </td>
</tr>
</table>

## Examples

Get search result:
```javascript
 var data = {
            "searchKey": document.getElementById("inputSearch").value,
            "epsg": "EPSG:3067"
        };
        channel.postRequest(
            'SearchRequest',
            [
                data
            ],
```

## Related api

- SearchResultEvent