# SetTimeRequest [RPC]

Allows programmatic change of time for 3d map

## Use cases

- Change time for sun position and shadows

## Description

Requests time to be changed Triggers TimeChangedEvent.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* date </td>
  <td> String</td>
  <td> DD/mm date to be set</td>
  <td> </td>
</tr>
<tr>
  <td> \* time </td>
  <td> String </td>
  <td> HH:mm time to be set</td>
  <td> </td>
</tr>
<tr>
  <td> year </td>
  <td> Number </td>
  <td> Year for date</td>
  <td> Current year</td>
</tr>
</table>

## Examples

Set time
```javascript
const sb = Oskari.getSandbox();

const date = "28/2";
const time = "12:00";
const year = 2010

sb.postRequestByName('SetTimeRequest', [date, time, year]);
```

## Related api

- TimeChangedEvent
