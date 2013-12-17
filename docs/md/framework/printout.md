# Printout

<table>
  <tr>
    <td>ID</td><td>printout</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>Oskari.mapframework.bundle.printout.PrintoutBundleInstance.html)</td>
  </tr>
</table>

## Description

Manages settings panel when user has entered to the print mode.

## TODO

* Backend does not take into account all the settings yet.

## Screenshot

![screenshot](<%= docsurl %>images/printout.png)

## Bundle configuration

Configuration is available for print preview service urls and legend styling parameters
(portti_bundle_config_printout_update.sql)

            "legend" : {
                "general" : {
                    "legendWidth" : 0.27,     (Legend size is 0.27 * Map longer edge)
                    "legendRowHeight" : 0.02, (Legend row height is 0.02 * Map longer edge)
                    "charsInrow" : 32         (Max length of title row without line break)
                    ...

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>PrintMapRequest</td><td>Prints map when requested</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>DisableMapKeyboardMovementRequest</td><td>Disables keyboard listener for map movements</td>
    <td>EnableMapKeyboardMovementRequest</td><td>Enables keyboard listener for map movements</td>
    <td>userinterface.UpdateExtensionRequest</td><td>Bundle closes all flyouts when entering printing mode and its own flyouts when user clicks cancel button.</td>
    <td></td><td>tbd</td>
  </tr>
</table>

### PrintService

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Ajax</td>
    <td>Ajax requests to backend e.g. action_route = GetProxyRequest</td>
  </tr>
 
</table>

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MapLayerVisibilityChangedEvent</td><td>Refresh printable map if event received</td>
    <td>PrintableContentEvent</td><td>Set data for print legend, etc</td>
    <td>PrintWithoutUIEvent</td>Print pdf/png with predefined params without UI</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send out any events.

## Plugins

### LegendPlugin

This plugin handles legend plot to OL map and to final print


## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td><td>Linked in portal theme</td><td> Used to create the component UI from begin to end</td>
  </tr>
</table>
