/*
Test parameters
*/
var eventCounter;
var eventHandler;
var handlersToClean = [];

// ##################### //
// ##### General ##### //
// ##################### //

var general = {
    "ExpectedOskariVersion": "1.43.0",
    "ExpectedRPCVersion": "2.0.4",
    "IsSupported": true,
    "srsName": "EPSG:4326"
};

// ##################### //
// ##### Map ##### //
// ##################### //

var defaultPosition = {
    "centerX": 687936,
    "centerY": 7295056,
    "zoom": 0,
    "scale": 5805343,
    "srsName": "EPSG:3067"
};
var defaultLayer = {
    "Id": "4",
    "Opacity": 100,
    "visible": true,
    "name": "OSM Worldwide",
};

// ###################### //
// ###### UI ###### //
// ###################### //

// # Show a progress spinner

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
