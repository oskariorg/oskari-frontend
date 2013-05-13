# GetSotkaRegion
Returns the id for a region when param `code` is provided, and the region code with param `id` present.

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
    <td>String</td>
    <td>Region id</td>
    <td>false</td>
  </tr>
  <tr>
    <td>code</td>
    <td>String</td>
    <td>Region code</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
With param `code`
```javascript
{
  "id": "<region id>"
}
```

With param `id`
```javascript
{
  "code": "<region code>"
}
```

## Examples

### Example query for Paikkatietoikkuna
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSotkaRegion&id=5`
