# DisableMapMouseMovementRequest

Disable map mouse movement.

## Use cases

- disable mouse pan and zoom movement
- disable mouse pan movement
- disable mouse zoom movement

## Description

Requests disable map movements by muose.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> options </td><td> Array </td><td> pan or zoom</td><td> </td>
</tr>

</table>

## Examples

Disable pan and zoom mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapMouseMovementRequest');
```

Disable pan mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapMouseMovementRequest', [['pan']]);
```

Disable zoom mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapMouseMovementRequest', [['zoom']]);
```