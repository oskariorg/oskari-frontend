/*
Switch map URL to test other maps
*/
var mapUrl = 'http://demo.oskari.org/?lang=en&uuid=8016f9be-131b-44ab-bcee-5055628dbd42';

// sets source
document.getElementById('map').src = mapUrl;
// sets domain (localhost is allowed)
var iFrameDomain = mapUrl.substring(0, mapUrl.indexOf('?'));
// init connection 
var iFrame = document.getElementById('map');
window.channel = OskariRPC.connect(
    iFrame,
    iFrameDomain
);

/*
Test parameters for specs
*/
var counter;

// ##################### //
// ##### General ##### //
// ##################### //

var general = {
  "ExpectedOskariVersion": "1.44.3",
  "ExpectedRPCVersion": "2.0.4",
  "IsSupported": true,
  "srsName": "EPSG:4326"
};

// ##################### //
// ##### Map ##### //
// ##################### //

var defaultPosition = {
  "centerX": 386020,
  "centerY": 6670057,
  "zoom": 0,
  "scale": 5805343,
  "srsName": "EPSG:3067"
};

var defaultLayer = {
  "Id": "base_35",
  "Opacity": 100,
  "visible": true,
  "name": "Taustakarttasarja",
};

// ##################### //
// ##### Features ##### //
// ##################### //

var pointGeojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': defaultPosition.srsName
    }
  },
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [defaultPosition.centerX, defaultPosition.centerY]
    },
    'properties': {
      'label': 'I am a point feature!',
      'test_property': "point feature"
    }
  }]
};

var addPointFeatureParams = [pointGeojsonObject, {
  layerId: 'VECTOR',
  clearPrevious: false,
  centerTo: true,
  cursor: 'zoom-in',
  featureStyle: {
    image: {
      shape: 4,
      size: 5,
      color: '#ff3300',
      stroke: '#000000'
    },
    text: {
      scale: 1.3,
      fill: {
        color: 'rgba(0,0,0,1)'
      },
      stroke: {
        color: 'rgba(255,255,255,1)',
        width: 2
      },
      labelProperty: 'label',
      offsetX: 65,
      offsetY: 8
    }
  }
}];

var lineGeojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': defaultPosition.srsName
    }
  },
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        [defaultPosition.centerX, defaultPosition.centerY],
        [defaultPosition.centerX + 100000, defaultPosition.centerY + 1100000]
      ]
    },
    'properties': {
      'label': "I am a line feature!",
      'test_property': "line feature"
    }
  }]
};

var addLineFeatureParams = [lineGeojsonObject, {
  layerId: 'VECTOR',
  clearPrevious: true,
  layerOptions: testLayerOptions,
  centerTo: true,
  cursor: 'zoom-in',
  featureStyle: {
    fill: {
      color: '#2200ff'
    },
    stroke: {
      color: '#2200ff',
      width: 3
    },
    text: {
      scale: 2.0,
      fill: {
        color: 'rgba(2,2,0,1)'
      },
      stroke: {
        color: 'rgba(0,255,1,1)',
        width: 0
      },
      labelProperty: 'label'
    }
  },
  prio: 4,
  //minScale: 1451336
}];

// Styling for object
var featureStyle = {
  fill: {
    color: 'rgba(0,0,0,0.3)',
  },
  stroke: {
    color: '#FF0000',
    width: 5
  },
  text : {
    scale : 2,
    fill : {
      color : 'rgba(0,0,0,1)'
    },
    stroke : {
      color : 'rgba(255,255,255,0)',
      width : 1
    },
    labelText: 'Test feature'
  }
};

var testLayerOptions = {
  'minResolution': 0,
  'maxResolution': 10000
};

// ###################### //
// ###### Markers ###### //
// ###################### //

var MARKER_ID = "TEST_MARKER";

var testMarker = {
  x: 0,
  y: 0,
  color: "ff0000",
  msg: 'This is shape #2',
  shape: 2, // icon number (0-6)
  size: 12
};

var markerShapeSvg = '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>';
var markerShapeLink = 'http://oskari.org/logo.png';

var infoboxContent = [{
  'html': 'Test Marker Popup Content'
}];

