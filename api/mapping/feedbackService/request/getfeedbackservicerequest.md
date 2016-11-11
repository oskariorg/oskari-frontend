# GetFeedbackServiceRequest [RPC]

Get feedback service list or metadata of single service (if id is given) from feedback service (Open311).

## Description

Triggers FeedbackResultEvent that includes a list of services or details/metadata for requested service.

Listing sample:

```javascript
  [{
        "service_code": "1165",
        "service_name": "Service name",
        "keywords": "",
        "description": "",
        "group": "",
        "type": "realtime",
        "metadata": false
      }]
```
Details for listing: http://wiki.open311.org/GeoReport_v2/#get-service-list

Metadata for service can be fetched by providing the service_code from above to the request as parameter.
*Note!* if metadata property is false in the listing the details might not be available as it's optional in the Open311 specification.

Details for metadata: http://wiki.open311.org/GeoReport_v2/#get-service-definition

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Example</th><th> Details</th>
</tr>
<tr>
  <td> serviceId </td><td> String </td><td> Open311 service_code</td><td></td><td>http://wiki.open311.org/GeoReport_v2/#get-service-definition</td>
</tr>
</table>


## Parameter description

http://wiki.open311.org/GeoReport_v2/

### Oskari request parameter defaults
There are also parameters, which are not in request api, but must be defined in Oskari publisher when creating the embedded map.

Use Oskari map publishing method for to define these properties for the embedded map

<u>Oskari embedded map configs for feedbackService</u>

    1. **base url**, Open311 service base url
    2. **api_key** value in Open311 post request - posting is not allowed without api key in general
    3. **service extensions**,
    Url, key and extensions are not visible to the user


## Examples

```javascript
channel.postRequest('GetFeedbackServiceRequest', []);
channel.postRequest('GetFeedbackServiceRequest', ["1165"]);
```

## Related api

- FeedbackResultEvent