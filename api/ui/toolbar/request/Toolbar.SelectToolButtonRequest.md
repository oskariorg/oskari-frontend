# Toolbar.SelectToolButtonRequest

Requests for toolbar to act as if user had clicked a button or returns a default tool if create params aren't given.

## Use cases

- Programmatically "click" a button on toolbar

## Description

Can be used to programmatically select buttons on the toolbar like user clicked on them or reset toolbar state to
show the default tool (panning) when functionalities with toolbar buttons are stopped.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> buttonId </td><td> String </td><td> Id for button to click </td><td> Defaults to panning tool if omitted.</td>
</tr>
<tr>
  <td> groupId </td><td> String </td><td> Id for group where button is located in. Required if button id is given. Note! This needs to include the toolbar id before the group. As an example when adding the button with group 'test' and id 'my', selecting the button in the "default" toolbar requires the group id be 'default-test' with buttonId remaining as 'my'. This is not intuitive, but it is the way the request works currently. </td><td></td>
</tr>
</table>
