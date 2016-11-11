# feedbackService

## Description

Provides a Oskari request/event API for listing and posting feedback to Open311-based service. Requires server-side functionality from oskari-server and configuration for the view/app on the server. Configuration fields are provided in the publisher tool.

When request has made the service send ajax call to Oskari backend and waits the response. Service sends ``FeedbackResultEvent`` , when response is received.


## Bundle configuration

No configuration is required, but service parameters must be defined when creating the embedded view in Oskari map publishing module.

![screenshot](feedbackService.png)

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
