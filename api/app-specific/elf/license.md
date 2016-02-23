# ELF License

<table class="table">
  <tr>
    <td>ID</td><td>`elf-license`</td>
  </tr>
</table>

## Description

Extends metadatacatalogue search to show user license information. User can unconclude/conclude license to it self

## Bundle configuration

No configuration is required.

## Bundle state

No state handling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> `AddSearchResultActionRequest` </td>
    <td> Add 'License' link to metadata search results, when user can see license information. </td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>`jQuery`</td>
    <td>Assumes to be linked from the page</td>
    <td>UI building</td>
  </tr>
  <tr>
    <td>`metadatacatalogue`</td>
    <td>Assumes to be present in the application setup</td>
    <td>Adds the license linkt to metadatacatalogue results</td>
  </tr>
</table>
