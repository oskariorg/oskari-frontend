# Div Manazer

<table class="table">
  <tr>
    <td>ID</td><td>`divmanazer`</td>
  </tr>
  <tr>
    <td>API</td><td>[link](/api/latest/classes/Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance.html)</td>
  </tr>
</table>

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

![screenshot](/images/bundles/divmanazer.png)

## Bundle configuration

No configuration is required.

## Bundle state

No state handling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`userinterface.ModalDialogRequest`</td><td>*Pops up a modal dialog*</td>
  </tr>
</table>

## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> Request name </td><td> *Description*</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> Event name </td><td> *How the bundle reacts to the event*</td>
  </tr>
</table>

## Events the bundle sends out

<table class="table">
  <tr>
    <th> Event </th><th> When it is triggered/what it tells other components</th>
  </tr>
  <tr>
    <td> Event name </td><td> *Description*</td>
  </tr>
</table>

OR

This bundle doesn't send any events.

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
