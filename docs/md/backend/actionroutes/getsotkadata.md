# GetSotkaData (GET)
Returns data from the SOTKAnet statistics and indicator service based on the params and the action requested.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>version</td>
    <td>String</td>
    <td>Either 1.0 or 1.1</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>action</td>
    <td>String</td>
    <td>The name of the action we want to perform. Valid actions are `indicators`, `indicator_metadata`, `regions` and `data`</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>indicator</td>
    <td>String</td>
    <td>Indicator id. Required for actions `indicator_metadata` and `data`</td>
    <td>**true**/false</td>
  </tr>
  <tr>
    <td>years</td>
    <td>String</td>
    <td>Accepts multiple values. Required for action `data`</td>
    <td>**true**/false</td>
  </tr>
  <tr>
    <td>genders</td>
    <td>String</td>
    <td>Valid gender values are 'male', 'female' or 'total'. Required for action `data`</td>
    <td>**true**/false</td>
  </tr>
</table>

## Response

### Success
Action `indicators` returns an array of objects:
```javascript
[
  {
    "id": "<indicator id>",
    "title": {
      // key-value pair for each localization.
    },
    "organization": {
      "id" : "<organization id>",
      "title": {
        // key-value pair for each localization.
      }
    }
  }
]
```

Action `indicator_metadata`:
```javascript
{
  "id": "<indicator id>",
  "data-updated": "<date of last update>",
  "range": {
    "start": "<first year from which there is data>",
    "end": "<last year from which there is data>""
  },
  "title": {
    // key-value pair for each localization.
  },
  "description": {
    // key-value pair for each localization.
  },
  "interpretation": {
    // key-value pair for each localization.
  },
  "limits": {
    // key-value pair for each localization.
  },
  "legislation": {
    // key-value pair for each localization.
  },
  "notices": {
    // key-value pair for each localization.
  },
  "primaryValueType": {
    "code": "<>",
    "title": {
      // key-value pair for each localization.
    }
  },
  "decimals": "<>",
  "classifications": {
    "region": {
      "title": {
        // key-value pair for each localization.
      },
      "values": [
        // Array of strings.
      ]
    },
    "sex": {
      "title": {
        // key-value pair for each localization.
      },
      "values": [
        // Array of strings.
      ]
    }
  },
  "organization": {
    "id": "<organization id>",
    "title": {
      // key-value pair for each localization.
    }
  },
  "subjects": [
  ],
  "sources": [{
    "organization": {
      "id": "<organization id>",
      "title": {
        // key-value pair for each localization.
      }
    },
    "title": {
      // key-value pair for each localization.
    },
    "description": {
      // key-value pair for each localization.
    }
  }]
}
```

Action `regions` returns an array of objects:
```javascript
[
  {
    "id": "<region id>",
    "code": "<region code>",
    "category": "<category name>",
    "title": {
      // key-value pair for each localization.
    },
    "memberOf": [
      // Array of ids the region is a member of.
    ],
    "uri": "<optional>"
  }
]
```

Action `data` returns an array of objects:
```javascript
[
  {
    "region": "<region code>",
    "indicator": "<indicator id>",
    "primary_value": "<value for given indicator, gender and year>",
    "gender": "<male, female or total>",
    "year": "<eg. 2012>"
  }
]
```

### Error
```javascript
{
  "error" : "message"
}
```

## Examples

### Example queries for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSotkaData&action=data&version=1.0&indicator=127&years=2012&genders=total`

`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSotkaData&action=indicator_metadata&indicator=7&version=1.1`
