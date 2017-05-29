# LogoPluginService

## Description
This service can be used to extend the Logo-plugin.

```javascript
var logoService = Oskari.getSandbox().getService('Oskari.map.LogoPluginService');
var options = {
  id:'links',
  callback: function() {
    //here you can construct you popup
    alert("Hello world");
  }
}
logoService.addLabel('Title', options);
```
