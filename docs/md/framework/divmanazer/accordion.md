# Accordion & AccordionPanel

## Description

An Accordion is a passive vertical container for zero or more AccordionPanels. It simply acts as a placeholder for the AccordionPanels and does not
interfere with their states apart from being able to toggle the visibility of all the panels.

An AccordionPanel consists of a header and a content area. It can be visible or (entirely) hidden and open or closed. When the panel is visible,
the header is always displayed. When open, the content is rendered underneath it. An icon next to the header shows the current state and acts as
an open/close button.

## Screenshot

![screenshot](<%= docsurl %>images/accordion.png)

## How to use

### Simple accordion

```javascript
var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
var panels = [];
for (var i = 0; i < this.panelData.length; i++) {
  var panel = null;
  panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
  panel.setTitle(this.panelData[i].title);
  panel.setContent(this.panelData[i].content);
  panel.setVisible(this.panelData[i].isVisible);
  this.panelData[i].isOpen ? panel.open() : panel.close();
  accordion.addPanel(panel);
}
accordion.insertTo(someContainer.find('div.accordion'));
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
