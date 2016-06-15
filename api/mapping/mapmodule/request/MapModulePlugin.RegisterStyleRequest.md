# MapModulePlugin.RegisterStyleRequest

Allows user to add wellknown svg styles.

## Use cases

- Add wellknown styles

## Description

Requests a add wellknown svg styles a map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* key </td><td> String </td><td> key of wellknown styles, for example 'routing' (used in RoutingService) </td><td> </td>
</tr>
<tr>
  <td> \* styles </td><td> Object </td><td> Array of svg objects </td><td> </td>
</tr>
</table>

Parameters for styles object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> object key</td><td>wellknown marker name</td><td> </td>
</tr>
<tr>
  <td> offsetX</td><td>marker center x in pixel (from left to right)</td><td> </td>
</tr>
<tr>
  <td> offsetY</td><td>marker center y in pixel (from bottom to top)</td><td> </td>
</tr>
<tr>
  <td> data</td><td>svg marker data. Svg marker must be a 32 x 32 pixel size. Svg elements can also contains ``shading-color`` or ``normal-color`` classes. ``shading-color`` class is used to find element to add shading color if marker is added and color is defined (shading color autamaticallyt calculated). ``normal-color`` class is used to find element to add marker color.</td><td> </td>
</tr>
</table>
