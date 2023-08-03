/*
Switch map URL to test other maps
*/
var mapUrl =
  "https://kartta.paikkatietoikkuna.fi/?lang=en&uuid=053027f4-91d9-4351-aec4-c6a31dd68c56";
// sets source
document.getElementById("map").src = mapUrl;
// sets domain (localhost is allowed)
var iFrameDomain = mapUrl.substring(0, mapUrl.indexOf("?"));
// init connection
var iFrame = document.getElementById("map");
window.channel = OskariRPC.connect(iFrame, iFrameDomain);

/*
Test parameters for specs
*/
var counter;

var eventCounter;

// ##################### //
// ##### General ####### //
// ##################### //

var general = {
  ExpectedOskariVersion: "2.11.0",
  ExpectedRPCVersion: "2.0.4",
  IsSupported: true,
  srsName: "EPSG:3067",
};

// ##################### //
// ##### Map ########### //
// ##################### //

var defaultPosition = {
  centerX: 386020,
  centerY: 6670057,
  zoom: 0,
  scale: 5805343,
  srsName: "EPSG:3067",
};

var routeSteps = [
  {
    lon: 488704,
    lat: 6939136,
  },
  {
    lon: 338704,
    lat: 6789136,
  },
  {
    lon: 563704,
    lat: 6939136,
  },
];

var tourOptions = {
  animation: "fly",
  duration: 1,
  srsName: "EPSG:3067",
};

var layerParams = {
  layerId: 1632,
  changeLayerStyle: {
    SLD_BODY:
      '<?xml version="1.0" ?><StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"><NamedLayer><Name>tieliikenne:tieliikenne_2015</Name><UserStyle><Title>Heatmap</Title><FeatureTypeStyle><Transformation><ogc:Function name="gs:Heatmap"><ogc:Function name="parameter"><ogc:Literal>data</ogc:Literal></ogc:Function><ogc:Function name="parameter"><ogc:Literal>radiusPixels</ogc:Literal><ogc:Function name="env"><ogc:Literal>radius</ogc:Literal><ogc:Literal>30</ogc:Literal></ogc:Function></ogc:Function><ogc:Function name="parameter"><ogc:Literal>pixelsPerCell</ogc:Literal><ogc:Literal>10</ogc:Literal></ogc:Function><ogc:Function name="parameter"><ogc:Literal>outputBBOX</ogc:Literal><ogc:Function name="env"><ogc:Literal>wms_bbox</ogc:Literal></ogc:Function></ogc:Function><ogc:Function name="parameter"><ogc:Literal>outputWidth</ogc:Literal><ogc:Function name="env"><ogc:Literal>wms_width</ogc:Literal></ogc:Function></ogc:Function><ogc:Function name="parameter"><ogc:Literal>outputHeight</ogc:Literal><ogc:Function name="env"><ogc:Literal>wms_height</ogc:Literal></ogc:Function></ogc:Function></ogc:Function></Transformation><Rule><RasterSymbolizer><Geometry><ogc:PropertyName>the_geom</ogc:PropertyName></Geometry><Opacity>1</Opacity><ColorMap type="ramp" ><ColorMapEntry color="#FFFFFF" quantity="0.02" opacity="0" /><ColorMapEntry color="#4444FF" quantity="0.1" opacity="1" /><ColorMapEntry color="#FF0000" quantity="0.5" opacity="1" /><ColorMapEntry color="#FFFF00" quantity="1" opacity="1" /></ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>',
  },
  resetLayerStyle: {
    SLD_BODY: null,
  },
};

// ##################### //
// ##### Features #####  //
// ##################### //

var featureLayer = {
  layerId: "TEST_LAYER",
  opacity: 75,
  showLayer: true,
  layerName: "TEST_LAYER",
};

var pointGeojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: defaultPosition.srsName,
    },
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [defaultPosition.centerX, defaultPosition.centerY],
      },
      properties: {
        label: "I am a point feature!",
        test_property: "point feature",
      },
    },
  ],
};

var addPointFeatureParams = [
  pointGeojsonObject,
  {
    layerId: "MY_VECTOR_LAYER",
    attributes: {
      testAttribute: "value",
    },
    clearPrevious: false,
    centerTo: true,
    cursor: "zoom-in",
    prio: 2,
    optionalStyles: [],
  },
];

var lineGeojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: defaultPosition.srsName,
    },
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [defaultPosition.centerX, defaultPosition.centerY],
          [defaultPosition.centerX + 100000, defaultPosition.centerY + 1100000],
        ],
      },
      properties: {
        label: "I am a line feature!",
        test_property: "line feature",
      },
    },
  ],
};

var addLineFeatureParams = [
  lineGeojsonObject,
  {
    layerId: "VECTOR",
    clearPrevious: true,
    centerTo: true,
    cursor: "zoom-in",
    prio: 4,
    //minScale: 1451336
  },
];

var polygonGeojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: defaultPosition.srsName,
    },
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [defaultPosition.centerX, defaultPosition.centerY],
            [
              defaultPosition.centerX + 100000,
              defaultPosition.centerY + 1100000,
            ],
            [
              defaultPosition.centerX + 1100000,
              defaultPosition.centerY + 100000,
            ],
            [defaultPosition.centerX, defaultPosition.centerY],
          ],
        ],
      },
      properties: {
        label: "I am a polygon!",
        test_property: "polygon feature",
      },
    },
  ],
};

var addPolygonFeatureParams = [
  polygonGeojsonObject,
  {
    // Add options here
  },
];

var WKT = `POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322,
382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))`;

// layerId for forest vegetation map
var queryLayerId = 492;

// ###################### //
// ###### Markers ###### //
// ###################### //

var MARKER_ID = "TEST_MARKER";

var testMarker = {
  x: 0,
  y: 0,
  color: "ff0000",
  msg: "This is shape #2",
  shape: 2, // icon number (0-6)
  size: 12,
};

var markerShapeSvg =
  '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>';
var markerShapeLink = "http://oskari.org/logo.png";

var infoboxContent = [
  {
    html: "Test Marker Popup Content",
  },
];

var markerInfobox = [
  "InfoBoxId",
  "Marker info box header",
  infoboxContent,
  {
    marker: MARKER_ID,
  },
  {
    mobileBreakpoints: {
      width: 0,
      height: 0,
    },
    hidePrevious: true,
  },
];
// ###################### //
// ###### UI ###### //
// ###################### //

// # Show or hide info box
var myInfoBox = [
  "myInfoBox",
  "Generic info box",
  [
    {
      html: "<div>Map position info:</div>",
    },
    {
      html:
        "<div>Center: " +
        defaultPosition.centerX +
        ", " +
        defaultPosition.centerY +
        "</div>"
    }
  ],
  {
    lon: defaultPosition.centerX,
    lat: defaultPosition.centerY,
  }
];

var infoboxId = myInfoBox[0];

// # Send UI event
var UIEvents = ["coordinatetool", "mapmodule.crosshair"];

// # Set cursor style
var cursorStyles = ["progress", "crosshair", "move", "pointer", "default"];

// ##################### //
// ##### Location ##### //
// ##################### //

var searchCriteria = "Helsinki";

// ##################### //
// ##### Supported ##### //
// ##################### //

var supportedEvents = [
  "AfterMapMoveEvent",
  "MapClickedEvent",
  "AfterAddMarkerEvent",
  "MarkerClickEvent",
  "RouteResultEvent",
  "FeedbackResultEvent",
  "SearchResultEvent",
  "UserLocationEvent",
  "DrawingEvent",
  "FeatureEvent",
  "InfoboxActionEvent",
  "InfoBox.InfoBoxEvent",
  "RPCUIEvent",
  "map.rotated",
  "MapTourEvent",
  "DataForMapLocationEvent",
  "StateChangedEvent",
];

var supportedFunctions = [
  "getSupportedEvents",
  "getSupportedFunctions",
  "getSupportedRequests",
  "getInfo",
  "resetState",
  "getCurrentState",
  "useState",
  "sendUIEvent",
  "getAllLayers",
  "getZoomRange",
  "zoomIn",
  "zoomOut",
  "zoomTo",
  "getPixelMeasuresInScale",
  "getMapBbox",
  "getMapPosition",
  "setCursorStyle",
  "getVectorFeatures",
  "getScreenshot",
  "getFeatures",
];

var supportedRequests = [
  "InfoBox.ShowInfoBoxRequest",
  "InfoBox.HideInfoBoxRequest",
  "MapModulePlugin.AddMarkerRequest",
  "VectorLayerRequest",
  "MapModulePlugin.AddFeaturesToMapRequest",
  "MapModulePlugin.RemoveFeaturesFromMapRequest",
  "MapModulePlugin.GetFeatureInfoRequest",
  "MapModulePlugin.MapLayerVisibilityRequest",
  "MapModulePlugin.RemoveMarkersRequest",
  "MapModulePlugin.MarkerVisibilityRequest",
  "MapMoveRequest",
  "MapTourRequest",
  "ShowProgressSpinnerRequest",
  "SetTimeRequest",
  "GetRouteRequest",
  "GetFeedbackServiceRequest",
  "GetFeedbackRequest",
  "PostFeedbackRequest",
  "SearchRequest",
  "ChangeMapLayerOpacityRequest",
  "MyLocationPlugin.GetUserLocationRequest",
  "DrawTools.StartDrawingRequest",
  "DrawTools.StopDrawingRequest",
  "MapModulePlugin.ZoomToFeaturesRequest",
  "MapModulePlugin.MapLayerUpdateRequest",
  "rotate.map",
  "StartUserLocationTrackingRequest",
  "StopUserLocationTrackingRequest",
  "ChangeMapLayerStyleRequest",
  "RearrangeSelectedMapLayerRequest",
];
