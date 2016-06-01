# UserLocationEvent [rpc]

Notifies user location.

## Description

Used to notify that the ``GetUserLocationRequest`` has received a user geolocation.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* lon </td><td> Number </td><td> x coordinate of user location </td><td> </td>
</tr>
<tr>
  <td> \* lat </td><td> Number </td><td> y coordinate of user location </td><td> </td>
</tr>
</table>

## RPC

Event occurs after user's location is fetched

<pre class="event-code-block">
<code>
{
  "lon": 386436.3607007161,
  "lat": 6672447.439965934
}
</code>
</pre>

## Event methods

### getName()

Returns event name.

### getLon()

Returns x coordinate of user location.

### getLat()

Returns y coordinate of user location.

### getParams()

RPC needed function. Tells event parameters.