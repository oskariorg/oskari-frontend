# WFS 2

## Short description

WFS 2 contains separate backend from other backend action routes and map portlet with own frontend bundle implementations. To build WFS 2 needs the oskari-server's oskari-base package. The communication between backend and frontend is done with Bayeux protocol supporting websocket with ajax fallback except image route. Service implements JSON API through Bayeux channels. Backend gets layer configurations and user permissions from the oskari-backend with HTTP GET requests if there is no data in redis.

## Dependencies

- Java
- Jetty
- CometD (Bayeux protocol)
- Geotools (WFS queries)
- Jackson (JSON)
- Axiom (XML)
- Jedis (Redis client)
- oskari-base

... other minor dependencies

## Interfaces (API channels)

The channels have been separated so that all the information coming to the server go through service channels and information to the clients are sent through normal channels. Service channels are sort of 'setters' and client channels are 'getters'. Also Bayeux protocol adds additional meta channels that send information about the client's connection state.

### Service channels

Service channels are implemented so that every channel does just one specific task. Almost every client event have their own service channel to send information to the server.

1. /service/wfs/init
2. /service/wfs/addMapLayer
3. /service/wfs/removeMapLayer
4. /service/wfs/setLocation
5. /service/wfs/setMapSize
6. /service/wfs/setMapLayerStyle
7. /service/wfs/setMapClick
8. /service/wfs/setFilter
9. /service/wfs/setMapLayerVisibility
10. /service/wfs/highlightFeatures

#### /service/wfs/init

Client sends the starting state to the server when the /meta/handshake is triggered. Inits the client's session in the server and starts the neccessary jobs for defined WFS layers.

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>session</td>
		<td>String</td>
		<td>Liferay portlet's JSESSIONID</td>
	</tr>
	<tr>
		<td>browser</td>
		<td>String</td>
		<td>Client's browser name</td>
	</tr>
	<tr>
		<td>browserVersion</td>
		<td>long</td>
		<td>Client's browser version number</td>
	</tr>
	<tr>
		<td>location.srs</td>
		<td>String</td>
		<td>Spatial reference system eg. EPSG:3067</td>
	</tr>
	<tr>
		<td>location.bbox</td>
		<td>ArrayList&lt;Double&gt;</td>
		<td>Bounding box values in order: left, bottom, right, top</td>
	</tr>
	<tr>
		<td>location.zoom</td>
		<td>long</td>
		<td>zoom level</td>
	</tr>
	<tr>
		<td>grid.rows</td>
		<td>int</td>
		<td>row count of bounds</td>
	</tr>
	<tr>
		<td>grid.columns</td>
		<td>int</td>
		<td>column count of bounds</td>
	</tr>
	<tr>
		<td>grid.bounds</td>
		<td>ArrayList&lt;ArrayList&lt;Double&gt;&gt;</td>
		<td>bounds of the tiles</td>
	</tr>
	<tr>
		<td>tileSize.width</td>
		<td>int</td>
		<td>tile width in pixels</td>
	</tr>
	<tr>
		<td>tileSize.height</td>
		<td>int</td>
		<td>tile height in pixels</td>
	</tr>
	<tr>
		<td>mapSize.width</td>
		<td>int</td>
		<td>map width in pixels</td>
	</tr>
	<tr>
		<td>mapSize.height</td>
		<td>int</td>
		<td>map height in pixels</td>
	</tr>
	<tr>
		<td>mapScales</td>
		<td>ArrayList&lt;Double&gt;</td>
		<td>map scales list which indexes are zoom levels</td>
	</tr>
	<tr>
		<td>layers</td>
		<td>Object</td>
		<td>keys are maplayer_ids (long) and values include definition of style</td>
	</tr>
</table>

##### Example

```javascript
{
		"session" : "87D1AB34CEEFEA59F00D6918406C79EA",
		"browser" : "safari",
		"browserVersion" : 537,
		"location": {
				"srs": "EPSG:3067",
				"bbox": [385800, 6690267, 397380, 6697397],
				"zoom": 8
		},
		"grid": {
				"rows": 5,
				"columns": 8,
				"bounds": [[345600,6694400,358400,6707200]..]
		},
		"tileSize": {
				"width": 256,
				"height": 256
		},
		"mapSize": {
				"width": 1767,
				"height": 995
		},
		"mapScales": [5669294.4, 2834647.2, 1417323.6, 566929.44, 283464.72, 141732.36, 56692.944, 28346.472, 11338.5888, 5669.2944, 2834.6472, 1417.3236, 708.6618],
		"layers": { 216: { "styleName": "default" } }
}
```

