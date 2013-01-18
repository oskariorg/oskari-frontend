# Div Manazer

<table>
  <tr>
    <td> Name </td><td> *divmanazer* </td>
  </tr>
  <tr>
    <td> ID </td><td> *dizmanazer*</td>
  </tr>
  <tr>
    <td> API </td><td> *Link to JS api*</td>
  </tr>
</table>

## Description

Manages menutiles, flyouts and other UI related funtionalities for other bundles to use. Also provides UI components. The tiles are rendered to a HTML element with id "menubar". The bundle doesn't create it but assumes it exists on the page.

### TODO

Document divmanazer basics, JSAPI, deps


### Screenshot

*image*

### Bundle configuration

```javascript
{JSON : config}
```

OR

No configuration is required.

### Bundle state

```javascript
{JSON : state}
```

### Requests the bundle handles

<table>
  <tr>
    <td> Request </td><td> How does the bundle react </td>
  </tr>
  <tr>
    <td> ModalDialogRequest <br> </td><td> *Pops up a modal dialog*</td>
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

### Requests the bundle sends out

<table>
<tbody><tr><td> Request </td><td> Where/why it's used
</td></tr><tr><td> Request name </td><td> *Description*
</td></tr></tbody></table>

### Events the bundle listens to

<table>
<tbody><tr><td> Event </td><td> How does the bundle react
</td></tr><tr><td> Event name </td><td> *How the bundle reacts to the event*
</td></tr></tbody></table>

### Events the bundle sends out

<table>
<tbody><tr><td> Event </td><td> When it is triggered/what it tells other components
</td></tr><tr><td> Event name </td><td> *Description*
</td></tr></tbody></table>

OR

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins)

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><td>API</th><th>Purpose</th>
  </tr>
  <tr>
    <td>Library name</td><td>src where its linked from</td><td>Link to libs API</td><td>*why/where we need this dependency*</td>
  </tr>
</table>
