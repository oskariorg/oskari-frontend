# [Name of the request] [RPC] <-- add this tag if request works with RPC

[Tell here shortly where is the request used. For example "Allows the user to draw on the map."]

## Use cases

[List of use cases, for example:]
- measure line
- measure area

## Description

[Technical side. What the request really does. For example "Activates draw control on map."]

## Parameters

[List here the parameters that need to (or can be) given to the request]
(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> [Parameter name]</td><td> [Parameter type, f.e. "String"]</td><td> [Description, f. e. "Identifier for request"]</td><td> </td>
</tr>
</table>

[If some of the parameters are objects, list their parameters next:]
Parameters for [Name]-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> [Parameter name]</td><td> [Parameter type, f.e. "String"]</td><td> [Description, f. e. "Identifier for request"]</td><td> </td>
</tr>
</table>

## Examples

[Give here examples of the use of the request. First small description and then code example. For example:]

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString'], {
	showMeasureOnMap: true
});
```

## Related api

[List of related requests and events, for example:]

- StopDrawingRequest
- DrawingEvent