# My Places

<table>
  <tr>
    <td>ID</td><td>myplaces2</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>/docs/oskari/api/#!/api/Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance)</td>
  </tr>
</table>

## Description

My places functionality.

External graphic can be activated by changing OpenLayers bundle version to openlayers-graphic-fill and giving new style as additional parameter to the Drawin plugin.
Adding external graphics in DrawPlugin.js:
```javascript
        var newStyle = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>\
        <sld:StyledLayerDescriptor version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld ./Sld/StyledLayerDescriptor.xsd">\
            <sld:NamedLayer>\
                <sld:Name>Polygon</sld:Name>\
                <sld:UserStyle>\
                    <sld:Name>Polygon</sld:Name>\
                    <sld:FeatureTypeStyle>\
                        <sld:FeatureTypeName>Polygon</sld:FeatureTypeName>\
                        <sld:Rule>\
                            <sld:Name>Polygon</sld:Name>\
                            <sld:Title>Polygon</sld:Title>\
                            <sld:PolygonSymbolizer>\
                                <sld:Fill>\
                                    <sld:GraphicFill>\
                                        <sld:Graphic>\
                                            <sld:ExternalGraphic>\
                                                <sld:OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.paikkatietoikkuna.fi/mml-2.0-theme/images/logo.png"/>\
                                                <sld:Format>image/jpg</sld:Format>\
                                                </sld:ExternalGraphic>\
                                            <sld:Size>20</sld:Size>\
                                        </sld:Graphic>\
                                    </sld:GraphicFill>\
                                </sld:Fill>\
                                <sld:Stroke>\
                                    <sld:CssParameter name="stroke">#006666</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-width">2</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-opacity">1</sld:CssParameter>\
                                    <sld:CssParameter name="stroke-dasharray">4 4</sld:CssParameter>\
                                </sld:Stroke>\
                            </sld:PolygonSymbolizer>\
                        </sld:Rule>\
                    </sld:FeatureTypeStyle>\
                </sld:UserStyle>\
            </sld:NamedLayer>\
        </sld:StyledLayerDescriptor>';


        // rewrite creation of drawPlugin in the start-function
        // register plugin for map (drawing for my places)
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin', newStyle);
```

## TODO

* ''Save external graphic patterns to the backend''

## Bundle configuration

No configuration is required

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>GetGeometryRequest</td><td>Returns drawing as a callback parameter</td>
  </tr>
  <tr>
    <td>StartDrawingRequest</td><td>Tells drawing plugin to start listening</td>
  </tr>
  <tr>
    <td>StopDrawingRequest</td><td>Tells drawing plugin to stop listening</td>
  </tr>
  <tr>
    <td>EditCategoriesRequest</td><td>Edit category</td>
  </tr>
  <tr>
    <td>DeleteCategoryRequest</td><td>Shows the corfirm delete -functionality</td>
  </tr>
  <tr>
    <td>PublishCategoryRequest</td><td>Shows the corfirm publish -functionality</td>
  </tr>
  <tr>
    <td>EditPlacesRequest</td><td>Shows place form</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.GetFeatureInfoActivationRequest</td><td></td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th> Event </th><th> When it is triggered/what it tells other components</th>
  </tr>
  <tr>
    <td> AddedFeatureEvent </td><td> Sent when a feature has been added</td>
  </tr>
  <tr>
    <td> FinishedDrawingEvent </td><td> Sent when a drawing has been finished</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[Library name](#link)</td><td>src where its linked from</td><td>*why/where we need this dependency*</td>
  </tr>
</table>

OR

This bundle doesn't have any dependencies.
