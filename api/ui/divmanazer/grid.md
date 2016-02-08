# Grid & GridModel

## Description

A Grid can render a given GridModel as a table. Its features include column aliases, calling external handlers for nested tables, field-specific value renderers,
sorting and selections.

A GridModel is a simple data container that keeps track of key fields and provides convenience methods for addition of structured data.

## Screenshot

![screenshot](/images/bundles/grid.png)

## Usage

```javascript
var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
var idRenderer = function(id, data) {
  // set what happens when the 'id' field is clicked
  var idLink = jQuery('<span class="idlink">' + id '</span>');
  idLink.bind('click', function() {
    showDetails(data);
    return false;
  });
  return idLink;
};

for (var i = 0; i < dataArray.length; ++i) {
  gridModel.addData(dataArray[i]);
}
gridModel.setIdField('id');
grid.setDataModel(gridModel);
grid.setVisibleFields([ 'id', 'afield', 'anotherfield' ]);
grid.setColumnValueRenderer('id', idRenderer);
grid.setColumnUIName('afield', localisations.afield);
grid.setColumnUIName('anotherfield', localisations.anotherfield);
grid.renderTo(someElement);
```

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
</table>