var markerInfobox = [
  'TEST_MARKER',
  'Marker info box header',
  infoboxContent, {
    marker: MARKER_ID
  }, {
    mobileBreakpoints: {
      width: 0,
      height: 0
    },
    hidePrevious: true
  }
];
// ###################### //
// ###### UI ###### //
// ###################### //

// # Show or hide info box
var myInfoBox =[
    "myInfoBox",
    "Generic info box",
    [
        {
            "html": "<div>Map position info:</div>"
        },
        {
            "html": "<div>Center: "+defaultPosition.centerX+", "+defaultPosition.centerY+"</div>",
            "actions": [
                {
                    "name": "My link 1",
                    "type": "link",
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params"
                    }
                },
                {
                    "name": "My link 2",
                    "type": "link",
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params"
                    }
                }
            ]
        },
        {
            "html": "<div>Zoom level: "+defaultPosition.zoom+"</div>"
        },
        {
            "actions": [
                {
                    "name": "My link 3",
                    "type": "link",
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params"
                    }
                },
                {
                    "name": "My link 4",
                    "type": "link",
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params"
                    }
                },
                {
                    "name": "My button 1",
                    "type": "button",
                    "group": 1,
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params",
                        "buttonInfo": "This button has group 1 and is placed to the same row with other actions that have the same group"
                    }
                },
                {
                    "name": "My button 2",
                    "type": "button",
                    "group": 1,
                    "action": {
                        "info": "this can include any info",
                        "info2": "action-object can have any number of params",
                        "buttonInfo": "This button has group 1 and is placed to the same row with other actions that have the same group"
                    }
                }
            ]
        }
    ],
    {
        "lon": defaultPosition.centerX,
        "lat": defaultPosition.centerY
    },
    {
        "colourScheme": {
            "bgColour": "#00CCFF",
            "titleColour": "#FFFFFF",
            "headerColour": "#00CCFF",
            "iconCls": "icon-close-white",
            "buttonBgColour": "#00CCFF",
            "buttonLabelColour": "#FFFFFF",
            "linkColour": "#000000"
        },
        "font": "georgia",
        "positioning": "left"
    }
];

var infoboxId = 'myInfoBox';

// # Send UI event
var UIEvents = [
  'coordinatetool',
  'mapmodule.crosshair'
];

// # Set cursor style
var cursorStyles = [
  "progress",
  "crosshair",
  "move",
  "pointer",
  "default"
];

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
  "map.rotated"
];

var supportedFunctions = [
  "getSupportedEvents",
  "getSupportedFunctions",
  "getSupportedRequests",
  "getInfo",
  "getAllLayers",
  "getMapBbox",
  "getMapPosition",
  "getZoomRange",
  "zoomIn",
  "zoomOut",
  "zoomTo",
  "getPixelMeasuresInScale",
  "resetState",
  "getCurrentState",
  "useState",
  "getFeatures",
  "setCursorStyle",
  "sendUIEvent",
  "getScreenshot"
];

var supportedRequests = [
  "InfoBox.ShowInfoBoxRequest",
  "InfoBox.HideInfoBoxRequest",
  "MapModulePlugin.AddMarkerRequest",
  "MapModulePlugin.AddFeaturesToMapRequest",
  "MapModulePlugin.RemoveFeaturesFromMapRequest",
  "MapModulePlugin.GetFeatureInfoRequest",
  "MapModulePlugin.MapLayerVisibilityRequest",
  "MapModulePlugin.RemoveMarkersRequest",
  "MapModulePlugin.MarkerVisibilityRequest",
  "MapMoveRequest",
  "ShowProgressSpinnerRequest",
  "GetRouteRequest",
  "GetFeedbackServiceRequest",
  "GetFeedbackRequest",
  "PostFeedbackRequest",
  "rotate.map",
  "SearchRequest",
  "ChangeMapLayerOpacityRequest",
  "MyLocationPlugin.GetUserLocationRequest",
  "DrawTools.StartDrawingRequest",
  "DrawTools.StopDrawingRequest",
  "MapModulePlugin.ZoomToFeaturesRequest",
  "MapModulePlugin.MapLayerUpdateRequest"
];
