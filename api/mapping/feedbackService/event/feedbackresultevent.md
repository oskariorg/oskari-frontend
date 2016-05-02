# FeedbackResultEvent [rpc]

Notifies that feedback request response has been got from the service. Includes the response data.

## Description

Used to notify if getFeedbackRequest, postFeedbackRequest, getFeedbackServiceRequest or getFeedbackServiceDefinitionRequest was successfull 
and the response data has been got from the service. 

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
               var data = {          
                };
                channel.postRequest('GetFeedbackServiceRequest', [data]);
                
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

### GetFeedbackServiceDefinitionRequest response data

<pre class="event-code-block">
<code>
                           var data = {                             
                               "serviceId":"4ffa4c69601827691b000018"
                               };
                               channel.postRequest('GetFeedbackServiceDefinitionRequest', [data]);
                               
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
                         
                var filterdata = {
                  "start_date": "2016-04-01T00:00:00Z",
                  "status": "open,closed"
                };
                var data = {                
                "srs":"EPSG:3067",
                "getServiceRequests": JSON.stringify(filterdata)
                };
                channel.postRequest('GetFeedbackRequest', [data]);
            
                               
                               // response 
                             

</code>
</pre>

### PostFeedbackRequest response data

<pre class="event-code-block">
<code>
                             var postdata = {
                             "service_code": "180",
                             "description": "Kampin bussipysäkillä on roskis täynnä",
                             "first_name" : "Oskari",
                             "last_name" : "Olematon",
                             "lat": "6674188.748000",
                             "long": "384717.640000"
                             };
                             var data = {                     
                             "srs":"EPSG:3067",
                             "postServiceRequest": JSON.stringify(postdata)
                             };
                             channel.postRequest('PostFeedbackRequest', [data]);
            
                               
                               // response 
                             

</code>
</pre>


## Examples

Used in feedbackService bundle in method getFeedback:

