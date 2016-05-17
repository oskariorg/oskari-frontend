# SearchResultEvent [rpc]

Notifies that search result has been got.

## Description

Used to notify that the ``SearchRequest`` has received a reply from search.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* success</td><td> Boolean </td><td> true if result was got successfully</td><td> </td>
</tr>
<tr>
  <td> \* requestParameters</td><td> Object </td><td> request parameters</td><td> </td>
</tr>
<tr>
  <td> \* result</td><td> Object </td><td> search result</td><td> </td>
</tr>
</table>

## Event methods

### getName()
Returns event name

### getSuccess()
Returns true if result was got successfully

### getResult()
Returns search result as JSON

### getRequestParameters()
Returns request parameters as JSON

### getParams()
Returns event parameters as an object:
<pre class="event-code-block">
<code>
{
    success: this._success,
    result: this._result,
    requestParameters: this._requestParameters
};
</code>
</pre>

## RPC

Event occurs after a search request.

<pre class="event-code-block">
<code>
{
  "success": true,
  "result": {
    "methods": [
      {},
      {},
      {}
    ],
    "totalCount": 4,
    "locations": [
      {
        "id": 0,
        "rank": 10,
        "lon": "389828.281",
        "village": "Vantaa",
        "name": "Vantaa",
        "zoomScale": 56650,
        "type": "Kunta, kaupunki",
        "lat": "6686279.347"
      },
      {
        "id": 1,
        "rank": 30,
        "lon": "383183.648",
        "village": "Hausjärvi",
        "name": "Vantaa",
        "zoomScale": 11300,
        "type": "Kylä, kaupunginosa tai kulmakunta",
        "lat": "6733424.84"
      },
      {
        "id": 2,
        "rank": 50,
        "lon": "387139.034",
        "village": "Helsinki",
        "name": "Vantaa",
        "zoomScale": 5650,
        "type": "Virtavesi",
        "lat": "6683063.213"
      },
      {
        "id": 3,
        "rank": 50,
        "lon": "383746.169",
        "village": "Nurmijärvi",
        "name": "Vantaa",
        "zoomScale": 2800,
        "type": "Talo",
        "lat": "6708499.96"
      }
    ]
  },
  "requestParameters": "Vantaa"
}
</code>
</pre>
