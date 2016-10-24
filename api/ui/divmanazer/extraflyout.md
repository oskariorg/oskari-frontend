# ExtraFlyout

## Description

The ExtraFlyout component is defined in divmanazer bundle and provides a generic extra flyout ui element.

## Screenshot

![screenshot](extraflyout.png)

## How to use

Creates a extra flyout with visible, title "Alert", add custom CSS style class and size.

```javascript
var extraflyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance, {title:'Alert'}, {
                width: '200px',
                height: '300px',
                closeCallback: function(popup) {
                     alert('extra flyout closed');
                     console.log(popup);
                },
                showCallback: function(popup) {
                    alert('extra flyout opened');
                    console.log(popup);
                },
                cls: 'extra-flyout-css-class'
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