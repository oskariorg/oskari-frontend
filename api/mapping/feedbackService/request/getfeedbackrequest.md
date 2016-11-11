# GetFeedbackRequest [RPC]

Get feedbacks from feedback service (Open311).

## Description

Request forwards feedback parameters to the request handler.

http://wiki.open311.org/GeoReport_v2/#get-service-requests

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Example</th><th> Details</th>
</tr>
<tr>
  <td>/* srs </td><td> String </td><td> Coordinate system of front end map</td><td>EPSG:3067 </td><td> </td>
</tr>
<tr>
  <td>/* payload </td><td> JSON </td><td> filter params for selecting feedbacks </td><td>{"start_date": "2016-04-01T00:00:00Z","status": "open,closed"} </td><td>http://wiki.open311.org/GeoReport_v2/#get-service-requests </td>
</tr>


<tr>
  <td> lang </td><td> String </td><td> the language in which to get instructions </td><td> </td><td> </td>
</tr>
</table>


## Parameter description

http://wiki.open311.org/GeoReport_v2/

<pre class="event-code-block">
<code>
  payload content                                                              required item
    service_request_id 	To call multiple Service Requests at once,
                        multiple service_request_id can be declared; comma delimited. 	No
                        This overrides all other arguments.
    service_code 	    Specify the service type by calling the unique ID of the service_code. 	No
                        This defaults to all service codes when not declared;
                        can be declared multiple times, comma delimited
    start_date 	        Earliest requested_datetime to include in the search.
                        When provided with end_date, allows one to search for requests
                        which have a requested_datetime that matches a given range,
                        but may not span more than 90 days. 	                      No
                        Must use W3C format, e.g 2010-01-01T00:00:00Z.
    end_date 	        Latest requested_datetime to include in the search.
                        When provided with start_date, allows one to search for requests
                        which have a requested_datetime that matches a given range,
                        but may not span more than 90 days. 	                      No
                        Must use W3C format, e.g 2010-01-01T00:00:00Z.
    status 	            Allows one to search for requests which have a specific status.
                        This defaults to all statuses; can be declared multiple times, comma delimited. 	No
    extensions          The endpoint provides supplemental details about service requests that are in addition to
                        the ones described in the standard specification.
                        These data are nested in the 'extended_attributes' parameter in the Service Request response.
                        In order to retrieve the new supplemental details,
                        add the query parameter �extensions=true� to the request 	No
                        See chapter on Extensions.
    service_object_type	Describes the point of interest reference which is used
                        for identifying the request object. 	No
                        See chapter on Service Objects.
    service_object_id	Describes the ID of the service object 	No
                        If service_object_id is included in the request,
                        then service_object_type must be included.
    lat             	Latitude 	No
                        Location based search if lat, long and radius are given.
    long            	Longitude 	No
                        Location based search if lat, long and radius are given.
    radius           	Radius (meters) in which location based search performed. 	No
                        Location based search if lat, long and radius are given.
    updated_after       Earliest updated_datetime to include in search.
                        Allows one to search for requests which have an updated_datetime between
                        the updated_after time and updated_before time (or now).
                        This is useful for downloading a changeset that includes changes to older requests or
                        to just query very recent changes. 	No
                        Must use w3 format, eg 2010-01-01T00:00:00Z.
    updated_before      Latest updated_datetime to include in search.
                        Allows one to search for requests which have an updated_datetime between
                        the updated_after time and the updated_before time.
                        This is useful for downloading a changeset that includes changes to older requests or
                        to just query very recent changes. 	No
    Extension=geometry:
    bbox                Search bounding box (bbox=lon_min,lat_min,lon_max,lat_max)
    lat 	            Latitude using the (WGS84) projection. 	No/No, if bbox is availabe
    long 	            Longitude using the (WGS84) projection. No/No, if bbox is availabe
    radius 	            Search radius ( unit=m). No/No, if bbox is availabe
     
</code>
</pre>


### Oskari request parameter defaults
There are also parameters, which are not in request api, but must be defined in Oskari publisher when creating the embedded map.

Use Oskari map publishing method for to define these properties for the embedded map

<u>Oskari embedded map configs for feedbackService</u>

    1. **base url**, Open311 service base url
    2. **api_key** value in Open311 post request - posting is not allowed without api key in general
    3. **service extensions**,
    Url, key and extensions are not visible to the user

 --> http://wiki.open311.org/GeoReport_v2/#get-service-requests



## Examples

<pre class="event-code-block">
<code>
  var filterdata = {
    "start_date": "2016-04-01T00:00:00Z",
    "status": "open,closed"
  };
  var data = {
  "baseUrl": "https://asiointi.hel.fi/palautews/rest/v1",
  "srs":"EPSG:3067",
  "payload": filterdata
  };
  channel.postRequest('GetFeedbackRequest', [data]);

</code>
</pre>

<pre class="event-code-block">
<code>
  channel.getMapBbox(function (data) {
        var filterdata = {
            "start_date": "2016-09-01T00:00:00Z",
            "bbox": data.left + ',' + data.bottom + ',' + data.right + ',' + data.top,
            "status": "open,closed"
        };
        var data = {
            "srs": "EPSG:3067",
            "payload": filterdata
        };
        channel.postRequest('GetFeedbackRequest', [data]);
    });

</code>
</pre>

## Related api

- FeedbackResultEvent