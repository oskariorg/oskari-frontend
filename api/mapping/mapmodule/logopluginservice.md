# LogoPluginService

## Description
This service can be used to extend the Logo-plugin.

```javascript
var logoService = Oskari.getSandbox().getService('Oskari.map.LogoPluginService');
var options = {
  id:'links',
  callback: function() {
    var links = [
      {
        link: 'http://arctic-sdi.org/wp-content/uploads/2016/09/fact-sheet-copy-Sept-2016.pdf',
        title: 'Arctic SDI Fact Sheet'
      }
    ];
    alert(links);
  }
}
logoService.addLabel('Title', options);
logoService.trigger("change");
```
