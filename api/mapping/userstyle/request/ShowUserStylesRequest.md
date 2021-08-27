# ShowUserStylesRequest

Requests a user own styles to be shown for specific layer.

## Description

Opens flyout which shows user's styles for requested layer. If layer doesn't have any user defined style, then form is opened to add new style.

## Parameters

(* means the parameter is required)
<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* layerId</td><td> String</td><td> Identifier for requested layer.</td><td> </td>
</tr>
<tr>
  <td> showStyle</td><td> Boolean</td><td> Indicates that visualization form should be opened to create or edit style.</td><td> false</td>
</tr>
<tr>
  <td> styleName</td><td> String</td><td> Identifier for requested style. If not given then new style is created.</td><td></td>
</tr>
</table>

## Example

```javascript
Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [1]);
```