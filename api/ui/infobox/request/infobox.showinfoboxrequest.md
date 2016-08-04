# InfoBox.ShowInfoBoxRequest [RPC]

Show infobox on map.

## Use cases

- show search result on map
- show data on map on certain location
- show infobox for marker

## Description

Requests infobox to be shown on a map in certain location with certain content.

Infobox features:

- Id refers always to a specific popup. If request is sent with the same id that already exists in UI, the existing one is updated:
 - If location is the same, content is added to the existing popup
 - If location is different, the existing popup is deleted and new popup is added with given parameters

## Parameters

All the parameters are wrapped inside one array.

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id </td><td> String </td><td> id for infobox so we can use additional requests to control it </td><td> </td>
</tr>
<tr>
  <td> \* title </td><td> String </td><td> infobox title </td><td> </td>
</tr>
<tr>
  <td> \* contentData </td><td> Object[] </td><td> JSON presentation for the infobox data </td><td> </td>
</tr>
<tr>
  <td> \* position </td><td> Object </td><td> Coordinates where the infobox should be shown {lon: 411650, lat: 6751897} or marker id {marker: 'MARKER_TEST'}.  If marker and coordinates (lon,lat) are both given then try to show infobox to marker, if wanted marker not found then try to open infobox from wanted coordinates. If cannot open infobox then sending InfoBox.InfoBoxEvent. </td><td> </td>
</tr>
<tr>
  <td> options </td><td> Object </td><td> Additional options for infobox </td><td> </td>
</tr>
</table>

Parameters for options-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> hidePrevious </td><td> Boolean </td><td> if true, hides any previous infoboxes when showing this </td><td> false </td>
</tr>
<tr>
  <td> colourScheme </td><td> Object </td><td> the colour scheme object for the infobox </td><td> default colour scheme </td>
</tr>
<tr>
  <td> font </td><td> String </td><td> the id of the font for the infobox </td><td> default font </td>
</tr>
<tr>
  <td> mobileBreakpoints </td><td> Object </td><td> The size of the screen in pixels to start showing infobox in mobile mode {width: 'mobileModeWidth', height: 'mobileModeHight'}. Both values are not necessary. </td><td> If not given, uses values {width:500, height:480} </td>
</tr>
<tr>
  <td> positioning </td><td> String </td><td> <b><i style="color:#FF0000;">NOTE! OPENLAYERS 3 ONLY!</i></b> Optional parameter, tells the relative position of the popup to the coordinates. Possible values: top, bottom, left, right</td><td> If not provided, the default bottom-right positioning is used. Only affects the popup in desktop-mode. </td>
</tr>

</table>

Parameters for colourScheme-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> titleColour </td><td> String </td><td> Infobox title colour as hexadecimal </td><td></td>
</tr>
<tr>
  <td> headerColour </td><td> String </td><td> Feature header colour as hexadecimal </td><td></td>
</tr>
<tr>
  <td> bgColour </td><td> String </td><td> Infobox header background color as hexadecimal </td><td></td>
</tr>
<tr>
  <td> iconCls </td><td> String </td><td> Class of the close-button, for example 'icon-close-white'</td><td></td>
</tr>
<tr>
  <td> buttonBgColour </td><td> String </td><td> Background color of action buttons in infobox as hexadecimal</td><td></td>
</tr>
<tr>
  <td> buttonLabelColour </td><td> String </td><td> Text color of action buttons in infobox as hexadecimal</td><td></td>
</tr>
<tr>
  <td> linkColour </td><td> String </td><td> Text color of action links in infobox as hexadecimal</td><td></td>
</tr>
</table>
## Examples

Get map center and then show an infobox at that location:
<pre class="event-code-block">
<code>
channel.getMapPosition(function(data) {
    var content = [
        {
            'html': '&lt;div&gt;Map position info:&lt;/div&gt;'
        },
        {
            'html': '&lt;div&gt;Center: '+parseInt(data.centerX)+', '+parseInt(data.centerY)+'&lt;/div&gt;',
            'actions': [
                {
                    name: "My link 1",
                    type: "link",
                    action: {
                        info: "this can include any info",
                        info2: "action-object can have any number of params"

                    }
                },
                {
                    name: "My link 2",
                    type: "link",
                    action: {
                        info: "this can include any info",
                        info2: "action-object can have any number of params"
                    }
                }
            ]
        },
        {
            'html': '&lt;div&gt;Zoom level: '+data.zoom+'&lt;/div&gt;'
        },
        {
            'actions': [
                {
                    name: "My link 3",
                    type: "link",
                    action: {
                        info: "this can include any info",
                        info2: "action-object can have any number of params",
                    }
                },
                {
                    name: "My link 4",
                    type: "link",
                    action: {
                        info: "this can include any info",
                        info2: "action-object can have any number of params",
                    }
                },
                {
                    name: "My button 1",
                    type: "button",
                    group: 1,
                    action: {
                       info: "this can include any info",
                        info2: "action-object can have any number of params",
                        buttonInfo: "This button has group 1 and is placed to the same row with other actions that have the same group"
                    }
                },
                {
                    name: "My button 2",
                    type: "button",
                    group: 1,
                    action: {
                        info: "this can include any info",
                        info2: "action-object can have any number of params",
                        buttonInfo: "This button has group 1 and is placed to the same row with other actions that have the same group"
                    }
                }
            ]
        }                    
    ];
    var data = [
        'myInfoBox',
        'Generic info box',
        content,
        {
            'lon': data.centerX,
            'lat': data.centerY
        },
        {
            colourScheme: {
                bgColour: '#0091FF',
                titleColour: '#FFFFFF',
                headerColour: '#0091FF',
                iconCls: 'icon-close-white'
                buttonBgColour: '#0091FF',
                buttonLabelColour: '#FFFFFF',
                linkColour: '#000000'
            },
            font: 'georgia',

        }
    ];

  channel.postRequest('InfoBox.ShowInfoBoxRequest', data);
  channel.log('InfoBox.ShowInfoBoxRequest posted with data', data);
});
</code>
</pre>


Add marker to center map and open infobox for added marker
<pre class="event-code-block">
<code>
var MARKER_ID = 'MARKER_WITH_POPUP';
channel.getMapPosition(function(data) {
    // Add marker to center map
    var markerData = {
        x: data.centerX,
        y: data.centerY,
        color: "ff0000",
        msg : '',
        shape: 1, // icon number (0-6)
        size: 3
    };
    channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
    channel.log('MapModulePlugin.AddMarkerRequest posted with data', markerData);

    // Open infobox for marker
    var content = [
        {
            'html': '<div>Map position info:</div>'
        },
        {
            'html': '<div>Center: '+parseInt(data.centerX)+', '+parseInt(data.centerY)+'</div>'
        }
    ];
    var infoboxData = [
        'markerInfoBox',
        'Marker info box',
        content,
        {
            marker: MARKER_ID
        },
        {
            mobileBreakpoints: {
                width: 0,
                height: 0
            },
            hidePrevious: true
        }
    ];

    channel.postRequest('InfoBox.ShowInfoBoxRequest', infoboxData);
    channel.log('InfoBox.ShowInfoBoxRequest posted with data', infoboxData);

});
</code>
</pre>

## Related api

- HideInfoBoxRequest
- RefreshInfoBoxRequest
- InfoBoxActionEvent
- InfoBoxEvent
