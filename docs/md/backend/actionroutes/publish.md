# Publish
Logged in users can publish their own maps, which this action route handles.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>pubdata</td>
    <td>JSON</td>
    <td>Map definition</td>
    <td>**true**</td>
  </tr>
</table>

`pubdata` parameter:
<br/>
```javascript
{
  "domain" : "some.domain", // Domain where map is to be published
  "name" : "name.of.map",   // Name of published map
  "language" : "fi",        // Default language {fi, en, sv}
  "plugins": [              // List of enabled plugins and their configs and states where applicable
    { 
      "id" : "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin" 
    }, { 
      "id" : "Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin"
    }, { 
      "id" : "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar",
      "config": {
        "location": {
          "top" : "10px",
          "left" : "10px"
        }
      }
    }, { 
      "id" : "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin" 
    }, { 
      "id" : "Oskari.mapframework.mapmodule.ControlsPlugin" 
    }, { 
      "id" : "Oskari.mapframework.mapmodule.GetInfoPlugin" 
    }, { 
      "id" : "Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin",
      "config" : {
        "baseLayers" : [
          "base_35",
          "24"
        ],
        "defaultBaseLayer" : "base_35"
      }
    }
  ],
  "size" : {               // Map size
    "width" : "800",
    "height" : "600"
  },
  "mapstate" : {           // Map state: location, zoom, layers
    "north" : 7710500,
    "east" : 510000,
    "zoom" : 12,
    "selectedLayers" : [
      { 
        "id" : "base_35",
        "opacity":100 
      }, { 
        "id" : 24,
        "opacity" : 100,
        "hidden" : true
      }
    ]
  },
  "infobox": {            // List of active popups, if any
    "popups" : [] 
  }
}
```

## Response

### Success
```javascript
{ 
  "id" : "<map id>",
  "oldId" : -1,
  "height" : 600,
  "pubDomain" : "some.domain",
  "width" : 800,
  "name" : "name.of.map",
  "states" : [],
  "uuid" : null,
  "lang" : "fi"
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
`http://demo.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&&action_route=Publish&pubdata=%7B%22domain%22%3A%22some.domain%22%2C%22name%22%3A%22name.of.map%22%2C%22language%22%3A%22fi%22%2C%22plugins%22%3A%5B%7B%22id%22%3A%22Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin%22%7D%2C%7B%22id%22%3A%22Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin%22%7D%2C%7B%22id%22%3A%22Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar%22%2C%22config%22%3A%7B%22location%22%3A%7B%22top%22%3A%2210px%22%2C%22left%22%3A%2210px%22%7D%7D%7D%2C%7B%22id%22%3A%22Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin%22%7D%2C%7B%22id%22%3A%22Oskari.mapframework.mapmodule.ControlsPlugin%22%7D%2C%7B%22id%22%3A%22Oskari.mapframework.mapmodule.GetInfoPlugin%22%7D%2C%7B%22id%22%3A%22Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin%22%2C%22config%22%3A%7B%22baseLayers%22%3A%5B%22base_35%22%2C%2224%22%5D%2C%22defaultBaseLayer%22%3A%22base_35%22%7D%7D%5D%2C%22size%22%3A%7B%22width%22%3A%22800%22%2C%22height%22%3A%22600%22%7D%2C%22mapstate%22%3A%7B%22north%22%3A7710500%2C%22east%22%3A510000%2C%22zoom%22%3A12%2C%22selectedLayers%22%3A%5B%7B%22id%22%3A%22base_35%22%2C%22opacity%22%3A100%7D%2C%7B%22id%22%3A24%2C%22opacity%22%3A100%2C%22hidden%22%3Atrue%7D%5D%7D%2C%22infobox%22%3A%7B%22popups%22%3A%5B%5D%7D%7D`

Response:
```javascript
{ 
  "id" : 948,                   // map id
  "oldId" : -1,
  "height" : 600,
  "pubDomain" : "some.domain",
  "width" : 800,
  "name" : "name.of.map",
  "states" : [],
  "uuid" : null,
  "lang" : "fi"
}
```

### Example curl request