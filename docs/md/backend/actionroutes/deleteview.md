# DeleteView
Handles the deletion of a view.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>viewId</td>
    <td>String</td>
    <td>The id of the view</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "id": "<id of the view>",
  "userId": "<user id>"
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
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=DeleteView`

With POST params:
```javascript
{
  "id": 2811
}
```

Response:
```javascript
{
  "id": 2811,
  "userId": FILTERED
}
```
