# Overlay

## Description

The overlay component is defined in divmanazer bundle and provides masking functionality that prevents clicking on something behind the mask.

## TODO

* Loadmask message

## Screenshot

**attach screenshots here with modal dialog**

## How to use

Masks the body element and resizes the mask if overlayd elements size changes. followResizing() with true parameter uses the browser windows resize event to modify size (doesn't monitor the given elements size change, only window size change).

```javascript
var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
overlay.overlay('body');
overlay.followResizing(true);
```

Close the overlay after some operation by keeping reference to the overlay component and call close();

```javascript
overlay.close();
```

Masks an element with id "myComponent".

```javascript
var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
overlay.overlay('#myComponent');
```

Masks an element with id "myComponent". The overlay will detect if the target element size changes and resize itself (followResizing()). With bindClickToClose() the overlay can be closed by clicking on it.

```javascript
var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
overlay.overlay('#myComponent');
overlay.followResizing();
overlay.bindClickToClose();
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
</table>