##### Response channels

- /wfs/image
- /wfs/properties
- /wfs/feature
- /error


#### /service/wfs/addMapLayer

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>styleName</td>
		<td>String</td>
		<td>loaded style for the given WFS layer</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId": 216,
		"styleName": "default"
}
```

##### Response channels

Doesn't return anything


#### /service/wfs/removeMapLayer

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId": 216
}
```

##### Response channels

Doesn't return anything


#### /service/wfs/setLocation

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>srs</td>
		<td>String</td>
		<td>Spatial reference system eg. EPSG:3067</td>
	</tr>
	<tr>
		<td>bbox</td>
		<td>ArrayList&lt;Double&gt;</td>
		<td>Bounding box values in order: left, bottom, right, top</td>
	</tr>
	<tr>
		<td>zoom</td>
		<td>long</td>
		<td>zoom level</td>
	</tr>
	<tr>
		<td>grid.rows</td>
		<td>int</td>
		<td>row count of bounds</td>
	</tr>
	<tr>
		<td>grid.columns</td>
		<td>int</td>
		<td>column count of bounds</td>
	</tr>
	<tr>
		<td>grid.bounds</td>
		<td>ArrayList&lt;ArrayList&lt;Double&gt;&gt;</td>
		<td>bounds of the tiles</td>
	</tr>
	<tr>
		<td>tiles</td>
		<td>ArrayList&lt;ArrayList&lt;Double&gt;&gt;</td>
		<td>bounds of tiles to render</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId": 216,
		"srs": "EPSG:3067",
		"bbox": [385800, 6690267, 397380, 6697397],
		"zoom": 8,
		"grid": {
				"rows": 5,
				"columns": 8,
				"bounds": [[345600,6694400,358400,6707200]..]
		},
		"tiles": [[345600,6694400,358400,6707200]..]
}
```

##### Response channels

- /wfs/image
- /wfs/properties
- /wfs/feature
- /error


#### /service/wfs/setMapSize

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>width</td>
		<td>int</td>
		<td>map width in pixels</td>
	</tr>
	<tr>
		<td>height</td>
		<td>int</td>
		<td>map height in pixels</td>
	</tr>
	<tr>
		<td>grid.rows</td>
		<td>int</td>
		<td>row count of bounds</td>
	</tr>
	<tr>
		<td>grid.columns</td>
		<td>int</td>
		<td>column count of bounds</td>
	</tr>
	<tr>
		<td>grid.bounds</td>
		<td>ArrayList&lt;ArrayList&lt;Double&gt;&gt;</td>
		<td>bounds of the tiles</td>
	</tr>
</table>

##### Example

```javascript
{
		"width": 1767,
		"height": 995,
		"grid": {
				"rows": 5,
				"columns": 8,
				"bounds": [[345600,6694400,358400,6707200]..]
		}
}
```

##### Response channels

Only changes session information about the map size. No response.


#### /service/wfs/setMapLayerStyle

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>styleName</td>
		<td>String</td>
		<td>loaded style for the given WFS layer</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId": 216,
		"styleName": "default"
}
```

##### Response channels

- /wfs/image
- /error


#### /service/wfs/setMapClick

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>longitude</td>
		<td>double</td>
		<td>389800</td>
	</tr>
	<tr>
		<td>latitude</td>
		<td>double</td>
		<td>6693387</td>
	</tr>
	<tr>
		<td>keepPrevious</td>
		<td>boolean</td>
		<td>if keeps the previous selections</td>
	</tr>
</table>

##### Example

```javascript
{
		"longitude" : 389800,
		"latitude" : 6693387,
		"keepPrevious": false
}
```

##### Response channels

Doesn't send images

- /wfs/mapClick
- /error


#### /service/wfs/setFilter

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>filter.geojson</td>
		<td>GeoJSON</td>
		<td>http://www.geojson.org/geojson-spec.html</td>
	</tr>
