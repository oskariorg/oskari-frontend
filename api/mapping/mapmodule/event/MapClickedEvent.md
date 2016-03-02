# MapClickedEvent [rpc]

Notifies user that map has been clicked.

## Description

Event is used to nofify user about the map click. Event includes information about the click coordinates and if Ctrl was pressed at the same time.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* lonlat</td><td> Object </td><td> object with lon and lat keys as coordinates where the map was clicked </td><td> </td>
</tr>
<tr>
  <td> \* mouseX </td><td> Number </td><td> viewport mouse position x coordinate when click happened </td><td> </td>
</tr>
<tr>
  <td> \* mouseY </td><td> Number </td><td> viewport mouse position y coordinate when click happened </td><td> </td>
</tr>
<tr>
  <td> \* ctrlKeyDown </td><td> Boolean </td><td> True if Ctrl key was pressed </td><td> </td>
</tr>
</table>

## RPC

Event occurs when map is clicked.

<pre class="event-code-block">
<code>
{
  "lon": 423424,
  "lat": 6821888,
  "x": 312,
  "y": 236,
  "ctrlKeyDown": false
}
</code>
</pre>

## Event methods

### getName()
Returns name of the 

### getLonLat()
Returns lonlat object

### getMouseX()
Returns viewport mouse position x coordinate when click happened

### getMouseY()
Returns viewport mouse position y coordinate when click happened

### getParams()
Returns object including all the parameters, for example:
<pre class="event-code-block">
<code>
{
    lon: this._lonlat ? this._lonlat.lon : null,
    lat: this._lonlat ? this._lonlat.lat : null,
    x: this._mouseX,
    y: this._mouseY,
    ctrlKeyDown: this._ctrlKeyDown
};
</code>
</pre>

## Examples

Mapmodule.ol3 catches map click and send MapCLickedEvent:
<pre class="event-code-block">
<code>
map.on('singleclick', function (evt) {
    var CtrlPressed = evt.originalEvent.ctrlKey;
    var lonlat = {
      lon : evt.coordinate[0],
      lat : evt.coordinate[1]
    };
    var mapClickedEvent = sandbox.getEventBuilder('MapClickedEvent')(lonlat, evt.pixel[0], evt.pixel[1], CtrlPressed);
    sandbox.notifyAll(mapClickedEvent);
});
</code>
</pre>
