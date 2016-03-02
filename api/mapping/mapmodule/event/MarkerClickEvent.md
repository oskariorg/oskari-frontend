# MarkerClickEvent [RPC]

Notifies that map marker has been clicked.

## Description

Used to notify the user about the id of the clicked marker.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id </td><td> String </td><td> id of the clicked marker </td><td> </td>
</tr>
</table>

## RPC

Event occurs when map marker is clicked. 

<pre class="event-code-block">
<code>
{
  "id": "REPORT_MARKER"
}
</code>
</pre>

## Event methods

### getName()
Return name of the event.

### getID()
Returns id of the clicked marker.

### getParams()
Returns id of  the marker as an object as follows:

<pre class="event-code-block">
<code>
{
  "id": "RPC_MARKER"
}
</code>
</pre>

## Examples

MarkersPlugin catches marker click and sends MarkerClickEvent:

<pre class="event-code-block">
<code>
/**
 * Creates a marker layer
 * @private
 */
_createMapMarkerLayer: function() {
    var me = this,
        markerLayer = new OpenLayers.Layer.Vector('Markers');
    markerLayer.events.fallThrough = true;
    // featureclick/nofeatureclick doesn't seem to be emitted, so working around that
    markerLayer.events.register('click', this, function(e) {
        if(me._waitingUserClickToAddMarker) {
            // adding a marker, handled in __mapClick()
            return true;
        }
        // clicking on map, check if marker is hit
        if (e.target && e.target._featureId) {
            me.__markerClicked(e.target._featureId);
        }
        return true;
    });

    this.getMap().addLayer(markerLayer);
    this.raiseMarkerLayer(markerLayer);
    return markerLayer;
},

/**
 * Called when a marker has been clicked.
 * @method  __markerClicked
 * @private
 * @param  {String} markerId which was clicked
 */
__markerClicked: function(markerId) {
    var sandbox = this.getSandbox();
    var clickEvent = sandbox.getEventBuilder('MarkerClickEvent')(markerId);
    sandbox.notifyAll(clickEvent);
},
</code>
</pre>
