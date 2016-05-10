# GetFeedbackServiceRequest [RPC]

Get feedback service list  from feedback service (Open311).

## Description

Request forwards feedback parameters to the request handler.

http://wiki.open311.org/GeoReport_v2/#get-service-list

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Example</th><th> Details</th>
</tr>
<tr>
  <td>/* baseUrl </td><td> String </td><td> Open311 service base url</td><td>https://asiointi.hel.fi/palautews/rest/v1 </td><td> </td>
</tr>
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td><td> </td>
</tr>
</table>


## Parameter description

http://wiki.open311.org/GeoReport_v2/


## Examples

```javascript
   var data = {                 
                  };
                  channel.postRequest('GetFeedbackServiceRequest', [data]);
                  
            
```

## Related api

- FeedbackResultEvent