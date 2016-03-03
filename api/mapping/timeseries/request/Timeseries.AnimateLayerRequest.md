# Timeseries.AnimateLayerRequest

Allows to start layer time dimension animate.

## Use cases

- Animate layer

## Description

Activates timeseries playback UI to map and init this.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* layerId </td><td> String </td><td> layer id</td><td> </td>
</tr>
<tr>
  <td> \* times </td><td> Object/Array </td><td> layer supported times (ISO8601 format)</td><td> </td>
</tr>
<tr>
  <td> autoPlay </td><td> Boolean </td><td> start auto play</td><td> </td>
</tr>
<tr>
  <td> \* dimensionName </td><td> String </td><td> layer dimension name</td><td> </td>
</tr>
<tr>
  <td> \* units </td><td> String </td><td> layer dimension format</td><td> </td>
</tr>
</table>

Times-parameter can be a Array or Object. Supported Array type listed all layer time dimensions. For example: 
```javascript
['2016-02-26T09:40:00.000Z','2016-02-26T09:45:00.000Z','2016-02-26T09:50:00.000Z','2016-02-26T09:55:00.000Z','2016-02-26T10:00:00.000Z']
```


Parameters for times-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* interval </td><td> String (ISO8601 format)</td><td> time interval, for example 'PT5M'</td><td> </td>
</tr>
<tr>
  <td> \* start </td><td> String (ISO8601 format)</td><td> time start datetime, for example '2016-02-25T15:25:00.000Z'</td><td> </td>
</tr>
<tr>
  <td> \* end </td><td> String (ISO8601 format)</td><td> time end datetime, for example '2016-03-01T13:20:00.000Z'</td><td> </td>
</tr>
</table>

## Examples

Start animate layer:
```javascript
var sb = Oskari.getSandbox();
var rn = 'MapModulePlugin.AddFeaturesToMapRequest';

sb.postRequestByName('Timeseries.AnimateLayerRequest', ['1000', ['2016-02-26T09:40:00.000Z','2016-02-26T09:45:00.000Z','2016-02-26T09:50:00.000Z','2016-02-26T09:55:00.000Z','2016-02-26T10:00:00.000Z'], false, 'time', 'ISO8601']);
```

## Related api

-