</table>

##### Example

```javascript
{
		"filter" : { "geojson": {..} }
}
```

##### Response channels

Doesn't send images

- /wfs/filter
- /error


#### /service/wfs/setMapLayerVisibility

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>boolean</td>
		<td>if layer is visible</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId" : 216,
		"visible" : true
}
```

##### Response channels

Sends updated features and image if the layer's visibility has changed to true

- /wfs/image
- /wfs/properties
- /wfs/feature
- /error


#### /service/wfs/highlightFeatures

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>featureIds</td>
		<td>ArrayList&lt;String&gt;</td>
		<td>selected feature ids of the given WFS layer</td>
	</tr>
	<tr>
		<td>keepPrevious</td>
		<td>boolean</td>
		<td>if keeps the previous selections</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId" : 216,
		"featureIds": ["toimipaikat.6398"],
		"keepPrevious": false
}
```

##### Response channels

Sends only image

- /wfs/image
- /error


### Client channels

Client channels are used to send information from the server to the client. Most of the service channels trigger client channel sends.

1. /wfs/image
2. /wfs/properties
3. /wfs/feature
4. /wfs/mapClick
4. /wfs/filter
5. /error

#### /wfs/image

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>srs</td>
		<td>String</td>
		<td>Spatial reference system eg. EPSG:3067</td>
	</tr>
	<tr>
		<td>bbox</td>
		<td>ArrayList&lt;Double&gt;</td>
		<td>Bounding box values in order: left, bottom, right, top</td>
	</tr>
	<tr>
		<td>zoom</td>
		<td>long</td>
		<td>zoom level</td>
	</tr>
	<tr>
		<td>type</td>
		<td>String</td>
		<td>"normal" or "highlight"</td>
	</tr>
	<tr>
		<td>keepPrevious</td>
		<td>boolean</td>
		<td>if keeps the previous image</td>
	</tr>
	<tr>
		<td>width</td>
		<td>int</td>
		<td>image width in pixels</td>
	</tr>
	<tr>
		<td>height</td>
		<td>int</td>
		<td>image height in pixels</td>
	</tr>
	<tr>
		<td>data</td>
		<td>String</td>
		<td>base64 data of the image</td>
	</tr>
	<tr>
		<td>url</td>
		<td>String</td>
		<td>resource url of the image</td>
	</tr>
</table>

##### Examples

###### for browsers that support base64 images

```javascript
{
		"layerId": 216,
		"srs": "EPSG:3067",
		"bbox": [385800, 6690267, 397380, 6697397],
		"zoom": 7,
		"type": "normal",
		"keepPrevious": false,
		"width": 1767,
		"height": 995,
		"url": <resourceURL>,
		"data": <base64Data>
}
```

###### other browsers

```javascript
{
		"layerId": 216,
		"srs": "EPSG:3067",
		"bbox": [385800, 6690267, 397380, 6697397],
		"zoom": 7,
		"type": "normal",
		"keepPrevious": false,
		"width": 1767,
		"height": 995,
		"url": <resourceURL>
}
```

#### /wfs/properties

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>fields</td>
		<td>ArrayList&lt;String&gt;</td>
		<td>feature property names of the given WFS layer</td>
	</tr>
	<tr>
		<td>locales</td>
		<td>ArrayList&lt;String&gt;</td>
		<td>feature property localizations of the given WFS layer</td>
	</tr>
</table>

##### Examples

```javascript
{
		"layerId" : 216,
		"fields": ["__fid",  "metaDataProperty",  "description",  "name",  "boundedBy",  "location",  "tmp_id",  "fi_nimi",  "fi_osoite",  "kto_tarkennus",  "postinumero",  "kuntakoodi",  "fi_url_1",  "fi_url_2",  "fi_url_3",  "fi_sposti_1",  "fi_sposti_2",  "fi_puh_1",  "fi_puh_2",  "fi_puh_3",  "fi_aoa_poik",  "fi_est",  "fi_palvelu_t",  "palveluluokka_2",  "org_id",  "se_nimi",  "se_osoite",  "se_url_1",  "se_url_2",  "se_url_3",  "se_sposti_1",  "se_sposti_2",  "se_puh_1",  "se_puh_2",  "se_puh_3",  "se_aoa_poik",  "se_est",  "se_palvelu_t",  "en_nimi",  "en_url_1",  "en_url_2",  "en_url_3",  "en_sposti_1",  "en_sposti_2",  "en_puh_1",  "en_puh_2",  "en_puh_3",  "en_aoa_poik",  "en_est",  "en_palvelu_t",  "x",  "y",  "the_geom",  "alku",  "en_osoite"],
		"locales": null
}
```


