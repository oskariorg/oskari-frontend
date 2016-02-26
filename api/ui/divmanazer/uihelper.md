# UI Helper

## Description

Processes given element and binds any element with "helptags" attribute with a popup showing the help article

## Usage

There is two way of adding help links. You can let the UIHelper to process your content and based on HTML classes (icon-info) it will add the helper functionality using popups.
```javascript
var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', this.instance.sandbox);
//processHelpLinks(title, content, errorTitle, errorMsg)
helper.processHelpLinks(this.loc.help, content, this.loc.error.title, this.loc.error.nohelp);
```

Another way is to fetch help articles from the backend and show those articles when needed.
```javascript
var me = this;
var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', me.instance.sandbox);
helper.getHelpArticle('termsofuse, mappublication, ' + Oskari.getLang(), function(success, response) {
    if(success) {
        me.termsOfUse = response;
        // terms loaded, try again
        me._showTermsOfUse();
    }
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
