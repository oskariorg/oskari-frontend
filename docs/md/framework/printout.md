# Printout

<table>
  <tr>
    <td>ID</td><td>printout</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>/docs/oskari/api/#!/api/Oskari.mapframework.bundle.printout.PrintoutBundleInstance)</td>
  </tr>
</table>

## Description

Manages settings panel when user has entered to the print mode.

## TODO

* Backend does not take into account all the settings yet.

## Screenshot

![screenshot](<%= docsurl %>images/printout.png)

## Bundle configuration

No configuration is required.

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

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MapLayerVisibilityChangedEvent</td><td>Refresh printable map if event received</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td><td>Linked in portal theme</td><td> Used to create the component UI from begin to end</td>
  </tr>
</table>
