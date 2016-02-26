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
  <td> * id </td><td> String </td><td> id for infobox so we can use additional requests to control it </td><td> </td>
</tr>
<tr>
  <td> * title </td><td> String </td><td> infobox title </td><td> </td>
</tr>
<tr>
  <td> * contentData </td><td> Object[] </td><td> JSON presentation for the infobox data </td><td> </td>
</tr>
<tr>
  <td> * lonlat </td><td> Object </td><td> Coordinates where the infobox should be shown. </td><td> </td>
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
</table>

## Examples

Get map center and then show an infobox at that location:
```javascript
channel.getMapPosition(function(data) {
    var content = [
        {
            'html': '<div>Map position info:</div>'
        },
        {
            'html': '<div>Center: '+
                        parseInt(data.centerX)+', '+
                        parseInt(data.centerY)+
                    '</div>'
        },
        {
            'html': '<div>Zoom level: '+data.zoom+'</div>'
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
        true,
        {
            val: 'blue',
            bgColour: '#0091FF',
            titleColour: '#FFFFFF',
            headerColour: '#0091FF',
            iconCls: 'icon-close-white'
        },
        'georgia'
    ];

    channel.postRequest('InfoBox.ShowInfoBoxRequest', data);
});
```

## Related api

- HideInfoBoxRequest
- RefreshInfoBoxRequest
- InfoBoxActionEvent
- InfoBoxEvent
