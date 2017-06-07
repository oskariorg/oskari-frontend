# LogoPluginService

## Description
This service can be used to extend the Logo-plugin.

```javascript
var logoService = Oskari.getSandbox().getService('Oskari.map.LogoPluginService');
var options = {
  id:'links',
  callback: function(event) {
    //here you can construct you popup
    alert("Hello world");
  }
}
logoService.addLabel('Title', options);
```
The callback is optional and will receive the click event from the link in the plugin.
