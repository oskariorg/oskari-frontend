# Mapmodule Ol Cesium

## Description

Ol Cesium implementation of the mapmodule bundle.

## Bundle configuration

Configuration can be given when through `mapfull's` bundle configuration under `mapOptions`.

```javascript
{
    "resolutions" : [...],
    "srsName": "EPSG:3857",
    "terrain": {
        "providerUrl": "<url>",
        "ionAssetId": "<asset-id>",
        "ionAccessToken": "<your-ion-access-token>"
    }
}
```
* `terrain` and all it's children are optional. 
    * Using `providerUrl` one can set the TMS service end point. Supported terrain formats are heightmap-1.0 and quantized-mesh-1.0. 
    * When `ionAssetId` is provided, the terrain is streamed from Cesium ION service which also requires `ionAccessToken`. 
    * When `ionAccessToken` is provided without `ionAssetId` Cesium World Terrain is used for providing detailed terrain all over the globe.

## Bundle functions

### getCesiumScene

The function provides access to a `Cesium.Scene` object handling the 3D view.
