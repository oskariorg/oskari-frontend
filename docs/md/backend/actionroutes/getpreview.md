# GetPreview
Map preview for the printout bundle

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>mapLayers</td>
    <td>String</td>
    <td>Comma separated layer ids</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>coord</td>
    <td>String</td>
    <td>Coordinates separated with a `_` character</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>zoomLevel</td>
    <td>String</td>
    <td></td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>geojson</td>
    <td>JSON</td>
    <td>Geometries in GeoJSON format</td>
    <td>false</td>
  </tr>
  <tr>
    <td>format</td>
    <td>String</td>
    <td>Accepts `application/pdf` (which it defaults to) and `image/png`</td>
    <td>false</td>
  </tr>
  <tr>
    <td>pageSize</td>
    <td>String</td>
    <td>Page size in ISO 216 format (eg. A4)</td>
    <td>false</td>
  </tr>
  <tr>
    <td>pageTitle</td>
    <td>String</td>
    <td>Title of the page</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
Returns the map view defined in params in the format also defined in params.

### Error

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&zoomLevel=9&coord=384582_6671743&mapLayers=base_35+100+&showMarker=false&forceCache=true&noSavedState=true&action_route=GetPreview&pageSize=A4&pageTitle=&pageLogo=true&pageScale=true&pageDate=true&format=application/pdf`

---
Frontista lähtee parametreja (esim. pageSize ja pageTitle) joita GetPreviewHandler-luokka ei huomioi.
---