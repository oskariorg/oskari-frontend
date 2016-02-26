# PersonalData.AddTabRequest

Requests tab to be added

```javascript
var title = "Tab Title";
var content = jQuery("<div>Lorem ipsum</div>");
var first = true;
var reqName = 'PersonalData.AddTabRequest';
var reqBuilder = sandbox.getRequestBuilder(reqName);
var req = reqBuilder(title, content, first);
```