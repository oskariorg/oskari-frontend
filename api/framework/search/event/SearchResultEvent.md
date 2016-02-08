# SearchResultEvent

Used to notify the ``SearchRequest`` is received a reply from search.

# Event methods

## getName

Get event name.

## getSuccess

Get search success status. If it's true, search is done and even if no items are found. If false then search is not success.

## getResult


Get search result items. totalCount is between 0 - 200
e.g.
``
result: Object
locations: Array[8]
0: Object
id: 0
lat: "7277772.598"
lon: "447834.33"
name: "Kylmäaho"
rank: 50
type: "Talo"
village: "Ii"
zoomScale: 2800
__proto__: Object
1: Object
2: Object
3: Object
4: Object
5: Object
6: Object
7: Object
length: 8
__proto__: Array[0]
methods: Array[3]
totalCount: 8
``

## getRequestParameters

Get request parameters. 
- searchKey and epsg values
- e.g {"searchKey": "Helsinki", "epsg":"EPSG:3067"

## getParams

all event data.