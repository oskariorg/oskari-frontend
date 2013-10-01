# Guided Tour

<table>
  <tr>
    <td>ID</td><td>guidedtour</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.guidedtour.GuidedTourBundleInstance.html)</td>
  </tr>
</table>

## Description

Shows a dialog on startup to instruct user on map functionalities in paikkatietoikkuna.fi

## Screenshot

![screenshot](<%= docsurl %>images/guidedtour.png)

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.UpdateExtensionRequest</td><td>Opens and closes flyouts when demonstrating functionalities</td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality</td>
  </tr>
  <tr>
    <td> [Oskari toolbar](<%= docsurl %>framework/toolbar.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari search](<%= docsurl %>framework/search.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari layerselector](<%= docsurl %>framework/layerselector.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari layerselection](<%= docsurl %>framework/layerselection.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari personaldata](<%= docsurl %>framework/personaldata.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari publisher](<%= docsurl %>framework/publisher.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule/portti2zoombar](<%= docsurl %>framework/mapmodule/portti2zoombar.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule/panbuttons](<%= docsurl %>framework/mapmodule/panbuttons.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for demonstrating functionality</td>
  </tr>
</table>