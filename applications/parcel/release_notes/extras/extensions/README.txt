OpenLayers Extension

This has been tested with OpenLayers 2.12 (Stable) release version.


How to use the extension?

Include js-files into HTML, for example:
        <script src="http://openlayers.org/api/OpenLayers.js"></script>
        <script src="extensions/OpenLayers/Filter/GmlObjectId.js"></script>
        <script src="extensions/OpenLayers/Format/WFST/v1_1_0_extended.js"></script>
        <script src="extensions/OpenLayers/Protocol/WFS/v1_1_0_extended.js"></script>

See js-files for more comments about the use of them.


Why is the extension provided?

The extension provides OpenLayers with means to include GmlObjectId element into the WFS GetFeature requests.
When a WFS GetFeature request is sent to a server in XML format, a server may require GmlObjectId element
with gml:id value instead of FeatureId element with fid value for filtering.

Notice, this extension does not include GmlObjectId in WFST transaction requests when updated data should be
saved into server. The extension only supports GmlObjectId in WFS GetFeature requests.



Maybe extension is not needed after all?

Notice, if the server supports both GmlObjectId and FeatureId but its response only contains GmlObjectId,
OpenLayers default implementation interprets GmlObjectId gml:id values as fid. Then, this fid is used in
OpenLayers instead. Also, if WFST transaction is used to update the data, OpenLayers uses FeatureId fid
as default for filtering when WFST transaction request is sent to server. Then, FeatureId is used even if
original WFS GetFeature request and response would have used only GmlObjectId gml:id. So, if the server
accepts that the client uses FeatureId for WFS GetFeature requests, the extension is not required after all.
The extension is required only if the server demands that GmlObjectId must be used for filtering in WFS
GetFeature requests.
