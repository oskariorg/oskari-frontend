# rotate.map request
Sets the map at a certain angle based on degrees.

## Parameters
Give the request a number which represents the degrees to rotate. (number)

## Example
### Set the map at a 180 degree angle.

```javascript
  var requestBuilder = Oskari.requestBuilder('rotate.map');
  var request = requestBuilder(180);
  Oskari.getSandbox().request('maprotator', request);
```

### Reset map rotation

```javascript
  var requestBuilder = Oskari.requestBuilder('rotate.map');
  var request = requestBuilder();
  Oskari.getSandbox().request('maprotator', request);
```
