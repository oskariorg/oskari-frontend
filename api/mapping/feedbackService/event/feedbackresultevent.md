# FeedbackResultEvent [rpc]

Notifies that feedback request response has been got from the service. Includes the response data.

## Description

Used to notify if getFeedbackRequest, postFeedbackRequest or getFeedbackServiceRequest was successful and the response data that was received from the service.

## Response data

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>success</td><td> Boolean</td><td>Successfully got data</td><td> </td>
</tr>
<tr>
  <td>requestParameters</td><td> JSON</td><td>Parameters that were used to get the response.</td><td> </td>
</tr>
<tr>
  <td>plan</td><td> JSON</td><td>Response data.</td><td> </td>
</tr>
</table>

## RPC

Event occurs after above mentioned feedback request has been completed.

### GetFeedbackServiceRequest response data

<pre class="event-code-block">
<code>
    channel.postRequest('GetFeedbackServiceRequest', []);

     // response
    [{
      "success": true,
      "requestParameters": {
          "method": "serviceList"
        },
      "data": {
        "serviceList": [
          {
            "keywords": "ilkivalta, penkit, istuimet,pöydät, katokset, grillit, lipputangot, roska-astiat",
            "description": "Onko puistonpenkki heitetty ojaan tai infotaulu rikottu? Anna palautetta ilkivaltaan liittyen.",
            "service_name": "Ilkivalta",
            "group": "Puhtaanapito",
            "type": "realtime",
            "service_code": "172",
            "metadata": false
          },
          {
            "keywords": "roska,jäte",
            "description": "Ilmoita, jos havaitset suuria määriä roskia yleisillä alueilla, puistoissa tai metsissä.",
            "service_name": "Roskaaminen",
            "group": "Puhtaanapito",
            "type": "realtime",
            "service_code": "246",
            "metadata": false
          }]

</code>
</pre>

### GetFeedbackServiceRequest with id response data

<pre class="event-code-block">
<code>
   channel.postRequest('GetFeedbackServiceRequest', ["4ffa4c69601827691b000018"]);

   // response

   {
     "success": true,
     "requestParameters": {
                           "method": "serviceDefinition"
                         },
     "data":  {
     "service_code": "4ffa4c69601827691b000018",
     "attributes": [{
       "variable": true,
       "code": "FQSKA1",
       "datatype": "string",
       "required": true,
       "order": 1,
       "description": "Vehicle License Plate Number"
     }, {
       "variable": true,
       "code": "FQSKA11",
       "datatype": "number",
       "required": true,
       "order": 2,
       "description": "How many days has the vehicle been parked?"
     }, {
       "variable": true,
       "code": "A511OPTN",
       "datatype": "string",
       "required": false,
       "datatype_description": "Enter number as 999-999-9999",
       "order": 3,
       "description": "Input mobile # to opt-in for text updates. If already opted-in, add mobile # to contact info."
     }]
   }

</code>
</pre>
### GetFeedbackRequest response data

<pre class="event-code-block">
<code>

           {
             "success": true,
             "data": {
               "getFeedback": {
                 "features": [
                   {
                     "geometry": {
                       "coordinates": [
                         [
                           392999.4195,
                           6673187.7602
                         ],
                         [
                           393215.648,
                           6673560.3227
                         ],
                         [
                           393712.9862,
                           6673869.0068
                         ],
                         [
                           393738.1743,
                           6673589.6925
                         ]
                       ],
                       "type": "LineString"
                     },
                     "type": "Feature",
                     "properties": {
                       "address": "",
                       "expected_datetime": "2016-10-27T14:27:07.289496Z",
                       "service_name": "Other issue to be fixed",
                       "service_request_id": "opowug4q",
                       "description": "Vartiosaari kaipaa suojelua",
                       "media_url": "",
                       "status_notes": "",
                       "agency_responsible": "",
                       "requested_datetime": "2016-10-25T07:54:33.278138Z",
                       "updated_datetime": "2016-10-25T07:54:33.278173Z",
                       "service_code": "180",
                       "service_notice": "",
                       "status": "open"
                     }
                   },


</code>
</pre>

### PostFeedbackRequest response data

<pre class="event-code-block">
<code>
                   {
                     "success": true,
                     "data": {
                       "postFeedback": [
                         {
                           "address": "",
                           "expected_datetime": "2016-10-27T17:01:04.681370Z",
                           "service_name": "Other issue to be fixed",
                           "service_request_id": "x1pevj2d",
                           "description": "Kampin bussipysäkillä on roskakori täynnä",
                           "media_url": "",
                           "status_notes": "",
                           "long": 25.0357,
                           "agency_responsible": "",
                           "extended_attributes": {
                             "geometry": {
                               "coordinates": [
                                 25.0357,
                                 60.2379
                               ],
                               "type": "Point",
                               "srid": 4326
                             },
                             "media_urls": []
                           },
                           "requested_datetime": "2016-10-25T10:28:30.665129Z",
                           "updated_datetime": "2016-10-25T10:28:30.665178Z",
                           "service_code": "180",
                           "lat": 60.2379,
                           "service_notice": "",
                           "status": "open"
                         }
                       ]
                     },


</code>
</pre>
