# Div Manazer 

|| Name || *divmanazer* \\ ||
|| ID || *dizmanazer* \\ ||
|| API || *Link to JS api* ||

## Description

Manages menutiles, flyouts and other UI related funtionalities for other bundles to use. Also provides UI components. The tiles are rendered to a HTML element with id "menubar". The bundle doesn't create it but assumes it exists on the page. 

### TODO

Document divmanazer basics, JSAPI, deps



### Screenshot

*image*

### Bundle configuration
{{{
{JSON : config}
}}}

OR

No configuration is required.

### Bundle state
{{{
{JSON : state}
}}}

### Requests the bundle handles

|| Request || How does the bundle react ||
|| ModalDialogRequest \\ || *Pops up a modal dialog* \\ ||
\\
{{{
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
}}}
\\


### Requests the bundle sends out

|| Request || Where/why it's used ||
|| Request name || *Description* ||

### Events the bundle listens to

|| Event || How does the bundle react ||
|| Event name || *How the bundle reacts to the event* ||

### Events the bundle sends out 

|| Event || When it is triggered/what it tells other components ||
|| Event name || *Description* ||

OR

This bundle doesn't send any events.

### Dependencies (e.g. jquery plugins) 

|| Dependecy || Linked from || API || Purpose ||
|| Library name || src where its linked from || Link to libs API || *why/where we need this dependency* || 