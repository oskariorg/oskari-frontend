# InfoBox.HideInfoBoxRequest [rpc]

Hide infobox from the map.

## Use cases

- hide specific infobox by given id
- hide all infoboxes existing in UI 

## Description

Requests infobox to be hidden.

## Parameters


(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> id </td><td> String </td><td> infobox's id. If not given, will hide all infoboxes existing in UI</td><td> </td>
</tr>
</table>

## Examples

Hide infobox with id 'myInfoBox':
<pre class="event-code-block">
<code>
var infoboxId = 'myInfoBox';
var sb = Oskari.getSandbox();
sb.postRequestByName('InfoBox.HideInfoBoxRequest', [infoboxId]);
</code>
</pre>

Hide all infoboxes:
<pre class="event-code-block">
<code>
var sb = Oskari.getSandbox();
sb.postRequestByName('InfoBox.HideInfoBoxRequest');</code>
</pre>

## Related api

- ShowInfoBoxRequest
- RefreshInfoBoxRequest
- InfoBoxActionEvent
- InfoBoxEvent
