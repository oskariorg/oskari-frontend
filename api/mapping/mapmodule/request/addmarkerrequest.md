# AddMarkerRequest

Markers can be added to the map by sending an AddMarkerRequest. The request must contain the marker coordinates as well as 
optional parameters, which are color, msg, shape, and size. The shape can be replaced by iconUrl and then the icon is used 
instead. Adding a marker triggers an AfterAddMarkerEvent which provides an ID for the marker that can be referenced to 
remove it or mofidy it. Optionally you can declare the id when sending AddMarkerRequest. If a marker with the same ID 
is on the map it will be modified instead of adding a new marker.

The default parameters are below and overwritten by the provided values in the request.
```javascript
var defaultData = {
            x: 0,
            y: 0,
            color: "ffde00",
            msg : '',
            shape: 2,
            size: 1
        };
```

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
### Marker shapes

Markers are rendered using Raphael fonts. A default font is provided and the shapes are as follows:

0: ![stud](/images/documentation/requests/marker-stud.png)  
1: ![square](/images/documentation/requests/marker-square.png)  
2: ![wide pin](/images/documentation/requests/marker-pin2.png)  
3: ![narrow pin](/images/documentation/requests/marker-pin.png)  
4: ![flag](/images/documentation/requests/marker-flag.png)  
5: ![dot](/images/documentation/requests/marker-dot.png)  
6: ![arrow](/images/documentation/requests/marker-arrow.png)  


### Custom shapes

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

