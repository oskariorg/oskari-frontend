# Grid & GridModel

## Description

A Grid can render a given GridModel as a table. Its features include column aliases, calling external handlers for nested tables, field-specific value renderers,
sorting and selections.

A GridModel is a simple data container that keeps track of key fields and provides convenience methods for addition of structured data.

## Screenshot

![screenshot](<%= docsurl %>images/grid.png)

## Usage

```javascript
var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
for (var i = 0; i < dataArray.length; ++i) {
  gridModel.addData(dataArray[i]);
}
gridModel.setIdField('id');
var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
grid.setDataModel(gridModel);
grid.setVisibleFields([ 'id, 'afield', 'anotherfield' ]);
var idRenderer = function(id, data) {
  var idLink = jQuery('<span class="idlink">' + id '</span>');
  idLink.bind('click', function() { showDetails(id); return false; });
  return idLink;
};
grid.setColumnValueRenderer('id', idRenderer);
grid.setColumnUIName('afield', localisations.afield);
grid.setColumnUIName('anotherfield', localisations.anotherfield);
grid.renderTo(someElement);
```

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Used extensively</td>
  </tr>
</table>
