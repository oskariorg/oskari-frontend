# AdjustViewAccess
Handles publishing of the view.

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
    <td>View id</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>isPublic</td>
    <td>Boolean</td>
    <td>True to make view public, false to make view private (defaults to false)</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
```javascript
{
  "id": "<view id>",
  "name": "<view name>",
  "uuid": "<user id>",
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
With (POST|GET) params:

Response:

### Example curl request