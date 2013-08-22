# Layer Selector

<table>
  <tr>
    <td>ID</td><td>admin-layerselector</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.integration.bundle.admin.layerselector.View)</td>
  </tr>
</table>

## Description

The bundle offers admin a listing for all the maplayers available in Oskari platform. The maplayers are grouped by topic or organization by selecting a tab in the upper part of the flyout. For each maplayer there is an icon presenting layer type (wms/wfs/base/wmts/vector)and an i-icon if the layer has a "dataurl" property. The admin can add new organizations and remove them. It is also possible to add new maplayers and remove old ones. Support for adding group and base layers and sublayers to them was added in Oskari version 1.13.

## TODO

* Add Inspire Themes (needs backend work)
* Handle capabilities query as far as possible in the backend
** There is too many exceptions etc. for clientside code to handle.
* GetMapLayers action route should return also empty organizations and classes
* Modal dialog when user is removing organization or layer
* Backend should return json if user is removing organization
* Backend should return error if user is removing organization which contains layer
* Map layer service should do something when layer is updated
* Backend should be configured to handle admin bundles based on user role
* Filter mechanism is not ready yet
* Add Organization & add Inspire theme needs some further work on layerSelector2 bundle
* When adding layer we should return also inspireName
* WFS layers...

## Screenshot

![screenshot](<%= docsurl %>images/layerselector.png)

## Bundle configuration

User needs to be admin to get this bundle


## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> AddMapLayerRequest </td><td> Sent out when user checks the layer checkbox</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Updates the UI with data from MapLayerService - if operation is 'add' (adds the maplayer), 'remove' (removes the maplayer) or 'update' (updates layers name)</td>
  </tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th> Event </th><th> When it happens</th>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> If admin creates a new layer or updates / removes old one - if operation is 'add' (adds the maplayer), 'remove' (removes the maplayer) or 'update' (updates layers name)</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [RightJS tooltips](http://rightjs.org/ui/tooltips/) </td>
    <td> https://github.com/nls-oskari/oskari/blob/master/libraries/rightjs/javascripts/right/tooltips.js </td>
    <td> RightJS UI component for showing tooltips - used to show tooltips on layer icons</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Oskari's Div handler bundle</td>
  </tr>
  <tr>
    <td> [Backend API](<%= docsurl %>backend/layerselector.html) </td>
    <td> N/A </td>
    <td> Get all Maplayers from backend</td>
  </tr>
  <tr>
    <td> [Oskari layerselector2](<%= docsurl %>framework/layerselector.html) </td>
    <td> N/A </td>
    <td> User can select maplayers when needed</td>
  </tr>
</table>
