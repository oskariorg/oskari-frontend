# UserLocationEvent [rpc]

Notifies user location.

## Description

Used to notify that the ``GetUserLocationRequest`` has received a user geolocation. If getting user location fails then event contains error and lon, lat and accuracy are null otherwise error is null.

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
<tr>
  <td> \* accuracy </td><td> Number </td><td> location accuracy in meters </td><td> </td>
</tr>
<tr>
  <td> \* error </td><td> String </td><td> Possible values: null, 'denied', 'unavailable', 'timeout' </td><td> </td>
</tr>
</table>

## RPC

Event occurs after user's location is fetched

<pre class="event-code-block">
<code>
{
  "lon": 386436.3607007161,
  "lat": 6672447.439965934,
  "accuracy": 150,
  "error": null
}
</code>
</pre>

Event with eror occurs after user's location fetch is failed

<pre class="event-code-block">
<code>
{
  "lon": null,
  "lat": null,
  "accuracy": null,
  "error": "denied"
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

### getAccuracy()

Returns location accuracy.

### getError()

Returns error if occured.

### getParams()

RPC needed function. Tells event parameters.