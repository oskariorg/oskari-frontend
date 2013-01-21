# TabPanel, TabContainer & TabDropdownContainer

## Description

A TabPanel is a wrapper for a title, a header and content (html) and can call a handler when the tab is selected or unselected.

A TabContainer renders TabPanels as selectable tabs whereas a TabDropdownContainer represents the TabPanel collection as a dropdown list. A callback for panel changes can be registered for both.

## Screenshot

![screenshot](<%= docsurl %>images/tabcontainer.png)
![screenshot](<%= docsurl %>images/tabdropdowncontainer.png)

## Usage

### Simple TabContainer

```javascript
var aPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
aPanel.setTitle('A TabPanel');
aPanel.setContent(someHtml);
var anotherPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
anotherPanel.setTitle('Another TabPanel');
anotherPanel.setContent(someMoreHtml);
var container = null;
if (useDropDown) {
  container = Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer', 'A TabDropdownContainer');
} else {
  container = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', 'A TabContainer');
}
container.addPanel(aPanel);
container.addPanel(anotherPanel);
container.insertTo(someElement);
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
