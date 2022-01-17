# MetadataSearchRequest [rpc]

Make a metadata search query.

## Use cases

- Make a generic metadata search to get metadata results

## Description

Requests metadata search results by given params. After the search is completed a ``MetadataSearchResultEvent`` is triggered where following data is available:
- event.getResults(), returns search result object. Look at MetadataSearchResultEvent.md for more details
- event.hasError(), returns boolean. If ``true``, search has errors

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* searchObject </td><td> Object </td><td> Metadata search object, for example { search: 'search text" }. Object supports same keys as geoportal metadata search.</td><td> </td>
</tr>
</table>

## Examples

Find metadata for `tie` search.
```javascript
const sb = Oskari.getSandbox();
sb.postRequestByName('MetadataSearchRequest', [{ search: 'tie' }]);
```


Find metadata for `tie` search and where responsible organization is `Väylävirasto`.
```javascript
const sb = Oskari.getSandbox();
sb.postRequestByName('MetadataSearchRequest', [{ search: 'tie', OrganisationName: 'Väylävirasto' }]);
```