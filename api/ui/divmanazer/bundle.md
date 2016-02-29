# divmanazer

## Description

Manages menutiles, flyouts and other UI related funtionalities for other bundles to use. Also provides UI components. The tiles are rendered to a HTML element with id "menubar". The bundle doesn't create it but assumes it exists on the page.

Bundle also includes extensions for bundle instance, flyout, tile, layout and view. Other Oskari classes can extend these to avoid writing tons of boilerplate code:

```javascript
Oskari.clazz.define(
'Oskari.myframework.bundle.mybundle.MyBundleInstance',
function () {
    // constructor function
}, {
    // the methods of the bundle
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
```

A full example can be found [here](https://github.com/nls-oskari/oskari/blob/master/bundles/framework/bundle/myplacesimport/instance.js).

## TODO

* Make the element id where the tiles are rendered configurable

## Screenshot

![screenshot](divmanazer.png)

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
