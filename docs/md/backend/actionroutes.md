# Action routes

* Added by MapFull as this is liferay specific
    - GetArticlesByTag

* Not used anymore
    - GetFeatureDataXML
    - GetInspireThemes
    - SaveMapState
    - GetUserData
    - PublishMigration
    - GetProxyRequest

## View
- [GetAppSetup](<%= docsurl %>backend/actionroutes/getappsetup.html)
- [AddView](<%= docsurl %>backend/actionroutes/addview.html)
- [DeleteView](<%= docsurl %>backend/actionroutes/deleteview.html)
- [UpdateView](<%= docsurl %>backend/actionroutes/updateview.html)
- [GetViews](<%= docsurl %>backend/actionroutes/getviews.html)
- [AdjustViewAccess](<%= docsurl %>backend/actionroutes/adjustviewaccess.html)
- [Publish](<%= docsurl %>backend/actionroutes/publish.html)

## Layers
- [GetMapLayers](<%= docsurl %>backend/actionroutes/getMapLayers.html)
- [GetBackendStatus](<%= docsurl %>backend/actionroutes/getBackendStatus.html)
- [GetAdminMapLayers](<%= docsurl %>backend/actionroutes/getAdminMapLayers.html)
- [GetWSCapabilities](<%= docsurl %>backend/actionroutes/getWSCapabilities.html)
- [GetMapLayerClasses](<%= docsurl %>backend/actionroutes/getMapLayerClasses.html)
GetWmsServices
- [SaveLayer](<%= docsurl %>backend/actionroutes/saveLayer.html)
- [SaveOrganization](<%= docsurl %>backend/actionroutes/saveOrganization.html)
- [DeleteLayer](<%= docsurl %>backend/actionroutes/deleteLayer.html)
- [DeleteOrganization](<%= docsurl %>backend/actionroutes/deleteOrganization.html)
- [GetLayerIds](<%= docsurl %>backend/actionroutes/getLayerIds.html)
- [GetStatsLayerSLD](<%= docsurl %>backend/actionroutes/getStatsLayerSLD.html)
- [GetStatsTile](<%= docsurl %>backend/actionroutes/getStatsTile.html)

## NEW WFS
- GetWFSLayerConfiguration (soon to be deprecated)

## WFS (soon to be deprecated)
- GET\_PNG\_MAP 
- GET\_HIGHLIGHT\_WFS\_FEATURE\_IMAGE
- GET\_XML\_DATA
- QUERY\_FIND\_RAW\_DATA\_TO\_TABLE
- GET\_HIGHLIGHT\_WFS\_FEATURE\_IMAGE\_BY\_POINT

## Data
- [GetFeatureInfoWMS](<%= docsurl %>backend/actionroutes/getfeatureinfowms.html)
- [GetSearchResult](<%= docsurl %>backend/actionroutes/getsearchresult.html)
- [GetSotkaData](<%= docsurl %>backend/actionroutes/getsotkadata.html)
- [GetPreview](<%= docsurl %>backend/actionroutes/getpreview.html)
- [HasAcceptedPublishedTermsOfUse](<%= docsurl %>backend/actionroutes/hasacceptedpublishedtermsofuse.html)
- [AcceptPublishedTermsOfUse](<%= docsurl %>backend/actionroutes/acceptpublishedtermsofuse.html)
- GetWfsFeatureData (soon to be deprecated)

## My places
- [PublishMyPlaceLayer](<%= docsurl %>backend/actionroutes/publishmyplacelayer.html)
- [FreeFindFromMyPlaceLayers](<%= docsurl %>backend/actionroutes/freefindfrommyplacelayers.html)
- [MyPlaces](<%= docsurl %>backend/actionroutes/myplaces.html)

## SOTKA
- [GetSotkaRegion](<%= docsurl %>backend/actionroutes/getsotkaregion.html)


# TODO
## View
* ViewId (parameter)
 	- GetAppSetup - parameter: **viewId**
 	- AddView - response: **id**
 	- DeleteView - parameter: **viewId**  & response: **id**
 	- UpdateView - parameter: **id** & response: **id**
 	- GetViews - response: **id**
 	- AdjustViewAccess - parameter: **id** & response: **id**
 	- Publish - response: lots of different 'id' keys

* Response http status codes? 

## Layers

## New WFS
## WFS
## Data

* GetFeatureInfoWMS
	- This is overloaded action route - instead of fetching WMS (as name suggests) it fetches also old WFS and MyPlaces info.
	- this seems to have dublicate sets of parameters(?)
		- x,y,width, height vs. lon, lat, bbox
* GetSearchResult
	- Errors should return meaningful information as JSON
* GetSotkaData 
	- indicator -> indicatorId (for the sake of unity)
	- some of the data should come from cache (e.g. minicipalities)
	- response data includes localization ()
* GetPreview
	- params: mapLayers vs. layerIds(GetLayerIds)
	- Front sends parameters (e.g. pageSize & pageTitle) which are not handled by GetPreviewHandler
	
* Terms of Use
	- we don't check which version of ToS user has accepted/viewed. There is no possibility to show any alerts for user that terms have been changed.
	- instead of true/false we could use json as response.

## My places
## SOTKA