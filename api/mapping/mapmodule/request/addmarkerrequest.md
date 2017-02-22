# AddMarkerRequest [RPC]

Add marker to mark certain point on map.

## Use cases

- add mark to the click point

## Description

Markers can be added to the map by sending an AddMarkerRequest. The request must contain the marker coordinates and
optional parameters are color, msg, shape, and size. The shape can be replaced by iconUrl and then the icon is used
instead. Adding a marker triggers an AfterAddMarkerEvent which provides an ID for the marker that can be referenced to
remove it or mofidy it. Optionally you can declare the id when sending AddMarkerRequest. If a marker with the same ID
is on the map it will be modified instead of adding a new marker.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>/* data </td><td> Object </td><td> the object should have atleast x and y keys with coordinates and can have color, msg, shape, size and iconUrl</td><td> </td>
</tr>
<tr>
  <td> id </td><td> String </td><td> id for marker. If a marker with same id exists, it will be replaced with this.</td><td> generated</td>
</tr>
</table>

Parameters for data-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* x</td><td> Number </td><td> x coordinate of the marker location </td><td> </td>
</tr>
<tr>
  <td> \* y</td><td> Number </td><td> y coordinate of the marker location </td><td> </td>
</tr>
<tr>
  <td> color </td><td> String </td><td> marker colour </td><td> ffde00 </td>
</tr>
<tr>
  <td> msg </td><td> String </td><td> text to be shown with marker </td><td> '' </td>
</tr>
<tr>
  <td> shape </td><td> Number/String </td><td> If used Oskari builded icons then shape is number. This number tells what icon is used. Shapes are listed below.

  If you want to use own extenal image then shape is url to image.

  If icon svg then tell svg data for it.

  For example:
  2,
  'http://demo.paikkatietoikkuna.fi/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png' or
  '<svg width="32" height="32"></svg>'

  *Note!* IE11 has an unresolved issue with linked SVG-files: https://connect.microsoft.com/IE/feedbackdetail/view/925655/svg-image-has-0x0-size-in-ie11
  You can add the SVG as a string for the shape, but linking it from an URL results in an JS error on IE11.
</td><td> 2 </td>
</tr>
<tr>
  <td> size </td><td> Number </td><td> size of the marker. If you want add a external icon witch is different size than 32 x 32 pixel then you need for ol2 tell here icon size (only supported square) </td><td> 1 </td>
</tr>

<tr>
  <td> offsetX </td><td> Integer </td><td> Where external graphic center point x should be. Calculated from left to right in pixels. </td><td>16</td>
</tr>

<tr>
  <td> offsetY </td><td> Integer </td><td> Where external graphic center point y should be. Calculated from bottom to top in pixels. </td><td>16</td>
</tr>


</table>

Marker shapes

0: ![stud](/images/markers/marker-stud.png)
1: ![square](/images/markers/marker-square.png)
2: ![wide pin](/images/markers/marker-pin2.png)
3: ![narrow pin](/images/markers/marker-pin.png)
4: ![flag](/images/markers/marker-flag.png)
5: ![dot](/images/markers/marker-dot.png)
6: ![arrow](/images/markers/marker-arrow.png)

## Custom shapes

**The easiest way to use custom graphics is to give a own svg marker for shape parameter.  Marker must be 32 x 32 pixel size.

Then you maybe need to tell where custom marker center point should be.
This you can tell for following properties:
- offsetX: center x point of svg image. Starting left to right. Requires a integer value, if not set then using defaults (center icon).
- offsetY: center y point of svg image. Starting bottom to up. Requires a integer value, if not set then using defaults (center icon).
See this at first example.

Or if you dont want to use own svg then you can also tell url to any icon file as done in the second example. In that case, the
size in pixels of the graphics can be controlled by the `size` parameter. The default size is 32x32 pixels. **

SVG-viewport/x/y attributes don't work correctly with custom marker shapes. Don't do this:
```
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve"><style type="text/css">.st0 {fill: #0557d3;} .shadow {filter: drop-shadow( 0 1.2rem 1rem #333   );} .st1{fill:#FFFFFF;}</style><g><g><path class="st0" d="M26.3,11.3C26.3,5.6,21.7,1,16,1S5.7,5.6,5.7,11.3c0,2,0.6,3.8,1.5,5.4h0L16,31l8.9-14.3h0 C25.8,15.2,26.3,13.3,26.3,11.3z"/></g><circle class="st1" cx="16" cy="11.2" r="4.1"/></g></svg>
```
Instead use width="32" height="32". This is a working version of above:
```
<svg width="32" height="32" style="enable-background:new 0 0 32 32;"><style type="text/css">.st0 {fill: #0557d3;} .shadow {filter: drop-shadow( 0 1.2rem 1rem #333   );} .st1{fill:#FFFFFF;}</style><g><g><path class="st0" d="M26.3,11.3C26.3,5.6,21.7,1,16,1S5.7,5.6,5.7,11.3c0,2,0.6,3.8,1.5,5.4h0L16,31l8.9-14.3h0 C25.8,15.2,26.3,13.3,26.3,11.3z"/></g><circle class="st1" cx="16" cy="11.2" r="4.1"/></g></svg>
```

The custom SVG is wrapped with a template having viewBox and width/height of 64x64 so the center can be anywhere in the 32x32 custom SVG.
The provided offsetX and offsetY is used to modify the custom SVGs x/y attributes to place the custom shape inside the 64x64 box and make the marker point to correct coordinates.
```
<svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg"> ... your svg ... </svg>
```

### Oskari builded icons overridings

Another, currently much more complicated method, is to create new vector based marker shapes. They provide high quality
scaling and dynamic color selection, but before much more flexible OpenLayers 3 implementation extending them might not be
worth the effort. However, this is the way to do it:

1. Create new vector marker (size must be a 32 x 32 pixels) shapes with your favorite vector editor and save them into singe svg file. Mark up the center point x for pixels (starting from left to right) and the center point y for pixels (starting from bottom to up).

2. Open your created svg to some text editor. Copy all from startting `<svg>` tag to ending `</svg>`. Remove xmlns and other editor saved unneccessary infos for example `<defs`.

3. In server code override control-base/src/main/resources/fi/nls/oskari/util/svg-markers.json -file.
Array values are objects and object values are:
- offsetX: center point x
- offsetY: center point y
- data: svg data for marker

4. Build oskari-map.war

5. Test your icons:
- add marker
- add point geometry and customize this point symbol

## Examples

Add custom svg marker (this example add happy face icon) to map using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: 377191,
        y: 6678627,
        msg : '',
        shape: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
        offsetX: 16, // center point x position
        offsetY: 16, // center point y position
        size: 3
    };
    var request = reqBuilder(data);
    sb.request('MainMapModule', request);
}
```

Add image based marker to the map using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: 377191,
        y: 6678627,
        shape: '/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png'
    };
    var request = reqBuilder(data);
    sb.request('MainMapModule', request);
}
```

Add shape based marker to the map using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: 377191,
        y: 6678627,
        color: "ff0000",
        msg : '',
        shape: 3,
        size: 3
    };
    var request = reqBuilder(data);
    sb.request('MainMapModule', request);
}
```

Giving an ID for the marker:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: 377191,
        y: 6678627
    };
    var request = reqBuilder(data, 'my marker id');
    sb.request('MainMapModule', request);
}
```

## Related api

- removeMarkersRequest
- afterAddMarkerEvent
- afterRemoveMarkersEvent

