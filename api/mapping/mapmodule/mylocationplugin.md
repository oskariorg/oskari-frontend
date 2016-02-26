# My Location Plugin

## Description

The plugin offers the user a center map a his geolocation.

## Screenshot

![screenshot](images/mylocationplugin.png)

## Bundle configuration

No configuration is required.

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

This plugin doesn't sends any requests.

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
