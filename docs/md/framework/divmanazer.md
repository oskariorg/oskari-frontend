# Div Manazer

<table>
  <tr>
    <td>ID</td><td>divmanazer</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance)</td>
  </tr>
</table>

## Description

Manages menutiles, flyouts and other UI related funtionalities for other bundles to use. Also provides UI components. The tiles are rendered to a HTML element with id "menubar". The bundle doesn't create it but assumes it exists on the page.

## TODO

Document divmanazer basics, JSAPI, deps

## Screenshot

*image*

## Bundle configuration

```javascript
{JSON : config}
```

OR

No configuration is required.

## Bundle state

```javascript
{JSON : state}
```

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>ModalDialogRequest</td><td>*Pops up a modal dialog*</td>
  </tr>
</table>

```javascript
var ok = {
  name : "ok",
  text : "Ok",
  close : true,
  onclick : function() { /* ... */ }
};

var cancel = {
  name : "cancel",
  text : "No",
  close : false,
  onclick : function() {
    alert("Please say yes.");
    if (phase_of_moon === just_right) {
      $.modal.close();
    }
  }
};

var onShow = function(dialog) {
  if ($.dontshowmodaldialogs) {
    dialog.close();
  }
}

var buttons = [ ok, cancel ];
var title = "Click ok";
var msg = "Lorem ipsum"
var reqName = 'userinterface.ModalDialogRequest';
var reqBuilder = sandbox.getRequestBuilder(reqName);
var req = reqBuilder(title, msg, buttons, onShow);
```

## Requests the bundle sends out

<table>
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> Request name </td><td> *Description*</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> Event name </td><td> *How the bundle reacts to the event*</td>
  </tr>
</table>

## Events the bundle sends out

<table>
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

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>Library name</td>
    <td>src where its linked from</td>
    <td>*why/where we need this dependency*</td>
  </tr>
</table>
