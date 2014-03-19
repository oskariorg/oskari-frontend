# CreateAnalysisLayer (POST)
1. Receives upload file path (zip) and attributes for user data layer
2. Unzips file set of supported import formats (shp)
3. Parses import dataa to Geotools featurecollection and to geoJSON
4. Stores all data (properties, geometry and style) to oskari_user_store db (iBatis)
4. Responses results back to front as userlayer json


## Parameters
-  multipart/form-data content type
-  file items and form field items


## Response

### Raw example
{
   wmsName:   	"Kulta10"
   params:   	Object {}
   baseLayerId:   	-1
   type:   	"userlayer"
   orgName:   	"oskari.org"
   renderingUrl:   	"/karttatiili/userlayer?"
   legendImage:   	""
   isQueryable:   	true
   refreshRate:   	0
   renderingElement:   	"oskari:user_layer_data_style"
   id:   	"userlayer_29"
   minScale:   	1500000
   source:   	"Tukes"
   realtime:   	false
   wmsUrl:   	"wfs"
   description:   	"ttt"
   name:   	"Kulta10"
   subtitle:   	""
   opacity:   	50
   maxScale:   	1
   fields:   	["Kivennäise", "Päätöspvm", "the_geom", 4 more...]
   options:   	Object {}
}


### Success
- response not null

### Failed
- response null
- TODO: add case info to response

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=CreateAnalysisLayer&analyse=%7B%22name%22%3A%22Analyysi_Tampereen%20%22%2C%22method%22%3A%22buffer%22%2C%22fields%22%3A%22all%22%2C%22layerId%22%3A262%2C%22layerType%22%3A%22wfs%22%2C%22methodParams%22%3A%7B%22distance%22%3A%22100%22%7D%2C%22opacity%22%3A100%2C%22style%22%3A%7B%22dot%22%3A%7B%22size%22%3A%224%22%2C%22color%22%3A%22CC9900%22%7D%2C%22line%22%3A%7B%22size%22%3A%222%22%2C%22color%22%3A%22CC9900%22%7D%2C%22area%22%3A%7B%22size%22%3A%222%22%2C%22lineColor%22%3A%22CC9900%22%2C%22fillColor%22%3A%22FFDC00%22%7D%7D%2C%22bbox%22%3A%7B%22left%22%3A328488%2C%22bottom%22%3A6821717.5%2C%22right%22%3A330198%2C%22top%22%3A6822648.5%7D%7D`

