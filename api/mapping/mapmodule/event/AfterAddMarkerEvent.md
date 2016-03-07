# AfterAddMarkerEvent [RPC]

Notifies that marker has been added to the map.

## Description

Event is sent after marker has been added to the map. It is used to notify marker id to user.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* data </td><td> Object </td><td> marker parameters </td><td> </td>
</tr>
<tr>
  <td> \* id </td><td> String </td><td> id of the marker that was added to the map</td><td> </td>
</tr>
</table>

## RPC

Event occurs when marker is added to the map.

<pre class="event-code-block">
<code>
{
  "id": "RPC_MARKER"
}
</code>
</pre>

## Event methods

### getName()
Returns name of the event.

### getData()
Returns marker data, for example:

<pre class="event-code-block">
<code>
{
    x: 411650.70779123,
    y: 6751897.3481153,
    color: "ff0000",
    msg : '',
    shape: 3,
    size: 3
};
</code>
</pre>

### getID()
Returns id of the marker.

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

MarkersPlugin sends AfterAddMarkerEvent when marker is added.

<pre class="event-code-block">
<code>
var addEvent = me.getSandbox().getEventBuilder(
    'AfterAddMarkerEvent')(data, data.id);
me.getSandbox().notifyAll(addEvent);
</code>
</pre>
