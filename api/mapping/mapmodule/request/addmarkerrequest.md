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
  <td> shape </td><td> Number </td><td> number of the shape. Shapes are listed below. </td><td> 2 </td>
</tr>
<tr>
  <td> size </td><td> Number </td><td> size of the marker </td><td> 1 </td>
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

Custom shapes

**The easiest way to use custom graphics is to give a url to any icon file as done in the first example. In that case, the 
size in pixels of the graphics can be controlled by the `size` parameter. The default size is 32x32 pixels.**

Another, currently much more complicated method, is to create new vector based marker shapes. They provide high quality 
scaling and dynamic color selection, but before much more flexible OpenLayers 3 implementation extending them might not be 
worth the effort. However, this is the way to do it:

1. Create new vector marker shapes with your favorite vector editor and save them into single font file. Supported formats 
are TrueType (TTF), OpenType (OTF), Printer Font Binary (PFB) and PostScript. TrueType is recommended, because it is well 
tested and supported also by Oskari backend renderer. The default Oskari shapes were originally SVG files, which were 
converted to True Type Font format with https://icomoon.io/app/. One possibility is to use apps like 
http://fontstruct.com/ to create TTF file from the scratch.

2. Convert your font file to Raphael font with http://cufon.shoqolate.com/generate/. Remember to include the glyphs you 
have created (e.g. select "All").

3. Copy the contents of the generated Raphael font file to the JavaScript file 
Oskari/bundles/framework/bundle/mapfull/instance.js and modify existing Raphael.registerFont command with your new data.

4. Fine tune your new markers in the file 
Oskari/bundles/framework/bundle/mapmodule-plugin/plugin/markers/MarkersPlugin.js. You might have different name and glyph 
indexes for your new font (see `this._font` variable).

## Examples

Add image based marker to the map using the code below:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
if (reqBuilder) {
    var data = {
        x: 377191,
        y: 6678627,
        iconUrl: '/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png'
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

