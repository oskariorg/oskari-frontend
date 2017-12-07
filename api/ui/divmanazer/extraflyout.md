# ExtraFlyout

## Description

The ExtraFlyout component is defined in divmanazer bundle and provides a generic extra flyout ui element.

## Screenshot

![screenshot](extraflyout.png)

## How to use

Creates a extra flyout with title "Alert", custom CSS style class and size.

```javascript
var extraflyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', 'Alert', {
                width: '200px',
                height: '300px',
                cls: 'extra-flyout-css-class'
            });
extraflyout.on('show', function() {
    alert('extra flyout opened');
});
extraflyout.on('hide', function() {
    alert('extra flyout closed');
});
```

Hide extra flyout.

```javascript
extraflyout.hide();
```

Show extra flyout.

```javascript
extraflyout.show();
```

Make extra flyout draggable.
```javascript
extraFlyout.makeDraggable({
  scroll: false, // Need container auto-scrolls while dragging? Default false.
  handle: '.oskari-flyouttoolbar' // Make dragging for when mousedown triggered with this elemen. Default '.oskari-flyouttoolbar'.
});
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