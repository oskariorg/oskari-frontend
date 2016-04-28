# PostFeedbackRequest [RPC]

Posts user's feedback data to feedback service (Open311).

## Description

Request forwards feedback parameters to the request handler.

http://wiki.open311.org/GeoReport_v2/#post-service-request

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
  <td>/* srs </td><td> String </td><td> Coordinate system of front end map</td><td>EPSG:3067 </td><td> </td>
</tr>
<tr>
  <td>/* postServiceRequest </td><td> JSON </td><td> user's feedback data </td><td>see below example</td><td>http://wiki.open311.org/GeoReport_v2/#post-service-request</td>
</tr>


<tr>
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td><td> </td>
</tr>
</table>


## Parameter description

http://wiki.open311.org/GeoReport_v2/

<pre class="event-code-block">
<code>
   postServiceRequest content                                                  Required item
         api_key 	    Api key for submitting service requests 	        Yes (imported via properties)
         service_code 	The unique identifier for the service request type 	Yes
         description 	A full description of the service request. 	        Yes
                         This is free form text having min 10 and max 5,000 characters.
                         This may contain line breaks, but not html or code.
         title       	Title of the service requests 	No
         lat 	Latitude using the (WGS84) projection. 	Yes
         long 	Longitude using the (WGS84) projection. Yes
         service_object_type                             No
         service_object_id                               No
         address_string 	Human readable address or description of the location. 	No
         email 	 	No
         first_name 	No
         last_name 	No
         phone 	 	No
         media_url 	A URL to media associated with the request, e.g. an image 	No
         media 	Array of file uploads 	No
            
</code>
</pre>


### Oskari request parameter defaults
There are also parameters, which are not in request api, but must be defined in Oskari server configs

<u>Oskari server configs</u>

# api_key value in Open311 post request - posting is not allowed without api key
# api key is not visible to the user
feedback.open311.key=      --> http://wiki.open311.org/GeoReport_v2/#post-service-request

## Examples

<pre class="event-code-block">
<code>
   javascript
   var postdata = {
                              "service_code": "180",
                              "description": "Kampin bussipysäkillä on roskis täynnä",
                              "first_name" : "Oskari",
                              "last_name" : "Olematon",
                              "lat": "6674188.748000",
                              "long": "384717.640000"
                              };
                              var data = {
                              "baseUrl": "https://asiointi.hel.fi/palautews/rest/v1",
                              "srs":"EPSG:3067",
                              "postServiceRequest": JSON.stringify(postdata)
                              };
                              channel.postRequest('PostFeedbackRequest', [data]);
            
</code>
</pre>

## Related api

- FeedbackResultEvent