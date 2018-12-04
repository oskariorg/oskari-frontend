# MouseHoverEvent

Notifies user about the pointer moves.

## Description

Event is used to nofify user about the pointer moves. Event includes information about the pointer coordinates and if moving is paused and if drawing is active. Note that on touch devices this is triggered when the map is panned, so is not the same as mouse move.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* lon </td><td> Number </td><td> longitude on pointer location </td><td> </td>
</tr>
<tr>
  <td> \* lat </td><td> Number </td><td> latitude on pointer location </td><td> </td>
</tr>
<tr>
  <td> \* isPaused </td><td> Boolean </td><td> True if move is paused </td><td> </td>
</tr>
<tr>
  <td> \* pageX </td><td> Number </td><td> viewport pointer position x </td><td> </td>
</tr>
<tr>
  <td> \* pageY </td><td> Number </td><td> viewport pointer position y </td><td> </td>
</tr>
<tr>
  <td> \* isDrawing </td><td> Boolean </td><td> True while drawing (DrawTools) </td><td> </td>
</tr>
</table>

## Event methods

### getName()
Returns event name

### getLon()
Returns longitude on mouse location

### getLat()
Returns latitude on mouse location

### isPaused()
Returns True if move is paused (no move in 1000 ms).

### getPageX()
Returns viewport mouse position x

### getPageY()
Returns viewport mouse position y

### isDrawing()
Returns true while DrawTools drawing is active. Drawing is activated by StartDrawingRequest (e.g. measure tool, add or modify MyPlaces or feature selection tool).
