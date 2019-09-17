# EnableMapMouseMovementRequest

Enable map mouse movement.

## Use cases

- enable mouse pan and zoom movement
- enable mouse pan movement
- enable mouse zoom movement

## Description

Requests enable map movements by mouse.

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

Enable pan and zoom mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapMouseMovementRequest');
```

Enable pan mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapMouseMovementRequest', [['pan']]);
```

Enable zoom mouse movement
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('EnableMapMouseMovementRequest', [['zoom']]);
```