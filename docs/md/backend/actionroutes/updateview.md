# UpdateView
Handles updating users' views

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>id</td>
    <td>Integer</td>
    <td>Id of the view</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>newName</td>
    <td>String</td>
    <td>New name for the view</td>
    <td>false</td>
  </tr>
  <tr>
    <td>newDescription</td>
    <td>String</td>
    <td>New description for the view</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "id": "<id of the view>",
  "name": "<name of the view>",
  "isPublic": "<Boolean>"
}
```

### Error
```javascript
{
  "error" : "message"
}
```

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=UpdateView`

With POST params:
```javascript
{
  "id": 2811,
  "newName": "blaa",
  "newDescription": "foo"
}
```

Response:
```javascript
{
  "id": 2811,
  "name": "blaa",
  "isPublic": false
}
```

### Example curl request