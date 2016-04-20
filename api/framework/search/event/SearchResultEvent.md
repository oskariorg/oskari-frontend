# SearchResultEvent [rpc]

Response to ``SearchRequest`` with the searchresult.

# Event methods

## getName

Get event name.

## getSuccess

Get search success status. If it's true, search is done and even if no items are found. If false then search is not success.

## getResult

Search result e.g.
```json
{
    "totalCount": 4,
    "locations": [
      {
        "id": 0,
        "rank": 10,
        "lon": "389828.281",
        "village": "Vantaa",
        "name": "Vantaa",
        "zoomScale": 56650,
        "type": "Municipality, urban area",
        "lat": "6686279.347"
      },
      {
        "id": 1,
        "rank": 30,
        "lon": "383183.648",
        "village": "Hausjärvi",
        "name": "Vantaa",
        "zoomScale": 11300,
        "type": "Village, district or neighbourhood",
        "lat": "6733424.84"
      },
      {
        "id": 2,
        "rank": 50,
        "lon": "387139.034",
        "village": "Helsinki",
        "name": "Vantaa",
        "zoomScale": 5650,
        "type": "Watercourse",
        "lat": "6683063.213"
      },
      {
        "id": 3,
        "rank": 50,
        "lon": "383746.169",
        "village": "Nurmijärvi",
        "name": "Vantaa",
        "zoomScale": 2800,
        "type": "House",
        "lat": "6708499.96"
      }
    ]
}
```

## getRequestParameters

The query that was used in search e.g "Vantaa"

## getParams (RPC response)

```json
{
  "success": true,
  "result": {
    "totalCount": 4,
    "locations": [
      {
        "id": 0,
        "rank": 10,
        "lon": "389828.281",
        "village": "Vantaa",
        "name": "Vantaa",
        "zoomScale": 56650,
        "type": "Municipality, urban area",
        "lat": "6686279.347"
      },
      {
        "id": 1,
        "rank": 30,
        "lon": "383183.648",
        "village": "Hausjärvi",
        "name": "Vantaa",
        "zoomScale": 11300,
        "type": "Village, district or neighbourhood",
        "lat": "6733424.84"
      },
      {
        "id": 2,
        "rank": 50,
        "lon": "387139.034",
        "village": "Helsinki",
        "name": "Vantaa",
        "zoomScale": 5650,
        "type": "Watercourse",
        "lat": "6683063.213"
      },
      {
        "id": 3,
        "rank": 50,
        "lon": "383746.169",
        "village": "Nurmijärvi",
        "name": "Vantaa",
        "zoomScale": 2800,
        "type": "House",
        "lat": "6708499.96"
      }
    ]
  },
  "requestParameters": "Vantaa"
}
```