# Geo Location

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin)</td>
  </tr>
</table>

### Description

The plugin tries to locate the user with HTML5 GeoLocation or if that is not available, checks if the javascript methods provided by http://dev.maxmind.com/geoip/javascript are present and uses them if available. If location is successfully determined, centers the map on the location and zoom level 6. The HTML5 geolocation is parametrized to allow for max. one hour cached result and a timeout of 6 seconds.

### Bundle configuration

No configuration is required.

### Requests the plugin handles

This plugin doesn't handle any requests.

### Requests the plugin sends out

This plugin doesn't sends any requests.

### Events the plugin listens to

This plugin doesn't listen to any events.

### Events the plugin sends out

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[OpenLayers](http://openlayers.org/)</td><td>not linked, assumes its linked by map</td><td>Uses mapmodule to transform geolocation coordinates from "EPSG:4326" to maps current projection</td>
  </tr>
</table>
