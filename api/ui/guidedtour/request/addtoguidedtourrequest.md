# Guidedtour.AddToGuidedTourRequest

Add guide to guided tour.

## Use cases

- add bundle to guided tour

## Description

Adds the requesting bundle to the guided tour. The request parameter is a delegate object that has configuration and methods for generating the content of the dialog.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>* delegate</td><td> Object</td><td>guided tour delegate</td><td> </td>
</tr>
</table>

Parameters for delegate-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>bundleName</td><td>String</td><td>Bundle name to register guided tour</td><td> </td>
</tr>
<tr>
  <td>priority</td><td>Integer</td><td>Guided tour priority, 0 is highest</td><td> </td>
</tr>
<tr>
  <td>show</td><td>Function</td><td>Function to show wanted functionality, for example open flyout.</td><td> </td>
</tr>
<tr>
  <td>hide</td><td>Function</td><td>Function to hide wanted functionality, for example close flyout.</td><td> </td>
</tr>
<tr>
  <td>getTitle</td><td>String</td><td>Guided tour step title</td><td> </td>
</tr>
<tr>
  <td>getContent</td><td>String</td><td>Guided tour step content</td><td> </td>
</tr>
<tr>
  <td>getLinks</td><td>String</td><td>Guided tour step links</td><td> </td>
</tr>



</table>

## Examples


Add example guide step to latest step in fuided tour:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('Guidedtour.AddToGuidedTourRequest', [{
    bundleName: 'Test_guide',
    priority: 1000,
    show: function() {
        console.log('show test guide step');
    },
    hide: function() {
        console.log('hide test guide step');
    },
    getTitle: function(){
        return 'test';},
    getContent: function(){
        var content = jQuery('<div></div>');
        content.append('test message');
        return content;
    },
    getLinks: function(){
        return null
    }
}]);
```

## Related api

-