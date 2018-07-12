# DisableMapKeyboardMovementRequest

Disable map keyboard movement.

## Use cases

- disable keyboard pan and zoom movement
- disable keyboard pan movement
- disable keyboard zoom movement

## Description

Requests disable map movements by keyboard.

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

Disable pan and zoom keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapKeyboardMovementRequest');
```

Disable pan keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapKeyboardMovementRequest', [['pan']]);
```

Disable zoom keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DisableMapKeyboardMovementRequest', [['zoom']]);
```