# MyPlaces (POST)
Proxies the request to GeoServer and returns all the myplaces for the user in GML.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td></td>
    <td>GML</td>
    <td>wfs:GetFeature request to GeoServer</td>
    <td>**true**</td>
  </tr>
</table>

## Response

### Success
wfs:FeatureCollection in GML.

### Error

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=MyPlaces`

With POST params:
```xml
<wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><wfs:Query typeName="feature:my_places" srsName="EPSG:3067" xmlns:feature="http://www.paikkatietoikkuna.fi"><ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:PropertyIsEqualTo matchCase="true"><ogc:PropertyName>uuid</ogc:PropertyName><ogc:Literal>FILTERED</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter></wfs:Query></wfs:GetFeature>
```

Response:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection numberOfFeatures="2" timeStamp="2013-05-02T15:53:50.851+03:00" xsi:schemaLocation="http://www.paikkatietoikkuna.fi http://nipsutu02.nls.fi:8080/geoserver/ows/wfs?service=WFS&amp;version=1.1.0&amp;request=DescribeFeatureType&amp;typeName=ows%3Amy_places http://www.opengis.net/wfs http://nipsutu02.nls.fi:8080/geoserver/schemas/wfs/1.1.0/wfs.xsd" xmlns:ows="http://www.paikkatietoikkuna.fi" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:wfs="http://www.opengis.net/wfs"><gml:featureMembers><ows:my_places gml:id="my_places.9270"><gml:name>foo</gml:name><ows:uuid>FILTERED</ows:uuid><ows:category_id>6066</ows:category_id><ows:created>2013-02-28T12:19:35.892+02:00</ows:created><ows:updated>2013-02-28T12:19:35.887+02:00</ows:updated><ows:geometry><gml:MultiSurface srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#3067"><gml:surfaceMember><gml:Polygon><gml:exterior><gml:LinearRing><gml:posList>381390.02310593 6674404.2979804 380710.02310593 6672124.2979804 382470.02310593 6671324.2979804 382930.02310593 6672964.2979804 381390.02310593 6674404.2979804</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></gml:surfaceMember></gml:MultiSurface></ows:geometry><ows:place_desc>bar</ows:place_desc><ows:link></ows:link></ows:my_places><ows:my_places gml:id="my_places.12392"><gml:name>test</gml:name><ows:uuid>FILTERED</ows:uuid><ows:category_id>6066</ows:category_id><ows:created>2013-04-30T14:06:00.003+03:00</ows:created><ows:updated>2013-04-30T14:06:00+03:00</ows:updated><ows:geometry><gml:MultiPoint srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#3067"><gml:pointMember><gml:Point><gml:pos>384310.02310593 6671974.2979804</gml:pos></gml:Point></gml:pointMember></gml:MultiPoint></ows:geometry><ows:place_desc>foo</ows:place_desc><ows:link></ows:link></ows:my_places></gml:featureMembers></wfs:FeatureCollection>
```
