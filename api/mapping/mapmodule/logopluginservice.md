# LogoPluginService

## Description
This service can be used to extend the Logo-plugin.

```javascript
var link = [
  {
    link: 'http://arctic-sdi.org/wp-content/uploads/2016/09/fact-sheet-copy-Sept-2016.pdf',
    title: 'Arctic SDI Fact Sheet'
  },
  {
    link: 'https://auth0.com/',
    title: 'Auth0'
  }
];

var logoService = Oskari.clazz.create('Oskari.map.LogoPluginService', link);
logoService.extend();
```