#### /wfs/feature

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>feature</td>
		<td>ArrayList&lt;Object&gt;</td>
		<td>feature values of the given WFS layer</td>
	</tr>
</table>

##### Examples

###### normal send

```javascript
{
		"layerId" : 216,
		"feature": ["toimipaikat.6398",  null,  null,  null,  null,  null,  6398,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "",  "01450",  "092",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  518,  811,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "Yhteispalvelu Vantaa - Korso",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  393893,  6692163,  "POINT (393893 6692163)",  "2013-01-04 10:01:52.202",  "Urpiaisentie 14"]
}
```

###### empty send

```javascript
{
		"layerId" : 216,
		"feature": "empty"
}
```

###### sent before of maxed feature search

```javascript
{
		"layerId" : 216,
		"feature": "max"
}
```


#### /wfs/mapClick

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>features</td>
		<td>ArrayList&lt;ArrayList&lt;Object&gt;&gt;</td>
		<td>selected features of the given WFS layer</td>
	</tr>
	<tr>
		<td>keepPrevious</td>
		<td>boolean</td>
		<td>if keeps the previous selections</td>
	</tr>
</table>

##### Examples

###### normal send

```javascript
{
		"layerId" : 216,
		"features": [
				["toimipaikat.6398",  null,  null,  null,  null,  null,  6398,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "",  "01450",  "092",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  518,  811,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "Yhteispalvelu Vantaa - Korso",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  393893,  6692163,  "POINT (393893 6692163)",  "2013-01-04 10:01:52.202",  "Urpiaisentie 14"],
				["toimipaikat.14631",  null,  null,  null,  null,  null,  14631,  "Kela, Vantaa / Korson yhteispalvelu",  "Urpiaisentie 14",  "",  "01450",  "092",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  503,  802,  "Kela, Vantaa / Korson yhteispalvelu",  "Urpiaisentie 14",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "Kela, Vantaa / Korson yhteispalvelu",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  393893,  6692163,  "POINT (393893 6692163)",  "2012-11-15 10:57:39.382",  "Urpiaisentie 14"]
		],
		"keepPrevious": false
}
```

###### empty send

```javascript
{
		"layerId" : 216,
		"features": "empty",
		"keepPrevious": false
}
```



#### /wfs/filter

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>features</td>
		<td>ArrayList&lt;ArrayList&lt;Object&gt;&gt;</td>
		<td>selected features of the given WFS layer</td>
	</tr>
</table>

##### Examples

###### normal send

```javascript
{
		"layerId" : 216,
		"features": [
				["toimipaikat.6398",  null,  null,  null,  null,  null,  6398,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "",  "01450",  "092",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  518,  811,  "Yhteispalvelu Vantaa - Korso",  "Urpiaisentie 14",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "Yhteispalvelu Vantaa - Korso",  "www.yhteispalvelu.fi",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  393893,  6692163,  "POINT (393893 6692163)",  "2013-01-04 10:01:52.202",  "Urpiaisentie 14"],
				["toimipaikat.14631",  null,  null,  null,  null,  null,  14631,  "Kela, Vantaa / Korson yhteispalvelu",  "Urpiaisentie 14",  "",  "01450",  "092",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  503,  802,  "Kela, Vantaa / Korson yhteispalvelu",  "Urpiaisentie 14",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "Kela, Vantaa / Korson yhteispalvelu",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  "",  393893,  6692163,  "POINT (393893 6692163)",  "2012-11-15 10:57:39.382",  "Urpiaisentie 14"]
		]
}
```

###### empty send

```javascript
{
		"layerId" : 216,
		"features": "empty"
}
```


#### /error

##### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>layerId</td>
		<td>long</td>
		<td>maplayer_id</td>
	</tr>
	<tr>
		<td>once</td>
		<td>boolean</td>
		<td>if should react only once</td>
	</tr>
	<tr>
		<td>message</td>
		<td>String</td>
		<td>key for error message (should be localized in frontend)</td>
	</tr>
</table>

##### Example

```javascript
{
		"layerId" : 216,
		"once": true,
		"message": "wfs_no_permissions"
}
```


### Meta channels

Meta channels are used in both frontend and backend to determine the state of the client's connection.

1. /meta/handshake
2. /meta/subscribe
3. /meta/connect
4. /meta/disconnect

#### /meta/handshake

Handshake of the connection. Tells needed information to the client about the connection. After handshake we can subscribe to channels.

#### /meta/subscribe

Information about subscriptions.

#### /meta/connect

Information about the current connections's state.

#### /meta/disconnect

Sent when disconnected. Used at the backend as a trigger to destroy user's session information.


## Structure

WFS 2 has a separate frontend and backend implementations. Backend is a standalone CometD Servlet (Java) and frontend is built inside Oskari as mapwfs2 bundle (JavaScript).

### mapwfs2 bundle [Frontend]

WfsLayerPlugin is the main component of the bundle. The functionalities are pretty much the same as in the old WFS implementation.

#### Initialization

The bundle doesn't have instance at all because it is started only as a mapfull plugin. Initialization is straight forwarded if the connection can be established without problems. Connection retrying is implemented so that with certain intervals and timeouts. If the connection can't be established it blocks the subscription and publishing init to the backend but the events will be still registered.

1. WfsLayerPlugin is started as a mapfull's plugin
2. Connects to the backend with the best viable connection type available
3. Subscribes to the client channels
4. Publishes initial information through '/service/wfs/init' channel to the backend
5. Registers to listen all the needed events

#### Events

Events can be triggered in any time after the registration. WfsLayerPlugin handles all the needed events for the bundle.

#### Channels

Client messages are listened after subscriptions. Mediator implements all the channel handling for client and service channels. Meta channels are handled in Connection.


### transport [Backend]

#### Class dependencies

![backend_uml](<%= docsurl %>images/wfs_backend_uml.png)

#### Initialization

When the servlet is started it initializes Bayeux protocol and adds services that uses it, Redis connection and saved schemas. A service is hooked in a channel which has a linked processing method. Every channel goes through TransportService's processRequest method that has the basic parameter, session handling and forwarding requests to channel specific methods.

#### Channels

The servlet listens to service channels and responses with appropriate client channels. Every sent client channel message links to some service channel publish of the client. So servlet doesn't send any information without a request from client.


## User stories

Possible user actions are basicly frontend events that mapwfs2 handles. Event and request sequences can be traced with following lines in browser's console. Activity of the channels aren't shown in debug. The sequence images in the user stories are simplified.

```javascript
Oskari.$("sandbox").enableDebug();
Oskari.$("sandbox").popUpSeqDiagram();
```

### Moving map - AfterMapMoveEvent

![map_move](<%= docsurl %>images/wfs_map_move.png)

Function listening to AfterMapMoveEvent calls for Mediator's setLocation(). Backend gets a message and updates every WFS layer that is in the user's session and answers with updated properties, features and images. Upcoming sends trigger WFSPropertiesEvents, WFSFeatureEvents and WFSImageEvents. Updates the properties and features for object data and draws new tiles.

### Resizing map - MapSizeChangedEvent

Function listening to MapSizeChangedEvent calls for Mediator's setMapSize() and setLocation(). Backend gets a message and saves new map size in user's session. Every WFS layer in user's session are updated. The update process is same than for moving map.

### Adding a WFS layer - AfterMapLayerAddEvent

Function listening to AfterMapLayerAddEvent calls for Mediator's addMapLayer() and calls AfterMapMoveEvent's handler. Backend gets a message and adds the WFS layer to the user's session and answers with the new layer's properties, features and images. Upcoming sends trigger WFSPropertiesEvent, WFSFeatureEvents and WFSImageEvents. Updates the properties and features for object data and draws new tiles.

### Removing a WFS layer - AfterMapLayerRemoveEvent

