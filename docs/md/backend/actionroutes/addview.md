# AddView (POST)
This action route is responsible for saving a map view.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>viewName</td>
    <td>String</td>
    <td>Name for the new view</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>viewDescription</td>
    <td>String</td>
    <td>Description for the new view</td>
    <td>false</td>
  </tr>
  <tr>
    <td>viewData</td>
    <td>JSON</td>
    <td>View state (uses handler.getCurrentState() if not given)</td>
    <td>false</td>
  </tr>
  <tr>
    <td>viewIsPublic</td>
    <td>Boolean</td>
    <td>If true, view is public (defaults to false)</td>
    <td>false</td>
  </tr>
  <tr>
    <td>pubDomain</td>
    <td>String</td>
    <td>Publication domain</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "response": "here",
  "and": "here"
}
```

### Error
What's the HTTP status code and does it have an error message or does it return null?

```javascript
{
  "error" : "here"
}
```

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=AddView`

With POST params:
```javascript
{
  "currentViewId": 1
  "viewData": {
    "mapfull": {
      "state": {
        "north":6674344,
        "east":384200,
        "zoom":0,
        "srs":"EPSG:3067",
        "selectedLayers": [
          {"id":"base_35","opacity":100},
          {"id":276,"opacity":80}
        ]
      }
    },
    "toolbar": {
      "state": {
        "selected": {
          "id":"select",
          "group":"basictools"
        }
      }
    },
    "search": {
      "state": {}
    },
    "layerselector2": {
      "state": {
        "tab":"Aiheittain",
        "filter":"sotka",
        "groups":[]
      }
    },
    "maplegend": {
      "state":{}
    },
    "metadataflyout": {

    },
    "printout": {
      "state":{}
    },
    "statsgrid": {
      "state": {
        "indicators": [
          {"indicator":7,"year":"2012","gender":"total"}
        ],
        "currentColumn":"indicator72012total",
        "methodId":"1",
        "numberOfClasses":5,
        "manualBreaksInput":""
      }
    }
  },
  "viewName": "foo",
  "viewDescription": ""
}
```

Response:
```javascript
{
  "id": 957,
  "oldId": -1,
  "height": 0,
  "pubDomain": "",
  "description": null,
  "width": 0,
  "name": null,
  "states": [],
  "uuid": null,
  "lang": "fi"
}
```
