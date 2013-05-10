# DeleteLayer
Deletes the layer with given id. User needs to be logged in and have admin rights.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>layer_id</td>
    <td>String</td>
    <td>Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
null with HTTP status code 200

### Error
stacktrace with HTTP status code 500

## Examples

### Example query for Paikkatietoikkuna
(POST|GET) 
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=DeleteLayer&layer_id=333

Response:
null
