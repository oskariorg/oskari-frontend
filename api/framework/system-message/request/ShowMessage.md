# ShowMessage request
Sends a message to system-message bundle for showing.

## Use cases
Get status about layers that didn't load

## Parameters
Give the request a message and a urgency level. (string)
Curent urgency levels: info, warning, error.

## Example

```javascript
 var requestBuilder = Oskari.requestBuilder('ShowMessageRequest');
 var request = requestBuilder('testing', 'info');
 Oskari.getSandbox().request('system-message', request);
```
