# routingService

<table class="table">
  <tr>
    <td>ID</td><td>routingService</td>
  </tr>
  <tr>
    <td>API</td><td>[link](/api/latest/classes/Oskari.mapframework.bundle.routingService.RoutingServiceBundleInstance.html)</td>
  </tr>
</table>

## Description

This bundle provides a service which listen ``GetRouteRequest`` request. When request has made the service send ajax call to Oskari backend and waiting to response. When response come then service sends ``RouteResultEvent``.


## Bundle configuration

No configuration is required. 

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th> Request </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td>`GetRouteRequest`</td><td> Get routing information from Oskari backend and waiting for this response. When response come the answer is forwarded to ``RouteResultEvent``.</td>
  </tr>
</table>

## Requests the bundle sends out

This bundle doesn't send any requests.

## Events the bundle listens to

This bundle doesn't send out any events.

## Events the bundle sends out

<table class="table">
  <tr>
    <th> Event </th><th> Why/when</th>
  </tr>
  <tr>
    <td>`RouteResultEvent`</td><td> Sends routing information to forward.</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td>
    <td>Assumes to be linked in the page</td>
    <td>Used to create the component UI from begin to end</td>
  </tr>
</table>
