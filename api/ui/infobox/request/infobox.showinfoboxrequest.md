# InfoBox.ShowInfoBoxRequest [RPC]

Show infobox on map.

## Use cases

- show search result on map
- show data on map on certain location

## Description

Requests infobox to be shown on a map in certain location with certain content.

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
  <td> \* position </td><td> Object </td><td> Coordinates where the infobox should be shown. </td><td> </td>
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
  <td> hidePrevious </td><td> Boolean </td><td> if true, hides any previous popups when showing this </td><td> false </td>
</tr>
<tr>
  <td> colourScheme </td><td> Object </td><td> the colour scheme object for the popup </td><td> default colour scheme </td>
</tr>
<tr>
  <td> font </td><td> String </td><td> the id of the font for the popup </td><td> default font </td>
</tr>
<tr>
  <td> mobileBreakpoints </td><td> Object </td><td> The size of the screen in pixels to start using mobile mode {width: 'mobileModeWidth', height: 'mobileModeHight'}. Both values are not necessary. </td><td> If not given, uses values {width:?, height:?} </td>
</tr>
</table>

Parameters for colourScheme-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> titleColour </td><td> String </td><td> Popup title colour as hexadecimal </td><td></td>
</tr>
<tr>
  <td> headerColour </td><td> String </td><td> Header colour as hexadecimal</td><td></td>
</tr>
<tr>
  <td> bgColour </td><td> String </td><td> Popup content background color as hexadecimal </td><td></td>
</tr>
<tr>
  <td> iconCls </td><td> String </td><td> Class of the close-button, for example 'icon-close-white'</td><td></td>
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
            },
            font: 'georgia'
        }
    ];

  channel.postRequest('InfoBox.ShowInfoBoxRequest', data);
  channel.log('InfoBox.ShowInfoBoxRequest posted with data', data);
});
</code>
</pre>

## Related api

- HideInfoBoxRequest
- RefreshInfoBoxRequest
- InfoBoxActionEvent
- InfoBoxEvent
