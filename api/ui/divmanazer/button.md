# Button

## Description

The button component is defined in divmanazer bundle and provides a generic button ui element.

## Screenshot

![screenshot](button.png)

## How to use

Creates a button with label "Alert" and binds a handler to it that shows an alert when clicked. `addClass('primary')` makes it visually a "primary" button (colored blue).

```javascript
var alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
alertBtn.addClass('primary');
alertBtn.setTitle('Alert');
alertBtn.setHandler(function() {
  alert('Alert');
});
```

Inserts the button to given element.

```javascript
var myUI = jQuery('div.mybundle.buttons');
alertBtn.insertTo(myUI);
```

Removes the button.

```javascript
alertBtn.destroy();
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
