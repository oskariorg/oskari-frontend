# EnableMapKeyboardMovementRequest

Enable map keyboard movement.

## Use cases

- enable keyboard pan and zoom movement
- enable keyboard pan movement
- enable keyboard zoom movement

## Description

Requests enable map movements by keyboard.

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

Enable pan and zoom keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapKeyboardMovementRequest');
```

Enable pan keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapKeyboardMovementRequest', [['pan']]);
```

Enable zoom keyboard movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapKeyboardMovementRequest', [['zoom']]);
```