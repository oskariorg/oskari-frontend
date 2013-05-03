# GetPublishedMyPlaceLayers
Responsible for getting a list of published myplaces layers.

## Parameters

At the moment omitting the param returns all published myplaces layers whilst by giving it a value returns an empty list.

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>USERS</td>
    <td>String</td>
    <td>List of users whose published layers are wanted</td>
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
With (POST|GET) params:

Response:

### Example curl request