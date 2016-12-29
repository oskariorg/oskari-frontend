# AfterMapMoveEvent [rpc]

Notifies that map has been moved or zoomed.

## Description

Event is used to notify that map has been moved or zoomed.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* centerX </td><td> Number </td><td> longitude of map center </td><td> </td>
</tr>
<tr>
  <td> \* centerY </td><td> Number </td><td> latitude of map center </td><td> </td>
</tr>
<tr>
  <td> \* zoom </td><td> Number </td><td> map zoomlevel (0-12) </td><td> </td>
</tr>
<tr>
  <td> \* scale </td><td> Number </td><td> map scale </td><td> </td>
</tr>
<tr>
  <td> \* creator </td><td> String </td><td> class identifier of an object that sends an event </td><td> </td>
</tr>
</table>

## RPC

Event occurs after a map has been moved or zoomed.

<pre class="event-code-block">
<code>
{
  "centerX": 411650.70779123,
  "centerY": 6751897.3481153,
  "zoom": 4,
  "scale": 362834
}
</code>
</pre>

## Event methods

### getName()
Returns name of the event

### getCreator()
Returns class identifier of an object that sends an event

### getCenterX()
Returns map center x coordinate

### getCenterY()
Returns map center y coordinate

### getZoom()
Returns map zoom level

### getScale()
Returns map scale

### getParams()
Returns all the parameters of the event as an object:
<pre class="event-code-block">
<code>
{
    centerX: me._centerX,
    centerY: me._centerY,
    zoom: me._zoom,
    scale: me._scale
};
</code>
</pre>

## Examples

Mapmodule.ol3 catches map move and sends AfterMapMoveEvent:

<pre class="event-code-block">
<code>
map.on('moveend', function(evt) {
    var map = evt.map;
    var extent = map.getView().calculateExtent(map.getSize());
    var center = map.getView().getCenter();

    sandbox.getMap().setMoving(false);
    sandbox.printDebug("sending AFTERMAPMOVE EVENT from map Event handler");

    var lonlat = map.getView().getCenter();
    me.updateDomain();
    var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getView().getZoom(), me.getMapScale());
    sandbox.notifyAll(sboxevt);
});
</code>
</pre>
