# Action routes

## View
GetAppSetup
AddView
DeleteView
UpdateView
GetViews
AdjustViewAccess
[Publish](<%= docsurl %>backend/actionroutes/publish.html)
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
[GetFeatureInfoWMS](<%= docsurl %>backend/actionroutes/getfeatureinfowms.html)
[GetSearchResult](<%= docsurl %>backend/actionroutes/getsearchresult.html)
[GetSotkaData](<%= docsurl %>backend/actionroutes/getsotkadata.html)
[GetPreview](<%= docsurl %>backend/actionroutes/getpreview.html)
HasAcceptedPublishedTermsOfUse
AcceptPublishedTermsOfUse
GetWfsFeatureData

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
    - GetFeatureDataXML
    - GetInspireThemes
    - SaveMapState
    - GetUserData
    - PublishMigration
    - GetProxyRequest