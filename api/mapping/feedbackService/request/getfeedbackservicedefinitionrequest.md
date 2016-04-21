# GetFeedbackServiceDefinitionRequest [RPC]

Get definition of one feedback service  from feedback service (Open311).

## Description

Request forwards feedback parameters to the request handler.

http://wiki.open311.org/GeoReport_v2/#get-service-definition

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Example</th><th> Details</th>
</tr>
<tr>
  <td>/* baseUrl </td><td> String </td><td> Open311 service base url</td><td>https://asiointi.hel.fi/palautews/rest/v1 </td><td> </td>
</tr>
<tr>
  <td>/* serviceId </td><td> String </td><td> Open311 service_code</td><td></td><td>http://wiki.open311.org/GeoReport_v2/#get-service-definition</td>
</tr>
<tr>
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td><td> </td>
</tr>
</table>


## Parameter description

http://wiki.open311.org/GeoReport_v2/




## Examples

```javascript
   var data = {
                                "baseUrl": "http://test311api.cityofchicago.org/open311/v2/services"
                                "serviceId":"4ffa4c69601827691b000018"
                                };
                                channel.postRequest('GetFeedbackServiceDefinitionRequest', [data]);
            
```

## Related api

- FeedbackResultEvent