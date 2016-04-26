# feedbackService

## Description

Provides a service which listen ``GetFeedbackRequest`` , ``PostFeedbackRequest`` , ``GetFeedbackServiceRequest`` or ``GetFeedbackServiceDefinitionRequest`` requests. 

When request has made the service send ajax call to Oskari backend and waiting to response. When response come then service sends ``FeedbackResultEvent``.

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
