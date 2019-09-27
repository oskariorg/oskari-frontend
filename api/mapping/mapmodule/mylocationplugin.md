# My Location Plugin

## Description

The plugin offers the user a center map a his geolocation.

## Screenshot

![screenshot](images/mylocationplugin.png)

## Bundle configuration

No configuration is required, following options are optionals:

```javascript
{
  "zoom" : 11,
  "mode": "single", 
  "centerMapAutomatically": true
}
```

Configurable options:
* zoom: configure zoom level what is used when zoomed to user location
* mode: "single" or "continuous". 
    * Single mode: when clicking icon zoom map to user location. 
    * Continuous mode: Show user location on the map (ball) and also show accurary cicle, location ball/circle move when user location changed. If user location is outside the map viewport then map is centered to user location.
* centerMapAutomatically: `true` or `false`. When setted to `true` map is centered to user location automatically on startup.
* mobileOnly: `true` or `false`. If setted to `true` then `centerMapAutomatically` and `mode` only take effects on mobile devices

Default configuration:
{
  "mode: "single",
  "centerMapAutomatically": false
}

## Requests the plugin handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td> [MyLocationPlugin.GetUserLocationRequest](/documentation/requests/getuserlocationrequest) </td><td> Gets user geolocation</td>
  </tr>
</table>

## Requests the plugin sends out

<table class="table">
  <tr>
    <th>Request</th><th>Where/why it's used</th>
  </tr>
  <tr>
    <td>StartUserLocationTrackingRequest</td><td>Start user tracking</td>
  </tr>
  <tr>
    <td>StopUserLocationTrackingRequest</td><td>Stop user tracking</td>
  </tr>
</table>

## Events the plugin listens to

This bundle doesn't listen to any events.

## Events the plugin sends out

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>[UserLocationEvent](/documentation/events/userlocationevent)</td>
    <td>Sends the event when getted user geolocation.</td>
  </tr>
</table>


## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked </td>
    <td> Used to create the UI</td>
  </tr>
</table>
