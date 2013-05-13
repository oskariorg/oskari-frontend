# PublishMyPlaceLayer (INCOMPLETE)
Handles the publishing of a user created layer.

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
    <td>Category id for the layer</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>makePublic</td>
    <td>Boolean</td>
    <td>True to make the layer public</td>
    <td>**true**</td>
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
With (POST|GET) params:

Response:

### Example curl request