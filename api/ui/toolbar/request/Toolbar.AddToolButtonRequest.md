# Toolbar.AddToolButtonRequest

Requests for toolbar to add button with given config

## Use cases

- Add tool button to toolbar

## Description

Requests for toolbar to add button with given config

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id </td><td> String</td><td> Button identifier </td><td> </td>
</tr>
<tr>
  <td> \* group </td><td> String</td><td> Group identifier </td><td> </td>
</tr>
<tr>
  <td> \* config </td><td> Object </td><td> Button config </td><td> </td>
</tr>
</table>


Parameters for config-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* iconCls </td><td> String </td><td> button icon class </td><td> </td>
</tr>
<tr>
  <td> tooltip </td><td> String </td><td> button tooltip </td><td> </td>
</tr>
<tr>
  <td> show </td><td> Boolean </td><td> show button </td><td> true </td>
</tr>
<tr>
  <td> disabled </td><td> Boolean </td><td> add the button in disabled state </td><td> false </td>
</tr>
<tr>
  <td> callback </td><td> Function </td><td> button callback function </td><td> </td>
</tr>
<tr>
  <td> sticky </td><td> Boolean </td><td> does the button stay active after pressing </td><td> false </td>
</tr>
<tr>
  <td> activeColour </td><td> String </td><td> button active background colour </td><td> </td>
</tr>
<tr>
  <td> toggleChangeIcon </td><td> Boolean </td><td> toggle change button icon. Is this setted true, icon class is calculated for added activeColour (light/dark)</td><td> </td>
</tr>

</table>




## Examples

Add button to toolbar:
```javascript
var sb = Oskari.getSandbox();
var addToolButtonBuilder = sb.getRequestBuilder('Toolbar.AddToolButtonRequest');
var tool = 'ExampleTool';
var group = 'ExampleGroup';
var buttonConf = {
	iconCls: 'mobile-zoom-in',
    tooltip: '',
    sticky: false,
    show: true,
    callback: function (el) {
    	alert('Button clicked');
    }
};
sb.request('MainMapModule', addToolButtonBuilder(tool, group, buttonConf));
```
