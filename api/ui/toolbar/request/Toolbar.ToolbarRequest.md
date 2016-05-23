# Toolbar.ToolbarRequest

Requests for toolbar to create/show/hide/remove a toolbar.

## Use cases

- Add toolbar
- Show toolbar
- Hide toolbar
- Remove toolbar
- Change toolbar name

## Description

Requests for toolbar to add button with given config

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id </td><td> String</td><td> Toolbar identifier </td><td> </td>
</tr>
<tr>
  <td> \* op </td><td> String</td><td> Toolbar operation: add, show, hide, remove or changeName </td><td> </td>
</tr>
<tr>
  <td> \* data </td><td> Object </td><td> Operation arguments as properties </td><td> </td>
</tr>
</table>


Parameters for data-object (add operation):

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> disableHover </td><td> Boolean </td><td> disable hover </td><td> false </td>
</tr>
<tr>
  <td> colours </td><td> Object </td><td> Toolbar colours. Now only supported hover colour. For example: {hover:'#ff0000', background: '#ffffff'} </td><td> {hover: '#3c3c3c', background: '#333438'} </td>
</tr>
<tr>
  <td> title </td><td> String </td><td> Toolbar title </td><td> true </td>
</tr>
<tr>
  <td> toolbarContainer </td><td> Jquery element </td><td> toolbar container </td><td> </td>
</tr>
<tr>
  <td> closeBoxCallback </td><td> Function </td><td> close box callback </td><td> </td>
</tr>

</table>




## Examples

Add toolbar (no hover):
```javascript
var sb = Oskari.getSandbox();
var builder = sb.getRequestBuilder('Toolbar.ToolbarRequest');
var request = builder(
        'ExampleGroup',
        'add',
        {
            show: true,
            toolbarContainer: jQuery('#toolbarContainer'),
            colours: {
                hover: '#ff0000'
            },
            disableHover: true
        }
);
sb.request(me.getName(), request);

```
