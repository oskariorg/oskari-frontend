# AddMarkerRequest [RPC]

Add marker to certain point on map.

## Use cases

- mark a point on the map
- similar but simpler API than using AddFeaturesToMap

## Description

Markers can be added to the map by sending an `AddMarkerRequest`. The request must contain the marker coordinates and can have
optional parameters color, msg, shape, and size. The value of shape determines the visualization of the marker.
In case of built-in symbol the size is an abstracted value that is usually in the range of 1-5. In case of custom symbolizer the size is in pixels.
Adding a marker triggers an `AfterAddMarkerEvent` which provides an ID for the marker that can be referenced to
remove it or mofidy it. Optionally you can declare the id when sending AddMarkerRequest. If a marker with the same ID
is on the map it will be modified instead of adding a new marker.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>/* data </td><td> Object </td><td> the object must have atleast x and y keys with coordinates (see other options below) </td><td> </td>
</tr>
<tr>
  <td> id </td><td> String </td><td> id for marker. If a marker with same id exists, it will be replaced with this.</td><td> generated</td>
</tr>
</table>

Recognized keys in data-object:

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
  <td> color </td><td> String </td><td> marker color </td><td> ffde00 </td>
</tr>
<tr>
  <td> msg </td><td> String </td><td> label/text for marker </td><td> '' </td>
</tr>
<tr>
  <td> shape </td><td> Number/String </td><td> Visual presentation of the marker. Numeric value selects a built-in symbolizer for marker (listed below). String value can be SVG or an url for external image. 

  Example values:
  <ul>
    <li>`2` for built-in symbol ![wide pin](/images/markers/marker-pin2.png)</li>
    <li>`https://www.oskari.org/images/done.png` for external image <img src="https://www.oskari.org/images/done.png" /></li>
    <li>`<svg width="32" height="32"></svg>` for SVG symbol given as string</li>
  </ul>

  *Note!* IE11 has an unresolved issue with linked SVG-files: https://connect.microsoft.com/IE/feedbackdetail/view/925655/svg-image-has-0x0-size-in-ie11
  You can add the SVG as a string for the shape, but linking it from an URL results in an JS error on IE11.
</td><td> 2 </td>
</tr>
<tr>
  <td> size </td><td> Number </td><td> size of the marker. For built-in symbols this is usually between `1` and `5` (actual size calculated with `size * 10 + 40`). 
  For symbols that are NOT built-in the size is assumed to be in pixels (defaults to 32x32px, only square icons supported) </td><td> 1 </td>
</tr>

<tr>
  <td> offsetX </td><td> Integer </td><td> Where external graphic center point x should be. Calculated from left to right in pixels. </td><td>16</td>
</tr>

<tr>
  <td> offsetY </td><td> Integer </td><td> Where external graphic center point y should be. Calculated from bottom to top in pixels. </td><td>16</td>
</tr>

<tr>
  <td> transient </td><td> Boolean </td><td> Add marker as transient. If this is set to true, then marker is not saved to state. </td><td>false</td>
</tr>

</table>

### Built-in marker shapes

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
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
  <style type="text/css">
    .st0 { fill: #0557d3; }
    .shadow { filter: drop-shadow( 0 1.2rem 1rem #333); }
    .st1{ fill:#FFFFFF; }
  </style>
  <g>
    <g>
      <path class="st0" d="M26.3,11.3C26.3,5.6,21.7,1,16,1S5.7,5.6,5.7,11.3c0,2,0.6,3.8,1.5,5.4h0L16,31l8.9-14.3h0 C25.8,15.2,26.3,13.3,26.3,11.3z"/>
    </g>
    <circle class="st1" cx="16" cy="11.2" r="4.1"/>
  </g>
</svg>
```
Instead use width="32" height="32". This is a working version of above:
```
<svg width="32" height="32" style="enable-background:new 0 0 32 32;">
  <style type="text/css">
    .st0 { fill: #0557d3; }
    .shadow { filter: drop-shadow( 0 1.2rem 1rem #333); }
    .st1{ fill:#FFFFFF; }
  </style>
  <g>
    <g>
      <path class="st0" d="M26.3,11.3C26.3,5.6,21.7,1,16,1S5.7,5.6,5.7,11.3c0,2,0.6,3.8,1.5,5.4h0L16,31l8.9-14.3h0 C25.8,15.2,26.3,13.3,26.3,11.3z"/>
    </g>
    <circle class="st1" cx="16" cy="11.2" r="4.1"/>
  </g>
</svg>
```

The custom SVG is wrapped with a template having viewBox and width/height of 64x64 so the center can be anywhere in the 32x32 custom SVG.
The provided offsetX and offsetY is used to modify the custom SVGs x/y attributes to place the custom shape inside the 64x64 box and make the marker point to correct coordinates.
```
<svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg"> ... your svg ... </svg>
```

### Overriding Oskari built-in icons

If you are using your own Oskari instance you can override the built-in icons:

1. Create new vector marker shape with your favorite vector editor and save it to a single svg file.
- Size must be 32x32 pixels
- Determine the offset point or "the tip" of the marker. Center point x for pixels (starting from left to right) and the center point y for pixels (starting from bottom to up).

2. Open the created SVG in a text editor. Copy all from startting `<svg>` tag to ending `</svg>`. Remove xmlns and other editor saved unneccessary infos for example `<defs`.

3. In server code adjust the icons in https://github.com/oskariorg/oskari-server/blob/2.7.1/control-base/src/main/resources/fi/nls/oskari/util/svg-markers.json 

Array values are objects and object values are:
- offsetX: center point x
- offsetY: center point y
- data: svg data for marker

4. Build a forked copy of oskari-server/control-base and change your application to reference the forked copy when building oskari-map.war

5. Test your icons:
- add marker
- add point geometry and customize this point symbol

## Examples

Add marker with custom svg symbol (this example add happy face icon) to map using the code below:
```javascript
var data = {
    x: 377191,
    y: 6678627,
    shape: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
    offsetX: 16, // center point x position
    offsetY: 16, // center point y position
    size: 3
};
Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [data]);
```

Add a marker with external png symbolizer to the map using the code below:
```javascript
var data = {
    x: 377191,
    y: 6678627,
    shape: 'https://www.oskari.org/images/done.png'
};
Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [data]);
```

Add a marker with built-in symbol to the map using the code below:
```javascript
var data = {
    x: 377191,
    y: 6678627,
    color: "ff0000",
    msg : 'Testing',
    shape: 3,
    size: 3
};
Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [data]);
```

An `id` will be generated to a marker added to map (in AfterAddMarkersEvent) but you can also define an ID for the marker when adding it:
```javascript
var data = {
    x: 377191,
    y: 6678627
};
Oskari.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [data, 'my marker id']);
```
You can use the `id` to update markers or remove a specific marker.

## Related api

- removeMarkersRequest
- afterAddMarkerEvent
- afterRemoveMarkersEvent

