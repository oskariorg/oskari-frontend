# SearchRequest

This request is used to get search result of requested search key.

## Examples

#### Get search result:
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

After the search is completed a ``SearchResultEvent`` is triggered where following data is available:
- event.getSuccess(), returns boolean. If ``true``, search is done and there is no errors
- event.getResult(), returns search result object. Look at searchresultevent.md for more details
- event.getRequestParameters(), returns request paremeters, which are used for search