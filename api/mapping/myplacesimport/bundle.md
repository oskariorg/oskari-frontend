# myplacesimport

## Description

This bundle allows the user to import and save their own datas.

## Bundle configuration

```javascript
{
    "name": "MyPlacesImport",
    "sandbox": "sandbox",
    "flyoutClazz": "Oskari.mapframework.bundle.myplacesimport.Flyout",
	"maxFileSizeMb": 10
}
```
* name is the bundle name
* sandbox is the used sandbox name
* flyoutClazz is the used flyout class
* maxFileSizeMb is the maximum upload file size in Mb

## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> userinterface.AddExtensionRequest </td><td> Register as part of the UI in start()-method</td>
  </tr>
  <tr>
    <td> `Toolbar.AddToolButtonRequest` </td><td> Requests the my places import tool to be added to the toolbar </td>
  </tr>
  <tr>
    <td>`userinterface.UpdateExtensionRequest`</td><td>Extends the basic UI view.</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
      <td>[jQuery](http://api.jquery.com/)</td><td>Linked in portal theme</td><td> Used to create the component UI from begin to end</td>
  </tr>
</table>