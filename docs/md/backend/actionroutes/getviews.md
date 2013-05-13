# GetViews
Returns either published views or the views the user has saved.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>viewType</td>
    <td>String</td>
    <td>USER or PUBLISHED (defaults to USER)</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "views": [
    // Object for each view
    {
      "id": "<view id>",
      "description": "<view description>",
      "lang": "<view language>",
      "isPublic": "<Boolean>",
      "name": "<view name>",
      "pubDomain": "<public domain of the view>",
      "state": {
        // State object
      }
    }
  ]
}
```

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetViews`

With POST params:
```javascript
{
  "viewType": "USER"
}
```
