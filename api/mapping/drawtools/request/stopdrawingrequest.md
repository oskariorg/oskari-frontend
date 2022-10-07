# StopDrawingRequest [rpc]

Used to complete or clear the drawing.

## Use cases

- complete drawing
- clear drawing

## Description

If the user is allowed to draw on the map this request can be used to complete the drawing and/or clear the drawing from the map.

## Parameters

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> id</td><td> String</td><td> Identifier for request. Required for complete drawing. </td><td> </td>
</tr>
<tr>
  <td> clearCurrent</td><td> Boolean</td><td> true - drawings will be removed from the map. If id is given, then id related drawings are removed, otherwise all. <br> false - will keep drawings on the map.</td><td> false</td>
</tr>
<tr>
  <td> supressEvent</td><td> Boolean</td><td> true - does not send out an DrawingEvent.<br> false - sends out DrawingEvent.</td><td> false</td>
</tr>
</table>

## Examples

Complete a draw for 'measure' functionality and keep the drawing on the map:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['measure']);
```

This expects that drawing has been started for id 'measure' and will result in an 'DrawingEvent' where id is 'measure' with the measure data available in event.getData().

Complete a draw for 'myplaces' functionality and clear 'myplaces' drawings from the map:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['myplaces', true]);
```
Again, this expects that drawing has been started for id 'myplaces' and will result in an 'DrawingEvent' where id is 'myplaces' with the drawn shape as geojson available in event.getGeoJson().


Clear 'myplaces' drawings and don't send out an event:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', ['measure', true, true]);
```
This is normally used when functionality is stopped to clean own drawings.

Remove all drawings:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StopDrawingRequest');
```
This can be used to be sure that there isn't any previous or other functionalitys' drawings before a new drawing is started.

## Related api

- StartDrawingRequest
- DrawingEvent
