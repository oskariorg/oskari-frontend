# Accordion & AccordionPanel

## Description

An Accordion is a passive vertical container for zero or more AccordionPanels. It simply acts as a placeholder for the AccordionPanels and does not
interfere with their states apart from being able to toggle the visibility of all the panels.

An AccordionPanel consists of a header and a content area. It can be visible or (entirely) hidden and open or closed. When the panel is visible,
the header is always displayed. When open, the content is rendered underneath it. An icon next to the header shows the current state and acts as
an open/close button.

## Screenshot

*Example use from `publisher` bundle*

![screenshot](accordion.png)

## How to use

### Simple accordion

```javascript
var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
var panelData = [
  {title: 'A panel', content: 'Example panel', isVisible: true, isOpen: true},
  {title: 'Another panel', content: 'Example panel', isVisible: true, isOpen: false}
];
var panel;
var i = 0;

for (; i < panelData.length; i++) {
  panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
  panel.setTitle(panelData[i].title);
  panel.setContent(panelData[i].content);
  panel.setVisible(panelData[i].isVisible);
  panelData[i].isOpen ? panel.open() : panel.close();
  accordion.addPanel(panel);
}
accordion.insertTo(someContainer);
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
