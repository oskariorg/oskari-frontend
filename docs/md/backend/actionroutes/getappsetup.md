# GetAppSetup
Returns the configuration and setup for bundles.

## Parameters
Either `viewId` or `oldId` is required.
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
    <td></td>
    <td>false</td>
  </tr>
  <tr>
    <td>oldId</td>
    <td>String</td>
    <td></td>
    <td>false</td>
  </tr>
  <tr>
    <td>noSavedState</td>
    <td>Boolean</td>
    <td>If true, won't save the state in the session</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
Returns the app setup in JSON.

```javascript
{
  "configuration": {
    "<bundle identifier>": {
      "state": { ... },
      "conf": { ... }
    }
  },
  "startupSequence": [
    // Setup objects for each bundle
  ]
}
```

## Examples

### Example query for Paikkatietoikkuna
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&action_route=GetAppSetup
