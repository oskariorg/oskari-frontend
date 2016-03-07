# ShowProgressSpinnerRequest [RPC]

Allows progress spinner to be shown or hidden on a map.

## Use cases

- Show or hide a progress spinner on a map

## Description

Requests a progress spinner to be shown or hidden on a map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* show </td><td> Boolean </td><td> whether to show or hide the spinner</td><td> </td>
</tr>
</table>

## Examples

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
var isVisible = true;
sb.postRequestByName('ShowProgressSpinnerRequest',[isVisible]);
```