Function listening to AfterMapLayerRemoveEvent calls for Mediator's removeMapLayer(). Backend gets a message and removes the WFS layer from the user's session and removes layer's ongoing jobs if there is any. Backend doesn't send anything to the client. Layer is also removed from Openlayers.

### Selecting a feature - WFSFeaturesSelectedEvent

![feature_select](<%= docsurl %>images/wfs_feature_select.png)

Function listening to WFSFeaturesSelectedEvent calls for Mediator's highlightMapLayerFeatures(). Backend gets a message and draws the features with highlight SLD and sends a higlighted images to the client. Upcoming sends trigger WFSImageEvents. Highlighted image is shown on top of the WFS layer's tile image.

Possible to keep the previous selection by holding CTRL.

### Clicking map - MapClickedEvent

![map_click](<%= docsurl %>images/wfs_map_click.png)

Function listening to MapClickedEvent calls for Mediator's setMapClick(). Backend gets a message and collects features of the given location for every active layer. Upcoming sends trigger WFSPropertiesEvent, WFSFeatureEvents. MapClickedEvent triggers also WFSFeaturesSelectedEvent and GetInfoResultEvent and finally ShowInfoBoxRequest that creates a popup with all selected features' information.

Possible to keep the previous selection by holding CTRL.

### Changing a WFS layer's style - AfterChangeMapLayerStyleEvent

Function listening to AfterChangeMapLayerStyleEvent calls for Mediator's setMapLayerStyle(). Backend gets a message and draws the features with new SLD and sends images to the client. Upcoming sends trigger WFSImageEvents. Images with new style replace old WFS layer's tile images.

* TODO: Event throw (not implemented yet for WFS)

### Changing a WFS layer's visibility - MapLayerVisibilityChangedEvent

Function listening to MapLayerVisibilityChangedEvent calls for Mediator's setMapLayerVisibility(). Backend gets a message and reacts if there was a change in visibility. The change is saved into user's session and if the visibility is changed to true then the layer is updated in same way than when map moves. Upcoming sends trigger if visibility is changed to true are WFSPropertiesEvents, WFSFeatureEvents and WFSImageEvents. Updates the properties and features for object data and draws new tiles.

### Changing a WFS layer's opacity - AfterChangeMapLayerOpacityEvent

Function listening to MapLayerVisibilityChangedEvent updates Openlayer's layer opacity. This functionality doesn't communicate with backend at all.

### Finishing selection tool - WFSSetFilter

Function listening to WFSSetFilter calls for Mediator's setFilter(). Backend gets a message and collects features of the given location for active layer. Upcoming sends trigger WFSPropertiesEvent, WFSFeatureEvents. Opens object data flyout highlighting filtered features.


## Cache

Caching is done with redis on backend. Basic key-value storage is used in most of the cases exluding schemas which use hash storage.

### Storages

#### Sessions

* key: Session_#{client}
* unique part is Bayeux client id
* expires in one day

* created for every user
* most of the service channel messages update session information excluding setFilter, setMapClick and highlightMapLayerFeatures
* key is deleted when user disconnects (/meta/disconnect)
* session keys are deleted when service closes

#### WFS Layers

* key: WFSLayer_#{layerId}
* unique part is map layer id
* expires in one day

* created for all requested layers
* data is fetched from multiple database tables

### Permissions

* key: Permission_#{session}
* unique part is JSESSIONID
* expires in one day

* created for all users
* data is fetched from Liferay
* permissions keys are deleted when service closes

### Schemas

* key: hSchemas
* field: schema's URL
* doesn't expire

* data is copied from cache only once in init (time taking operation)

### WFS Tiles

* key: WFSImage_#{layerId}_#{srs}_#{bbox[0]}:#{bbox[1]}:#{bbox[2]}:#{bbox[3]}_#{zoom}
* unique part contains map layer id and location information
* expires in one week

* data is saved if the tile isn't colliding boundary

### WFS Temp Tiles

* key: WFSImage_#{layerId}_#{srs}_#{bbox[0]}:#{bbox[1]}:#{bbox[2]}:#{bbox[3]}_#{zoom}_temp
* unique part contains map layer id and location information
* expires in one week

* data is saved if the tile is colliding boundary or map image (because of IE)
