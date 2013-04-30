# Action routes

## View
GetAppSetup
AddView
DeleteView
UpdateView
GetViews
AdjustViewAccess
Publish
GetThematicMap

## Layers
GetMapLayers
GetBackendStatus
GetAdminMapLayers
GetWSCapabilities
GetMapLayerClasses
GetWmsServices
SaveLayer
SaveOrganization
DeleteLayer
DeleteOrganization
GetLayerIds
GetStatsLayerSLD
GetStatsTile

## NEW WFS
GetWFSLayerConfiguration

## WFS
GET_PNG_MAP
GET_HIGHLIGHT_WFS_FEATURE_IMAGE
GET_XML_DATA
QUERY_FIND_RAW_DATA_TO_TABLE
GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT

## Data
GetFeatureInfoWMS
[GetSearchResult](<%= docsurl %>backend/actionroutes/getsearchresult.md)
GetFeatureDataXML
GetSotkaData
GetInspireThemes
GetPreview
HasAcceptedPublishedTermsOfUse
AcceptPublishedTermsOfUse
GetWfsFeatureData
GetProxyRequest

## My places
GetPublishedMyPlaceLayers
PublishMyPlaceLayer
FreeFindFromMyPlaceLayers
MyPlaces

## SOTKA
GetSotkaRegion

* added by MapFull as this is liferay specific
    - GetArticlesByTag

* Not used anymore
    - SaveMapState
    - GetUserData
    - PublishMigration